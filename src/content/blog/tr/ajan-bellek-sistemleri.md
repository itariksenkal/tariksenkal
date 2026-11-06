---
title: "Ajan Bellek Sistemleri: Bağlam Penceresi Dışında Ne Saklarsınız?"
description: "Ajan belleği nedir, nasıl kurulur? Epizodik/semantik/prosedürel ayrımı, pgvector şeması, Mem0-Zep-Letta karşılaştırması ve bellek zehirlenmesine karşı kontroller."
publishDate: "2026-08-13T23:45:00+03:00"
lang: tr
category: "Ajanlar"
tags: ["Ajanlar", "Yapay Zeka"]
translation: "agent-memory-systems"
heroImage:
  src: "../../../assets/blog/covers/ajan-bellek-sistemleri.jpg"
  alt: "Ajan Bellek Sistemleri: Bağlam Penceresi Dışında Ne Saklarsınız?"
---

Bir ajanın "hatırlaması" iki farklı şeyi ifade eder ve bu ikisi karıştırıldığında mimari de karışır. Birincisi bağlam penceresinin içinde olan bitendir — o oturum sona erdiğinde kaybolur. İkincisi pencerenin dışında, kalıcı bir yerde duran şeydir. Bu yazı ikincisiyle ilgili: neyi saklamalı, nerede saklamalı, ne zaman silmeli ve saklanan şey zehirlendiğinde ne olur.

## Bellek nedir, bağlam değildir

**Bağlam mühendisliği**, sınırlı pencereye bu adımda neyin gireceğine karar vermektir. **Bellek**, pencerenin dışında kalıcı olarak neyin duracağına karar vermektir. Farklı sorular, farklı hata biçimleri, farklı araçlar.

> Bağlam bir çalışma masasıdır; bellek bir arşiv. Masayı temizlemek arşivi silmez.

2026'da bu ayrımın önemi arttı, çünkü bellek artık kendiniz kurduğunuz bir yapı olmak zorunda değil: sağlayıcı API'lerinde bellek ve bağlam düzenleme birer birincil öge hâline geldi. Yine de _neyi_ saklayacağınız kararı size ait ve zor olan da bu.

## Üç tür bellek ve neye yararlar

| Tür | Ne saklar, ne işe yarar |
| --- | --- |
| **Epizodik** | Olaylar: "kullanıcı 3 Mart'ta X siparişini iptal etti". Zaman damgalı, tekil, doğrulanabilir. Destek ve kişiselleştirme için asıl değerli tür. |
| **Semantik** | Genellemeler: "kullanıcı teknik ayrıntı seven bir geliştirici". Kullanışlı ama _çıkarım_ ürünü olduğu için yanlış olabilir. |
| **Prosedürel** | Nasıl yapılır bilgisi: "bu müşteride fatura akışı önce onay ister". Ajanın davranışını doğrudan değiştirir; en yüksek etkili, en riskli tür. |

Pratikte en sık yapılan hata, üçünü tek bir "notlar" tablosuna yığmak. Ayırmanız gerekir çünkü _yaşam süreleri_ farklıdır: epizodik kayıt asla değişmez (olay olmuştur), semantik kayıt zamanla eskir, prosedürel kayıt ise değiştiğinde _hemen_ güncellenmelidir — eski bir prosedür, yanlış bir eylem demektir.

## Dört bileşen: yazma, çıkarma, getirme, bakım

Haziran 2026'da yayımlanan bir sistem çalışması (arXiv:2606.24775) bellek sistemlerini bu dört bileşene ayırıyor ve **12 bellek sistemi ile 2 temel çizgiyi, 11 veri kümesine yayılan 5 iş yükünde** değerlendiriyor. Ana bulgu, mimari seçimini kolaylaştırmıyor ama dürüst: **hiçbir mimari her yerde kazanmıyor** — etkinlik, iş yükü ile mimarinin uyumuna bağlı. Çalışmanın ikinci bulgusu daha doğrudan işe yarıyor: **yerel bakım, global yeniden düzenlemeden daha maliyet-etkin.** Yani belleği periyodik olarak baştan sona yeniden yapılandırmak yerine, dokunulan kaydı yerinde güncellemek.

