---
title: "Çoklu Ajan Sistemleri: 15 Kat Token, %90 Kazanç — Hangisi Sizin Durumunuz?"
description: "Çoklu ajan mimarisi ne zaman kazanır, ne zaman para yakar? İki birincil kaynağın uzlaştırılması, token çarpanı, hata modları ve somut bir karar tablosu."
publishDate: "2026-08-13T23:52:00+03:00"
lang: tr
category: "Ajanlar"
tags: ["Ajanlar", "Yapay Zeka"]
translation: "multi-agent-cost-reality"
heroImage:
  src: "../../../assets/blog/bimg-07.jpg"
  alt: "Çoklu Ajan Sistemleri: 15 Kat Token, %90 Kazanç — Hangisi Sizin Durumunuz?"
---

Çoklu ajan mimarisi hakkında iki sağlam mühendislik yazısı var ve ikisi tam ters şey söylüyor gibi görünüyor: biri çoklu ajanın tek ajanı %90 geçtiğini, diğeri çoklu ajan kurmamanız gerektiğini savunuyor. Aslında çelişmiyorlar — farklı iş türlerinden bahsediyorlar. Bu yazı, o uzlaşmayı ve kararı verdirecek sayıları anlatıyor. Türkçe kaynaklarda bu maliyet patlaması hiç sayısallaştırılmamış.

## Kazanç tarafındaki sayı

Anthropic'in çoklu ajan araştırma sistemi üzerine yazdığı mühendislik notu (13 Haziran 2025), bir yönetici-çalışan (orchestrator-worker) kurgusunun iç değerlendirmelerde tek ajanlı Opus 4'ü **%90,2** geçtiğini bildiriyor. Etkileyici bir sayı — ama aynı yazının içindeki ikinci bulgu, birincisini yeniden yorumlatıyor:

> Performans varyansının %80'ini tek başına token kullanımı açıklıyor.

Yani çoklu ajan mimarisi büyük ölçüde _yeterince token harcamayı sağladığı için_ çalışıyor. Bu, mimariyi değersizleştirmiyor; ama neyi satın aldığınızı netleştiriyor. Aynı işi tek ajanla ve daha yüksek bir bütçeyle yapmak da bir seçenek — ve genellikle daha basit bir seçenek.

## Maliyet tarafındaki sayı

Aynı kaynaktan gelen ikinci sayı, kararın diğer yarısı: **tek bir ajan, sıradan bir sohbet etkileşiminin yaklaşık 4 katı token kullanıyor; çoklu ajan sistemi ise yaklaşık 15 katı.**

Bu çarpanın pratik anlamını görmek için tabloyu kendi rakamlarınızla doldurun:

| Kurgu | Göreli token tüketimi |
| --- | --- |
| Tek turlu sohbet | 1× |
| Tek ajan (araçlı döngü) | ~4× |
| Çoklu ajan (yönetici + çalışanlar) | ~15× |

Yani çoklu ajana geçmek, aynı işi **yaklaşık dört kat** pahalıya yapmak demektir (4× → 15×). Bu kararı vermeden önce sorulacak soru şu: bu işte doğruluk, dört kat maliyet farkını haklı çıkaracak kadar değerli mi?

## Karşı argüman: neden çoğu iş için yanlış

Cognition'ın "Don't Build Multi-Agents" yazısı (12 Haziran 2025) meseleye tamamen farklı bir yerden bakıyor ve teknik argümanı güçlü: **alt ajanlar bağımsız çalıştığında, eylemler örtük kararlar taşır ve bu kararlar birbiriyle çelişir.**

Verdikleri örnek meseleyi anlatıyor: bir Flappy Bird klonu isteyen görevde bir alt ajan Mario tarzı varlıklar üretirken, diğeri onunla uyuşmayan bir kuş çiziyor. Hiçbir alt ajan hata yapmıyor; yalnızca ikisi de kendi örtük tasarım kararını veriyor ve kimse bu kararları paylaşmıyor.

