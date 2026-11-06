---
title: "Sohbet Botu mu, Arama Motoru mu? Fark Nedir, Hangisi Ne Zaman?"
description: "Sohbet botunun cevabı ile arama sonucunun farkı, hangisinin ne zaman kullanılacağı, arama motorlarındaki yapay zeka özetleri ve kaynakları kontrol etme yolları."
publishDate: "2026-11-15T09:17:00+03:00"
lang: tr
category: "Temeller"
tags: ["Yapay Zeka", "Arama Motorları", "Bilgi Doğrulama"]
translation: "chatbots-vs-search-engines"
heroImage:
  src: "../../../assets/blog/covers/sohbet-botu-ve-arama-motoru-farki.jpg"
  alt: "Bir sohbet botu cevabı ile arama motoru sonuç listesinin karşılaştırması"
---

Bir şey merak ettiğimizde eskiden tek bir refleksimiz vardı: arama kutusuna yazmak. Şimdi ikinci bir seçenek var: bir sohbet botuna sormak. İkisi de ekranda bir cevap gösteriyor ama bu cevaplar çok farklı yollardan geliyor ve farklı türde hatalar yapabiliyor. Üstelik arama motorları da artık sonuçların üstüne yapay zekayla yazılmış özetler koyuyor, yani sınır giderek bulanıklaşıyor. Dil modelleri ve bilgi erişimi üzerine çalışan biri olarak bu yazıda iki aracın nasıl çalıştığını sade bir dille karşılaştırıyor, hangisini ne zaman tercih etmenin mantıklı olduğunu ve gördüğünüz bilginin kaynağını nasıl kontrol edebileceğinizi anlatıyorum.

## Arama motoru ne yapar?

Klasik bir arama motoru, interneti önceden tarayıp sayfaları dev bir dizine kaydeder. Siz bir sorgu yazdığınızda bu dizinde eşleşen sayfaları bulur, yüzlerce sinyale göre sıralar ve size bir **bağlantı listesi** sunar. Cevabı kendisi yazmaz; sizi cevabın bulunabileceği yerlere yönlendirir.

Bunun önemli bir sonucu var: değerlendirme işi sizde kalır. Hangi siteye tıklayacağınıza, yazarın kim olduğuna, tarihin güncel olup olmadığına siz karar verirsiniz. Bu zahmetli olabilir ama şeffaftır; her bilginin bir adresi vardır.

## Sohbet botu ne yapar?

Bir sohbet botunun arkasında büyük bir dil modeli çalışır. Model, eğitim sırasında gördüğü çok büyük metin kütlesinden öğrendiği kalıplarla, sorunuza **yeni bir metin üretir**. Cevap akıcı, derli toplu ve doğrudan sorunuza göre şekillenmiş olur. Takip sorusu sorabilir, “daha basit anlat” diyebilir, metni özetletebilirsiniz.

Ancak burada iki kritik nokta var. Birincisi, model doğruyu değil, en olası devamı üretir; bu yüzden zaman zaman olmayan bir bilgiyi kendinden emin bir dille uydurabilir. Buna **halüsinasyon** denir. İkincisi, modelin bilgisi eğitim verisinin toplandığı tarihle sınırlıdır. Bazı sohbet botları cevap yazmadan önce internette arama yapıp bulduğu sayfaları kullanır ve kaynak gösterir; bazıları ise yalnızca modelin “hafızasından” konuşur. Hangisini kullandığınızı bilmek önemlidir. Modelin içini merak ederseniz [büyük dil modellerinin nasıl çalıştığını](/posts/llm-nasil-calisir/) ayrı bir yazıda anlattım.

## Yan yana karşılaştırma

| Özellik | Arama motoru | Sohbet botu |
|---|---|---|
| Çıktı | Sıralanmış bağlantı listesi | Yeni yazılmış, akıcı bir cevap |
| Kaynak | Her sonuç bir sayfaya bağlı | Kaynak gösterebilir de göstermeyebilir de |
| Güncellik | Dizin sürekli yenilenir | Web araması yoksa eğitim tarihiyle sınırlı |
| Tipik hata | Alakasız ya da düşük kaliteli sonuç | Kendinden emin ama yanlış bilgi (halüsinasyon) |
| Güçlü yanı | Belirli bir sayfayı, resmî kaynağı, güncel haberi bulmak | Açıklamak, özetlemek, karşılaştırmak, taslak yazmak |
| Sizin işiniz | Sonuçları seçmek ve değerlendirmek | Cevabı doğrulamak |

