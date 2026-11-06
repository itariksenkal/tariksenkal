---
title: "Yapay Zekâ Ajanlarını Üretime Almak: Demo Çalışıyor, Peki Sistem?"
description: "Yapay zeka ajanı üretim ortamına nasıl alınır? Zaman aşımı, idempotency, devre kesici, sürümleme, kademeli dağıtım ve başarılı görev başına maliyet — kodla."
publishDate: "2026-08-13T23:43:00+03:00"
lang: tr
category: "Ajanlar"
tags: ["Ajanlar", "Yapay Zeka"]
translation: "agents-in-production"
heroImage:
  src: "../../../assets/blog/bimg-04.jpg"
  alt: "Yapay Zekâ Ajanlarını Üretime Almak: Demo Çalışıyor, Peki Sistem?"
---

Önce bir terim karışıklığını gidereyim: burada "üretim ortamı" fabrikadaki üretim hattı değil, yazılımın canlıda çalıştığı ortam anlamında. Türkçe aramalarda bu iki anlam sürekli birbirine karışıyor ve doğru içerik bulunamıyor. Konumuz şu: bir ajan demosu çalışıyor, peki onu gerçek kullanıcıların önüne koyduğunuzda ne olur? Cevap genellikle modelle değil, modelin etrafındaki her şeyle ilgilidir.

## Demo ile sistem arasındaki gerçek fark

Bu farkın artık yayımlanmış bir ölçüsü var. Anthropic'in 24 Mart 2026 tarihli koşum (harness) tasarımı çalışmasında aynı görev iki şekilde ölçüldü: yalın ajan **20 dakika ve 9 dolar**, tam koşum altında **6 saat ve 200 dolar**. Aynı görev, yirmi kat maliyet farkı. Ama üretime uygun çıktıyı veren, ikincisiydi.

> Ajanı üretime almak, ajanı hızlandırmak değil; ajanın etrafına başarısızlığı yakalayan bir sistem inşa etmektir.

Bu farkın nereden geldiğine bakınca liste tanıdık gelir: değerlendirme adımları, yeniden deneme, doğrulama, ara çıktıların saklanması, insan onayı. Yani ajanı üretime almak bir model sorunu değil, bir dağıtık sistem sorunudur — ve klasik dağıtık sistem araçları neredeyse olduğu gibi geçerlidir.

## Dağıtım topolojisi: senkron mu kuyruk mu?

İlk mimari karar bu ve en sık yanlış verilen karar da bu. Bir ajan görevi ortalama otuz saniye sürüyorsa ve bazen beş dakika sürüyorsa, onu bir HTTP isteğinin içine koymak yanlıştır: istemci zaman aşımına uğrar, kullanıcı sekmeyi kapatır, iş yarıda kalır ve siz de yarım işi ödersiniz.

| Durum | Topoloji |
| --- | --- |
| < 5 saniye, tek araç çağrısı | Senkron HTTP |
| 5–60 saniye, birkaç adım | Akış (streaming) + ilerleme olayları |
| \> 1 dakika veya değişken | Kuyruk + iş kimliği + yoklama/webhook |
| Saatlerce sürebilen, insan onaylı | Dayanıklı iş akışı + kontrol noktası |

Uzun süren işler için 2026'da protokol düzeyinde bir karşılık da geldi: MCP'nin `io.modelcontextprotocol/tasks` uzantısı dayanıklı görev tanıtıcıları tanımlıyor — `working`, `input_required`, `completed`, `failed`, `cancelled` durumları, `tasks/get` ile yoklama, `tasks/update` ile iş ortasında girdi, ve istemci çökse bile devam edebilme. Yani "uzun iş" artık kendi kurduğunuz bir yapı olmak zorunda değil.

## İdempotency, zaman aşımı ve yeniden deneme

Ajanların ürettiği en pahalı üretim hatası tekrar eden yan etkilerdir: aynı e-postanın iki kez gönderilmesi, aynı siparişin iki kez oluşturulması. Sebep hep aynıdır — bir zaman aşımı yaşanır, sistem yeniden dener, ama ilk çağrı aslında başarılı olmuştur.

Çözüm de klasiktir: yan etkisi olan her araç bir _idempotency anahtarı_ almalı ve aynı anahtarla gelen ikinci çağrı işi tekrarlamak yerine ilk sonucu dönmelidir.