Buradan çıkan öneri iki maddeli: **alt ajanlara yalnızca mesajları değil tam izleri (trace) aktarın** — çünkü karar mesajda değil eylemde saklıdır — ve varsayılan mimari olarak tek iş parçacıklı, doğrusal bir ajan artı bağlam sıkıştırma kullanın.

<div class="callout"><strong>İpucu:</strong> Bir alt ajana görev verirken talimatın belirsizliğini test edin: aynı talimatı iki kez çalıştırın ve çıktılar birbiriyle uyumlu mu bakın. Uyumlu değilse, o talimat çoklu ajan kurgusunda çelişki üretecek demektir. Belirsiz görev tanımı, çoklu ajan hatalarının en yaygın kaynağıdır.</div>

## Uzlaşma: tek cümlelik kural

İki kaynağı yan yana koyunca çelişki kayboluyor. Anthropic'in kazandığı iş türü _genişlik odaklı araştırma_: birbirinden bağımsız çok sayıda kaynağı paralel taramak. Cognition'ın kaybettiğini gösterdiği iş türü _birbirine bağımlı üretim_: bir dosyanın diğerini etkilediği kod yazımı.

> Çoklu ajan, paralelleştirilebilir ve okuma ağırlıklı işlerde kazanır; birbirine bağımlı ve yazma ağırlıklı işlerde kaybeder.

Anthropic'in kendi yazısı da bunu doğruluyor: paylaşılan bağlam gerektiren, yüksek bağımlılıklı ve paralelleştirilmesi zor alanları kötü uyum olarak listeliyor — ve bu listeye **kodlama işlerinin çoğunu** açıkça dâhil ediyor.

## Hata modları ve maliyet tavanı

Çoklu ajan kurmaya karar verdiyseniz, bilinen hata modlarını baştan kapatın. Birincil kaynaklarda sayılanlar:

-   **Aşırı alt ajan üretimi:** yönetici, gereğinden fazla çalışan başlatır. Kontrol: sert bir üst sınır.
-   **Bitmeyen arama:** çalışan "yeterli" kavramına sahip değilse aramaya devam eder. Kontrol: adım ve token bütçesi artı açık bir durma ölçütü.
-   **Yinelenen iş:** iki çalışan aynı şeyi yapar. Kontrol: görev tanımlarını çakışmayacak biçimde bölün ve sonuçları paylaşılan bir dosyaya yazdırın.
-   **Belirsiz görev tanımı:** en pahalı hata. Kontrol: her alt göreve girdi, beklenen çıktı biçimi ve başarı ölçütü yazın.
-   **Sıralı darboğaz:** paralel görünen kurgu aslında bir adımda beklemektedir; paralelliğin gerçekten var olduğunu izlerden doğrulayın.

Güvenlik tarafı da ihmal edilmemeli: OWASP'ın 2026 ajan çerçevesi **güvensiz ajanlar arası iletişimi (ASI07)** ve **zincirleme hataları (ASI08)** ayrı riskler olarak adlandırdı. Bir alt ajanın diğerine gönderdiği metin, alan taraf için hâlâ güvenilmeyen girdidir; ve bir alt ajanın hatası, üst ajanı sonsuz yeniden denemeye sokabilir.

Bu yüzden çoklu ajan sistemlerinde **global token bütçesi** bir güvenlik önlemidir, bir optimizasyon değil:

```python
class GorevButcesi:
    """Tum agac icin tek bir tavan: yonetici + tum alt ajanlar."""
    def __init__(self, azami_token: int, azami_alt_ajan: int = 5):
        self.azami_token = azami_token
        self.azami_alt_ajan = azami_alt_ajan
        self.harcanan = 0
        self.acilan = 0

    def alt_ajan_ac(self):
        if self.acilan >= self.azami_alt_ajan:
            raise RuntimeError("alt ajan ust siniri asildi")
        self.acilan += 1

    def harca(self, token: int):
        self.harcanan += token
        if self.harcanan > self.azami_token:
            raise RuntimeError(
                f"gorev butcesi asildi: {self.harcanan}/{self.azami_token}")
```