## Arama motorlarındaki yapay zeka özetleri

İki dünya artık iç içe geçiyor. Google, 14 Mayıs 2024’te duyurduğu “AI Overviews” özelliğiyle bazı sorgularda sonuçların en üstüne yapay zekayla yazılmış bir özet koymaya başladı; özellik önce ABD’de tüm kullanıcılara açıldı, ardından başka ülkelere yayıldı. Başka arama motorları ve tarayıcılar da benzer özetler sunuyor. Bu özetler genellikle birkaç kaynağa bağlantı verir, yani teknik olarak RAG’e benzer bir mantıkla çalışır: önce ilgili sayfalar bulunur, sonra model onlara dayanarak bir özet yazar.

Bu kullanışlı, ama davranışımızı da değiştiriyor. Pew Research Center, Mart 2025’te 900 ABD’li yetişkinin tarama verisini inceledi. Sonuçlara göre yapay zeka özeti görülen arama sayfası ziyaretlerinin yalnızca yüzde 8’inde klasik bir sonuca tıklanmış; özet olmayan sayfalarda bu oran yüzde 15. Özetin içindeki kaynak bağlantılarına tıklama ise ziyaretlerin yalnızca yüzde 1’inde gerçekleşmiş. Kısacası insanlar özeti okuyup çoğu zaman orada duruyor.

Sorun şu: özet yanlışsa ya da bir kaynağı yanlış yorumladıysa, kaynağa tıklamayan kullanıcı bunu fark etme şansını da kaybediyor.

<div class="callout"><strong>İpucu:</strong> Bir yapay zeka özeti önemli bir karar verdirecekse (sağlık, para, hukuk, seyahat kuralları), en az bir kaynak bağlantısını açıp ilgili cümlenin gerçekten orada yazdığını kontrol edin. Bu, çoğu zaman bir dakikadan kısa sürer.</div>

## Hangisini ne zaman kullanmalı?

Kesin bir kural yok ama pratikte işe yarayan bir ayrım var:

- **Arama motorunu tercih edin:** Belirli bir resmî sayfayı (bir kurumun duyurusu, kanun metni, başvuru formu) arıyorsanız; güncel haber, fiyat, saat, adres gibi değişken bilgiye ihtiyacınız varsa; birden fazla bakış açısını kendiniz görmek istiyorsanız.
- **Sohbet botunu tercih edin:** Bir kavramı kendi seviyenizde açıklatmak, uzun bir metni özetletmek, seçenekleri karşılaştırmak, bir e-posta ya da plan taslağı çıkarmak istiyorsanız; yani doğruluğunu sonradan kolayca kontrol edebileceğiniz ya da “mutlak doğru” gerektirmeyen işlerde.
- **İkisini birlikte kullanın:** Sohbet botuyla konunun haritasını çıkarın, hangi sorulara bakmanız gerektiğini öğrenin; sonra kritik bilgileri arama motoru ve birincil kaynaklarla teyit edin.

Bir benzetme: sohbet botu bilgili ama bazen yanılan bir arkadaş, arama motoru ise iyi düzenlenmiş bir kütüphane kataloğu gibidir. Arkadaş size konuyu hızla anlatır; kitabın kendisini ise katalogdan bulursunuz.

## Kaynakları nasıl kontrol edersiniz?

Yapay zeka asistanlarının kaynak kullanımı hâlâ zayıf bir nokta. Avrupa Yayın Birliği (EBU) koordinasyonunda ve BBC öncülüğünde, 18 ülkeden 22 kamu yayıncısının katıldığı ve Ekim 2025’te yayımlanan bir çalışmada, 14 dilde 3.000’den fazla haber sorusuna verilen cevaplar incelendi. Cevapların yüzde 45’inde en az bir önemli sorun bulundu; yüzde 31’inde kaynak gösterimiyle ilgili ciddi sorunlar (eksik, yanıltıcı ya da yanlış atıf), yüzde 20’sinde ise uydurma ya da güncelliğini yitirmiş ayrıntılar gibi önemli doğruluk sorunları vardı.