1.  **Temsil ve saklama:** kayıt ne biçimde durur — serbest metin, yapılandırılmış alan, embedding, ya da üçü birden.
2.  **Çıkarma:** konuşmadan hangi bilginin bellek olmaya değer olduğuna karar verme. En çok gürültü buradan girer.
3.  **Getirme ve yönlendirme:** hangi sorguda hangi kayıtların bağlama gireceği.
4.  **Bakım:** güncelleme, birleştirme, çelişki çözme, süresi dolanı silme. En çok ihmal edilen bileşen.

<div class="callout"><strong>İpucu:</strong> Bellek yazmayı varsayılan olarak açmayın. "Her konuşmadan not çıkar" kurgusu birkaç hafta içinde birbiriyle çelişen yüzlerce kayıt üretir ve getirme kalitesini düşürür. Yazmayı bir araç çağrısı yapın: model <em>bilinçli olarak</em> "bunu hatırla" demeli, ve o çağrı şema ile doğrulanmalı.</div>

## Çalışan bir pgvector şeması

Bellek için ayrı bir ürün almadan önce, elinizdeki PostgreSQL'in ne kadar yol aldığını görün. Aşağıdaki şema epizodik/semantik/prosedürel ayrımını, çok kiracılı izolasyonu, kaynak takibini ve süre dolumunu birlikte karşılar:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE ajan_bellek (
  id           bigserial PRIMARY KEY,
  kiraci_id    uuid        NOT NULL,          -- cok kiracili izolasyon
  ozne_id      uuid        NOT NULL,          -- kime/neye ait
  tur          text        NOT NULL
               CHECK (tur IN ('epizodik','semantik','prosedurel')),
  icerik       text        NOT NULL,
  gomme        vector(1536) NOT NULL,
  kaynak       text        NOT NULL,          -- 'kullanici' | 'arac' | 'cikarim'
  guven        real        NOT NULL DEFAULT 0.5,
  olusturuldu  timestamptz NOT NULL DEFAULT now(),
  gecerli_son  timestamptz,                   -- NULL = suresiz
  silindi      boolean     NOT NULL DEFAULT false
);

-- kiraci + tur bazli filtrelenmis benzerlik aramasi
CREATE INDEX ON ajan_bellek USING hnsw (gomme vector_cosine_ops);
CREATE INDEX ON ajan_bellek (kiraci_id, ozne_id, tur) WHERE NOT silindi;
```

```sql
-- getirme: her zaman kiraci ile filtreleyin, sonra benzerlige bakin
SELECT id, icerik, tur, kaynak, guven
FROM   ajan_bellek
WHERE  kiraci_id = $1
  AND  ozne_id   = $2
  AND  NOT silindi
  AND  (gecerli_son IS NULL OR gecerli_son > now())