```python
import hashlib, json, time

def idempotency_anahtari(gorev_id: str, arac: str, argumanlar: dict) -> str:
    govde = json.dumps(argumanlar, sort_keys=True, ensure_ascii=False)
    ham = f"{gorev_id}|{arac}|{govde}"
    return hashlib.sha256(ham.encode("utf-8")).hexdigest()[:32]

def guvenli_cagir(arac, argumanlar, gorev_id, depo, zaman_asimi=30):
    anahtar = idempotency_anahtari(gorev_id, arac.ad, argumanlar)
    onceki = depo.get(anahtar)
    if onceki is not None:
        return onceki                       # tekrar calistirma, sonucu don

    sonuc = arac.calistir(**argumanlar, timeout=zaman_asimi)
    depo.set(anahtar, sonuc, ttl=86400)     # 24 saat sakla
    return sonuc
```

Bunun yanına iki kural daha: **her araca zaman aşımı verin** (varsayılan sonsuz değildir, sizin verdiğinizdir) ve **yeniden denemeyi üstel geri çekilmeyle sınırlayın**. Yan etkisi olan araçlarda otomatik yeniden deneme, idempotency anahtarı olmadan asla açılmamalıdır.

<div class="callout"><strong>İpucu:</strong> MCP'nin 2026 revizyonunda akış koptuğunda isteğin kaybolduğunu ve istemcinin yeni bir istek kimliğiyle baştan gönderdiğini unutmayın. Bu, idempotency'yi bir iyi uygulama olmaktan çıkarıp protokol gereği hâline getiriyor.</div>

## Hata taksonomisi: neyin bozulduğunu adlandırın

"Ajan çalışmadı" bir hata raporu değildir. Üretimde işe yarayan ekiplerin ortak özelliği, hataları adlandırılmış sınıflara ayırmalarıdır — çünkü her sınıfın farklı bir düzeltmesi vardır:

-   **Araç hatası:** araç 500 döndü, zaman aşımına uğradı veya şemaya uymayan çıktı verdi. Düzeltme: araç katmanında, model tarafında değil.
-   **Yer belirleme hatası:** model doğru aracı yanlış parametreyle çağırdı. Düzeltme: şema ve açıklama netleştirme, örnek ekleme.
-   **Planlama hatası:** model yanlış aracı seçti veya adımı atladı. Düzeltme: araç sayısını azaltma, talimat kısaltma.
-   **Sonlanmama:** ajan bitirmiyor, aynı adımları tekrarlıyor. Düzeltme: adım bütçesi, ilerleme kontrolü, döngü tespiti.
-   **Bağlam taşması:** pencere doldu, model kalitesi düştü. Düzeltme: bağlam sıkıştırma veya oturum sıfırlama.
-   **Doğrulama hatası:** ajan bitirdiğini sanıyor ama çıktı yanlış. Düzeltme: ayrı bir değerlendirici — en pahalı ama en kritik olanı.

Bu sınıfları izleme etiketlerinize ekleyin. Haftalık dağılıma baktığınızda hangi katmanı iyileştirmeniz gerektiği kendiliğinden ortaya çıkar; onsuz herkes prompt'u değiştirmeye çalışır çünkü en görünür şey odur.

## Prompt sürümleme ve kademeli dağıtım

Prompt bir yapılandırma dosyası değil, koddur: davranışı değiştirir, geri alınabilir olmalıdır ve test edilmelidir. Üretimde şu üç şey standart olmalı.

1.  **Sürümleme:** her prompt bir sürüm etiketiyle dağıtılır ve her istek hangi sürümle çalıştığını kaydeder. Bir kalite düşüşü gördüğünüzde ilk soru "hangi sürüm" olacaktır.
2.  **Kademeli dağıtım:** yeni prompt trafiğin %5'ine açılır, metrikler karşılaştırılır, sonra genişletilir. Model sürümü yükseltmelerinde de aynısı geçerlidir — sağlayıcının "daha iyi" dediği model sizin görevinizde daha kötü olabilir.
3.  **Geri alma:** geri alma yolu dağıtımdan önce test edilir. Ajan sistemlerinde geri alma çoğu zaman yalnızca prompt'u değil, araç şemalarını ve bellek kayıtlarını da kapsar.