## Karar tablosu

| İşin niteliği | Mimari |
| --- | --- |
| Çok kaynaklı, paralel, okuma ağırlıklı araştırma | Çoklu ajan |
| Alt görevler birbirinden bağımsız ve çıktıları birleştirilebilir | Çoklu ajan |
| Kod yazma, yeniden düzenleme, dosyalar arası tutarlılık | Tek ajan + bağlam sıkıştırma |
| Adımların birbirini beslediği doğrusal akış | Tek ajan |
| Maliyet duyarlı, hacimli iş | Tek ajan; gerekirse çabayı yükseltin |
| Doğruluğun maliyetten çok daha değerli olduğu tekil iş | Çoklu ajan veya koşum |

Son bir pratik öneri: çoklu ajana geçmeden önce _tek ajanı daha yüksek bütçeyle_ deneyin. Kazanç varyansının büyük kısmını token harcaması açıklıyorsa, bu deney genellikle mimari karmaşıklığa gerek olup olmadığını tek başına cevaplar — ve çok daha ucuza.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Çoklu ajan sistemi iç değerlendirmelerde tek ajanı %90,2 geçti — ama varyansın %80'ini tek başına token kullanımı açıklıyor.</li><li>Token çarpanı: sohbet 1×, tek ajan ~4×, çoklu ajan ~15×. Yani geçiş yaklaşık dört kat maliyet demektir.</li><li>Çoklu ajan paralelleştirilebilir ve okuma ağırlıklı işte kazanır; birbirine bağımlı ve yazma ağırlıklı işte — kodlamanın çoğu dâhil — kaybeder.</li><li>Geçmeden önce tek ajanı daha yüksek bütçeyle deneyin; çoğu zaman mimari karmaşıklık gerekmediğini gösterir.</li></ul></div>

<div class="faq"><details><summary>Tek ajan mı çoklu ajan mı?</summary><p>İş paralelleştirilebilir ve okuma ağırlıklıysa — çok sayıda bağımsız kaynağı taramak gibi — çoklu ajan kazanır. Adımlar birbirini besliyorsa ve çıktılar tutarlı olmak zorundaysa, kod yazımının çoğunda olduğu gibi, tek ajan artı bağlam sıkıştırma daha iyidir ve çok daha ucuzdur.</p></details><details><summary>Çoklu ajan maliyeti ne kadar artırıyor?</summary><p>Birincil kaynaktaki ölçüme göre tek ajan sıradan sohbetin yaklaşık 4 katı, çoklu ajan sistemi ise yaklaşık 15 katı token kullanıyor. Yani tek ajandan çoklu ajana geçiş kabaca dört kat maliyet artışı demektir; bu farkı haklı çıkaracak bir doğruluk kazancı olup olmadığını ölçün.</p></details><details><summary>Çoklu ajan sistemlerinde en sık hata nedir?</summary><p>Belirsiz görev tanımı. Alt ajanlar bağımsız çalıştığında her biri kendi örtük tasarım kararını verir ve bu kararlar çelişir; sonuç, tek tek doğru ama birlikte tutarsız çıktılardır. Her alt göreve girdi, beklenen çıktı biçimi ve başarı ölçütü yazmak bu hataların çoğunu önler.</p></details></div>

---

Çoklu ajan bir yetenek değil bir takas; doğru soru "kurabilir miyim" değil, "bu iş buna değer mi". Mimari seçenekler için [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/), maliyet kaldıraçlarının tamamı için [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/), ve işi doğru modele göndermenin daha ucuz yolu için [model yönlendirme ve kademeleme](/posts/model-yonlendirme-kademeleme/) yazılarına bakabilirsiniz.