ORDER  BY gomme <=> $3
LIMIT  8;
```

Üç ayrıntı bu şemayı üretime uygun kılıyor. `kaynak` alanı, kaydın kullanıcıdan mı, bir araçtan mı, yoksa modelin çıkarımından mı geldiğini ayırır — zehirlenme incelemesinin tek dayanağı budur. `gecerli_son`, semantik kayıtların sessizce eskimesini engeller. `silindi` bayrağı ise silme talebini denetlenebilir kılar; satırı gerçekten kaldırmadan önce iz bırakır.

## Araç manzarası: ne zaman kütüphane, ne zaman kendiniz?

Bu alanda birkaç olgun seçenek var: **Mem0**, **Zep**, **Letta** ve **LangMem**. Türkçe kaynaklarda bu isimlerin hiçbiri geçmiyor, oysa karar bunlarla veriliyor. Seçim kriteri şu üç soruya iniyor:

-   **Bakım politikanız var mı?** Yoksa hazır bir kütüphane işinizi görür; asıl değeri çıkarma ve birleştirme mantığında.
-   **Verinin nerede durduğu sizin için kritik mi?** Kritikse kendi PostgreSQL şemanız en basit ve en denetlenebilir yoldur.
-   **Bellek sorguları ürün mantığına karışıyor mu?** Karışıyorsa (ör. "yalnızca bu departmanın kayıtları") kendi katmanınızı yazmak kaçınılmazdır.

Kıyaslama tarafında dikkatli olun: hangi bellek kıyaslamalarının "standart" olduğu iddiası çoğunlukla o alanda ürün satan şirketlerden geliyor. Yayımlanmış bağımsız değerlendirmenin bulgusu da zaten mimarilerin evrensel olarak sıralanamayacağı yönünde. Kendi iş yükünüzde ölçün.

## Bellek zehirlenmesi ve silme hakkı

OWASP'ın 2026 ajan çerçevesi _Bellek ve Bağlam Zehirlenmesi_ni ASI06 olarak adlandırdı. Saldırı basit: güvenilmeyen bir kaynaktan gelen metin belleğe "gerçek" olarak yazılır ve haftalar sonra, tamamen farklı bir oturumda, ajanın davranışını değiştirir. Prosedürel bellekte bu doğrudan yanlış eylem demektir.

Dört kontrol bunu yönetilebilir kılar: **(1)** yazmayı şema doğrulamalı bir araç çağrısına bağlayın; **(2)** her kayda kaynak yazın ve çıkarım ürünü kayıtlara düşük güven verin; **(3)** prosedürel bellek yazımını insan onayına bağlayın — en yüksek etkili tür, en sıkı kapıyı hak eder; **(4)** getirmede kaynağa göre önceliklendirin, güvenilmeyen kaynaklı kaydı "kullanıcı şunu iddia etti" biçiminde alıntı olarak sunun.

Silme tarafı da mimari bir gerekliliktir. Bir kişinin verisinin silinmesi istendiğinde bellek üç yerde durabilir: satır olarak veritabanında, embedding olarak vektör indeksinde ve özet olarak başka bir kaydın içinde. Üçüncüsü en sinsisidir — "kullanıcı X, Y hakkında şikâyetçiydi" özeti, X'in kaydını sildiğinizde de kalır. Silme işlemini baştan şu şekilde tasarlayın: her türetilmiş kayıt, hangi kayıtlardan üretildiğini saklasın.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Bağlam pencerenin içi, bellek dışıdır; ikisini karıştırmak mimariyi de karıştırır.</li><li>Epizodik, semantik ve prosedürel belleği ayırın — yaşam süreleri ve risk profilleri farklıdır.</li><li>Bağımsız değerlendirme hiçbir bellek mimarisinin evrensel olarak kazanmadığını, yerel bakımın global yeniden düzenlemeden ucuz olduğunu buldu.</li><li>Her kayda kaynak yazın; zehirlenme incelemesi ve silme hakkı bu alan olmadan uygulanamaz.</li></ul></div>

<div class="faq"><details><summary>Ajan bellek sistemi nedir?</summary><p>Bir ajanın bağlam penceresi dışında kalıcı olarak sakladığı bilginin tamamı ve onu yöneten katman: yazma, çıkarma, getirme ve bakım. Oturum bitince kaybolan bağlamdan farkı kalıcılığıdır ve farklı hata biçimleri üretir — eskime, çelişki ve zehirlenme.</p></details><details><summary>Bellek için ayrı bir ürün almalı mıyım?</summary><p>Önce elinizdeki PostgreSQL ile pgvector'ün ne kadar yol aldığını ölçün; çok kiracılı izolasyon, kaynak takibi ve süre dolumu isteyen çoğu ekip için yeterlidir. Hazır kütüphanelerin asıl değeri çıkarma ve birleştirme mantığındadır; bu mantığı kendiniz yazmayacaksanız mantıklı bir tercihtir.</p></details><details><summary>Bellek zehirlenmesi nedir?</summary><p>Güvenilmeyen bir kaynaktan gelen içeriğin belleğe gerçek bilgi olarak yazılması ve sonraki oturumlarda ajanın davranışını değiştirmesidir. Gecikmeli olduğu için tespiti zordur. Yazmayı araç çağrısına bağlamak, her kayda kaynak yazmak ve prosedürel yazımları onaya tabi tutmak riski büyük ölçüde kapatır.</p></details></div>

---

Bellek, ajanı her seferinde sıfırdan başlayan bir araç olmaktan çıkarır — ama yalnızca ne sakladığınıza ve ne sildiğinize hâkimseniz. Pencerenin içine ne gireceği için [bağlam mühendisliği](/posts/baglam-muhendisligi/), getirme katmanının altyapısı için [vektör veritabanları](/posts/vektor-veritabanlari/), ve belleği kullanan döngünün tasarımı için [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/) yazılarına bakabilirsiniz.
