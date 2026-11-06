---
title: "KVKK ve LLM: Bir Kişisel Veriyi RAG İndeksinden ve Ağırlıklardan Nasıl Silersiniz?"
description: "Silme talebi geldiğinde veri altı yerde durur: kaynak, chunk, vektör, önbellek, günlük ve ağırlıklar. Her biri için uygulanabilir bir silme stratejisi ve kod."
publishDate: "2026-08-13T23:51:00+03:00"
lang: tr
category: "Uygulama"
tags: ["Uygulama", "Yapay Zeka"]
translation: "data-erasure-rag-and-weights"
heroImage:
  src: "../../../assets/blog/covers/kvkk-llm-veri-silme.jpg"
  alt: "KVKK ve LLM: Bir Kişisel Veriyi RAG İndeksinden ve Ağırlıklardan Nasıl Silersiniz?"
---

Bir kullanıcı "verilerimi silin" dediğinde, klasik bir uygulamada bu bir `DELETE` sorgusudur. LLM sistemlerinde ise aynı kişisel veri en az altı yerde bulunabilir ve bunlardan biri geri döndürülemez. Bu yazı hukuki bir deneme değil; bir mühendisin uygulayabileceği bir silme mimarisi. Bir uyarıyla başlayayım: burada anlatılanlar mühendislik pratiğidir, hukuki görüş değildir — nihai değerlendirme için kurumunuzun hukuk birimiyle çalışın.

## Kişisel veri LLM sisteminde nerelerde durur?

Silme talebine hazırlanmanın ilk adımı envanter. Tipik bir RAG + ince ayar mimarisinde bir kişinin verisi şuralarda bulunur:

| Katman | Silinebilirlik |
| --- | --- |
| Kaynak belge deposu | Kolay — sıradan silme |
| Parçalanmış (chunk) metin tablosu | Kolay, ama kaynak izi tutuluyorsa |
| Vektör indeksi | Orta — indeks tipine göre yeniden oluşturma gerekebilir |
| Prompt/yanıt günlükleri ve izler | Sık unutulur — en büyük sessiz risk |
| Önbellekler (prompt cache, uygulama cache) | Süre dolumuna bağlı; envanterde nadiren yer alır |
| İnce ayarlı model ağırlıkları | Pratik olarak geri alınamaz |

Bu tablonun kendisi bir uyumluluk aracıdır: bir veri sahibi başvurusu geldiğinde hangi altı sistemi taramanız gerektiğini önceden bilmek, cevap süresini haftalardan saatlere indirir.

## Silinebilir katman: kaynak, chunk, vektör

İlk üç katman doğru tasarlandığında tek işlemde silinebilir. Anahtar tasarım kararı şu: **her chunk ve her vektör, hangi kaynak belgeden ve hangi veri sahibinden geldiğini taşımalı.** Bu alan sonradan eklenemez.

```sql
CREATE TABLE rag_parca (
  id           bigserial PRIMARY KEY,
  belge_id     uuid        NOT NULL,
  veri_sahibi  uuid,                       -- KVKK icin: kime ait
  metin        text        NOT NULL,
  gomme        vector(1536) NOT NULL,
  kaynak_yol   text        NOT NULL,
  eklendi      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON rag_parca (veri_sahibi) WHERE veri_sahibi IS NOT NULL;
CREATE INDEX ON rag_parca (belge_id);
```

```sql
-- Silme: tek islemde uc katman
BEGIN;
  DELETE FROM rag_parca  WHERE veri_sahibi = $1;   -- chunk + vektor birlikte
  UPDATE kaynak_belge SET silindi = true, icerik = NULL
    WHERE veri_sahibi = $1;
  INSERT INTO silme_kaydi (veri_sahibi, talep_id, katman, zaman)
    VALUES ($1, $2, 'rag', now());                 -- kanit birak
COMMIT;
```

Vektör tarafında bir ayrıntı önemli: pgvector gibi satır tabanlı çözümlerde satırı silmek vektörü de siler. Bazı harici vektör veritabanlarında ise silme işaretleme (tombstone) yapar ve gerçek temizlik indeks sıkıştırmasıyla gelir. Kullandığınız sistemin bunu nasıl yaptığını doğrulayın ve gerekiyorsa sıkıştırmayı silme akışının parçası hâline getirin.

<div class="callout"><strong>İpucu:</strong> Türetilmiş kayıtları unutmayın. Bir özet, bir bellek kaydı veya bir sınıflandırma sonucu, kaynak silindikten sonra da kişisel veri taşımaya devam edebilir. Her türetilmiş kaydın, hangi kayıtlardan üretildiğini saklaması gerekir; aksi hâlde silme eksik kalır.</div>