Ölçeceğiniz metrik seti de dardır ve dördü yeter: **görev başarı oranı**, **başarılı görev başına maliyet**, **p95 tamamlanma süresi** ve **insan müdahale oranı**. Dördü birden iyileşmiyorsa iyileşme yoktur; genellikle biri diğerinin karşılığında kazanılır.

## Üretim öncesi kontrol listesi

1.  Her aracın zaman aşımı, hız sınırı ve şema doğrulaması var mı?
2.  Yan etkili araçlar idempotency anahtarı alıyor mu?
3.  Adım, token ve alt-ajan bütçeleri tanımlı mı? Aşıldığında ne oluyor?
4.  Devre kesici var mı — arka arkaya N hata sonrası ajan durur mu?
5.  Her istek hangi prompt ve model sürümüyle çalıştığını kaydediyor mu?
6.  İz kaydı (trace) bir görevi baştan sona takip etmeye yetiyor mu?
7.  Geri alınamaz eylemler insan onayı gerektiriyor mu ve onay ekranı somut etkiyi gösteriyor mu?
8.  Başarısızlıkta kullanıcı ne görüyor? "Bir hata oluştu" bir ürün cevabı değildir.

Bu listenin çoğu maddesi ajanlara özgü değil; klasik üretim mühendisliği. Ajanlarda değişen tek şey, hata olasılığının çok daha yüksek ve hatanın çok daha yaratıcı olması. OWASP'ın 2026 LLM listesinde _aşırı yetki_ üçüncülüğe, _sınırsız tüketim_ dört basamak yukarı çıkmışsa, bunun sebebi tam olarak burasıdır: zarar üretimde, ajan katmanında oluşuyor.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Aynı görev yalın ajanla 20 dakika/9 dolar, tam koşumla 6 saat/200 dolar — üretime uygun çıktıyı veren ikincisiydi.</li><li>Bir dakikadan uzun süren ajan işlerini HTTP isteğine koymayın; kuyruk, iş kimliği ve kontrol noktası kullanın.</li><li>Yan etkisi olan her araç idempotency anahtarı almalı — MCP'nin yeni akış davranışıyla bu artık protokol gereği.</li><li>Hataları adlandırılmış sınıflara ayırın; aksi hâlde herkes en görünür şeyi, prompt'u değiştirmeye çalışır.</li></ul></div>

<div class="faq"><details><summary>Yapay zeka ajanı üretime nasıl alınır?</summary><p>Modeli değil, etrafındaki sistemi kurarak. Uygun dağıtım topolojisi (uzun işler için kuyruk), her araçta zaman aşımı ve şema doğrulaması, yan etkili araçlarda idempotency, adım ve token bütçeleri, devre kesici, prompt sürümleme ve kademeli dağıtım. Model seçimi bu listenin en kolay maddesidir.</p></details><details><summary>Ajan maliyetini nasıl ölçmeliyim?</summary><p>İstek başına değil, başarılı görev başına. Bir ajanın üç deneme sonunda bitirdiği iş, tek seferde biten işten pahalıdır ve bu fark istek başına metrikte görünmez. Her göreve bir kimlik verin, o kimliğe ait tüm çağrıların maliyetini toplayın ve başarı durumuna göre ayırın.</p></details><details><summary>Ajan sonsuz döngüye girerse ne yapmalı?</summary><p>Önlemek için üç kural: adım bütçesi, ilerleme kontrolü (son N adımda durum değişmediyse durdur) ve tekrar tespiti (aynı araç aynı parametrelerle üst üste çağrılıyorsa kes). Bunlara ek olarak toplam token bütçesi bir güvenlik ağı olarak çalışır; bütçe aşıldığında görev başarısız işaretlenip kuyruğa geri konur.</p></details></div>

---

Ajanı üretime almak, modele güvenmeyi bırakıp sisteme güvenmeye başlamaktır. Genel canlıya alma disiplini için [MLOps ve üretime alma](/posts/mlops-uretim/), döngünün mimari seçenekleri için [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/), ve neyin bozulduğunu görebilmek için [LLM gözlemlenebilirlik](/posts/llm-gozlemlenebilirlik/) yazılarına bakabilirsiniz.