Bu yüzden şu alışkanlıklar işe yarar:

1. **Kaynak var mı?** Cevabın bir kaynağa bağlanıp bağlanmadığına bakın. Kaynak yoksa, bilgiyi doğrulanmamış kabul edin.
2. **Kaynak gerçekten bunu söylüyor mu?** Bağlantıyı açın ve ilgili cümleyi arayın. Modeller bazen gerçek bir sayfaya, orada yazmayan bir bilgiyi atfedebilir.
3. **Kaynak kim?** Resmî kurum, hakemli dergi ya da tanınmış bir yayın organı mı, yoksa adı belirsiz bir site mi?
4. **Tarih ne?** Özellikle mevzuat, fiyat ve teknoloji gibi hızla değişen konularda sayfanın tarihine bakın.
5. **İkinci bir kaynak:** Önemli bir iddiayı birbirinden bağımsız en az iki kaynakta görmeye çalışın.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Arama motoru bağlantı listesi sunar ve değerlendirmeyi size bırakır; sohbet botu yeni bir metin üretir ve doğrulamayı size bırakır.</li><li>Sohbet botları açıklama, özetleme ve taslak için güçlü; güncel ve resmî bilgi için arama motoru ve birincil kaynak daha güvenilir.</li><li>Arama motorlarındaki yapay zeka özetleri kullanışlı ama kaynağa tıklama oranını düşürüyor; kritik bilgide kaynağı mutlaka açın.</li><li>Kaynak gösterilmesi, bilginin doğru olduğu anlamına gelmez; cümlenin kaynakta gerçekten yazdığını kontrol edin.</li></ul></div>

<div class="faq"><details><summary>Sohbet botları internette arama yapıyor mu?</summary><p>Bazıları yapıyor, bazıları yapmıyor; aynı ürün de ayarlara veya soruya göre farklı davranabiliyor. Cevapta bağlantılı kaynaklar görüyorsanız büyük olasılıkla bir web araması yapılmıştır. Kaynak yoksa cevap modelin eğitim verisine dayanıyor olabilir ve güncel olmayabilir.</p></details><details><summary>Yapay zeka özeti yanlışsa ne yapmalıyım?</summary><p>Özetin altındaki kaynaklara ve klasik arama sonuçlarına bakın, bilgiyi resmî bir kaynaktan doğrulayın. Çoğu arama motoru bu özetler için bir geri bildirim düğmesi sunar; hatayı bildirmek de faydalıdır.</p></details><details><summary>Sohbet botu kaynak gösteriyorsa güvenebilir miyim?</summary><p>Daha güvenilirdir ama yeterli değildir. Araştırmalar, asistanların zaman zaman kaynağı yanlış yorumladığını ya da kaynağa orada olmayan bir bilgiyi atfettiğini gösteriyor. Önemli bilgilerde bağlantıyı açıp kontrol etmek en sağlam yoldur.</p></details><details><summary>Arama motorları yakında tamamen sohbet botuna mı dönüşecek?</summary><p>Bunu kimse kesin olarak bilemez. Şu an görülen eğilim, iki deneyimin birbirine yaklaştığı yönünde: arama motorları özet ve sohbet özellikleri ekliyor, sohbet botları ise web araması ve kaynak gösterimi ekliyor.</p></details></div>

---

**Kaynaklar**

- [Google – Generative AI in Search (14 Mayıs 2024)](https://blog.google/products/search/generative-ai-google-search-may-2024/)
- [Pew Research Center – Google users are less likely to click on links when an AI summary appears in the results](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
- [EBU – AI’s systemic distortion of news is consistent across languages and territories](https://www.ebu.ch/news/2025/10/ai-s-systemic-distortion-of-news-is-consistent-across-languages-and-territories-international-study-by-public-service-broadcaste)
- [EBU – News Integrity in AI Assistants raporu](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants)
- [NIST AI 600-1 – Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