## Unutulan katman: önbellek ve günlükler

Uygulamada en sık atlanan yer burası. Prompt ve yanıt günlükleri, izleme kayıtları ve hata raporları çoğu zaman kişisel veriyi ham hâliyle taşır ve silme akışının kapsamı dışında kalır.

Üç kural bunu yönetilebilir kılar. **Birincisi:** günlüklere kişisel veriyi hiç yazmayın — maskelemeyi izleme katmanından önce yapın, sonra değil. **İkincisi:** yazmak zorundaysanız kısa saklama süresi verin ve bunu belgeleyin; otuz günlük bir saklama, silme talebinin kapsamını doğal olarak daraltır. **Üçüncüsü:** günlük kayıtlarına veri sahibi kimliğini bir alan olarak ekleyin; taranabilir olmayan bir günlükten silme yapılamaz.

Önbellek tarafında pratik yaklaşım, süre dolumuna güvenmek yerine bunu belgelemektir: hangi önbelleğin ne kadar yaşadığını ve silme talebi sonrası ne zaman temizlendiğini yazılı hâle getirin.

## Zor katman: ince ayarlı ağırlıklar

Burada dürüst olmak gerekiyor: **bir kişisel veriyi ince ayarlı model ağırlıklarından güvenilir biçimde silmenin pratik bir yolu yok.** Makine öğrenmesinde "unutturma" (machine unlearning) aktif bir araştırma alanı, ama üretim ölçeğinde garanti veren, denetlenebilir bir yöntem sunmuyor. Bu yüzden mühendislik cevabı silme değil _kaçınmadır_.

Uygulanabilir strateji üç adımlı:

1.  **Kişisel veriyi eğitim setine hiç sokmayın.** İnce ayar veri setini oluştururken PII tespiti ve maskeleme zorunlu bir adım olsun; bu, sonradan çözülemeyecek tek sorunu baştan engeller.
2.  **Bilgiyi ağırlığa değil indekse koyun.** Kişiye özgü bilgi gerekiyorsa RAG kullanın — RAG'ın en güçlü uyum argümanı budur: bilgi silinebilir bir katmanda durur.
3.  **Kaçınılmazsa yeniden eğitim planı yapın.** Eğitim setini sürümleyin ve hangi kaydın hangi sürüme girdiğini saklayın; böylece bir silme talebi geldiğinde temizlenmiş veriyle yeniden eğitmek en azından _mümkün_ olur.

```python
import re

TCKN = re.compile(r"\b[1-9][0-9]{10}\b")
IBAN = re.compile(r"\bTR[0-9]{2}[0-9A-Z]{20}\b")
EPOSTA = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.]+\b")
TELEFON = re.compile(r"\b(?:\+90|0)?5[0-9]{9}\b")

def tckn_gecerli(s: str) -> bool:
    """TCKN dogrulama: 11 hane, ilk hane 0 degil, iki kontrol hanesi."""
    if len(s) != 11 or not s.isdigit() or s[0] == "0":
        return False
    d = [int(c) for c in s]
    if (sum(d[0:9:2]) * 7 - sum(d[1:8:2])) % 10 != d[9]:
        return False
    return sum(d[:10]) % 10 == d[10]

def maskele(metin: str) -> str:
    """Egitim setine ve gunluklere yazmadan ONCE calistirin."""
    metin = TCKN.sub(lambda m: "[TCKN]" if tckn_gecerli(m.group()) else m.group(), metin)
    metin = IBAN.sub("[IBAN]", metin)
    metin = EPOSTA.sub("[EPOSTA]", metin)
    metin = TELEFON.sub("[TELEFON]", metin)
    return metin
```

Kontrol hanesi doğrulaması burada süs değil: doğrulama yapmadan on bir haneli her sayıyı maskelemek, sipariş numaralarını ve ürün kodlarını da bozar ve veri setinizi kullanılamaz hâle getirir.

## Tasarımla uyum: silinebilirlik için mimari

Uyumu sonradan eklenen bir katman değil, bir mimari özellik olarak düşünmek gerekiyor. Dört tasarım kararı yeterli:

-   **Veri sahibi kimliği her katmanda taşınır.** Kaynak, chunk, vektör, bellek kaydı, günlük — hepsinde.
-   **Türetilmiş kayıtlar kaynağını saklar.** Özet, hangi belgelerden üretildiğini bilir.
-   **Silme bir akıştır, bir sorgu değil.** Altı katmanı sırayla dolaşır, her adımı kaydeder ve sonunda bir kanıt üretir.
-   **Silme testi vardır.** Test ortamında bir veri sahibi oluşturup silin, sonra altı katmanda da arayın. Bu test yoksa silme akışınız çalışmıyordur.

Düzenleyici tarafta yeni bir kaynak da var: KVKK'nın 24 Kasım 2025 tarihli üretken yapay zekâ rehberi. Rehberin içeriği bir PDF içinde yayımlandığı için arama motorlarında bulunamıyor; doğrudan kurumun sitesinden indirin ve kendi sistemlerinize göre okuyun. Bu, mühendislik ekiplerinin çoğunun kaçırdığı bir kaynak.

## Aktarım, saklama ve belgeleme

Silme, uyumun yalnızca bir parçası. Bir LLM özelliği için üç şeyi daha yazılı hâle getirmeniz gerekir ve üçü de sağlayıcı seçimiyle doğrudan ilişkili.

1.  **Yurt dışına aktarım analizi.** Kullandığınız her model sağlayıcısı için verinin nereye gittiğini ve hangi hukuki dayanağa yaslandığını belgeleyin. Bu analiz sağlayıcı başına yapılır ve sağlayıcı değiştiğinde güncellenir.
2.  **Saklama yapılandırması.** Sağlayıcı tarafındaki veri saklama artık çoğu platformda yapılandırılabilir ve belgelenebilir bir kontroldür — varsayılanı kabul etmek yerine bilinçli olarak ayarlayın ve kararı kayıt altına alın.
3.  **İşleme kaydı.** Ajan denetim kaydınız, kişisel veri işleme kaydı olarak da iş görebilir. İki ayrı sistem kurmak yerine tek kaydı iki amaca hizmet edecek şekilde tasarlayın.

Son bir not: sistem talimatınızın da sızabileceğini varsayın. Sistem prompt'una müşteri adı, iç kural veya kişisel veri koymayın; OWASP'ın 2026 baskısı bu riski _Hidden Context Exposure_ adıyla yeniden adlandırdı ve hassas bilgi ifşasını listenin ikinci sırasında tuttu.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Bir kişisel veri LLM sisteminde altı yerde durur; silme akışı altısını da dolaşmalı ve kanıt üretmelidir.</li><li>Chunk ve vektör kayıtlarına veri sahibi kimliği yazın — bu alan sonradan eklenemez.</li><li>İnce ayarlı ağırlıklardan silme pratik değildir; çözüm kaçınmadır — kişiye özgü bilgiyi ağırlığa değil RAG indeksine koyun.</li><li>Günlükler ve önbellekler en sık atlanan katmandır; maskelemeyi izleme katmanından önce yapın.</li></ul></div>

<div class="faq"><details><summary>RAG indeksinden kişisel veri nasıl silinir?</summary><p>Chunk ve vektör kayıtlarında veri sahibi kimliği tutuyorsanız tek işlemde: parçaları silin, kaynak belgeyi işaretleyin ve silme kaydı oluşturun. Vektör veritabanınızın silmeyi gerçekten kaldırma mı yoksa işaretleme mi olarak yaptığını doğrulayın; işaretleme yapıyorsa indeks sıkıştırmasını da akışa ekleyin.</p></details><details><summary>İnce ayarlı modelden bir kişinin verisi silinebilir mi?</summary><p>Pratik ve denetlenebilir bir yolu yok. Makine öğrenmesinde unutturma aktif bir araştırma alanı ama üretim ölçeğinde garanti sunmuyor. Bu yüzden doğru yaklaşım silme değil kaçınmadır: kişisel veriyi eğitim setine hiç sokmayın, kişiye özgü bilgiyi RAG indeksinde tutun ve eğitim setini sürümleyerek yeniden eğitimi mümkün kılın.</p></details><details><summary>LLM özelliği için hangi belgeleri hazırlamalıyım?</summary><p>Asgari üç şey: sağlayıcı başına yurt dışına aktarım analizi, saklama süresi yapılandırmasının kaydı ve kişisel veri işleme kaydı. Ajan denetim kaydınızı bu üçüncüsünü de karşılayacak şekilde tasarlarsanız ikinci bir sistem kurmanız gerekmez. Nihai değerlendirme için hukuk biriminizle çalışın.</p></details></div>

---

Uyum, sonradan eklenen bir katman değil bir mimari özelliktir — ve silinebilirlik, o mimarinin en somut testidir. Hukuk alanında yapay zekâ uygulamaları için [hukukta yapay zeka](/posts/hukukta-yapay-zeka/), silinebilir bilgi katmanını kurmak için [RAG rehberi](/posts/rag-nedir-nasil-kurulur/), ve vektör tarafındaki silme davranışı için [vektör veritabanları](/posts/vektor-veritabanlari/) yazılarına bakabilirsiniz.
