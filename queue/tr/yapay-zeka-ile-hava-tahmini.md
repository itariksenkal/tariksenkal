---
title: "Yapay Zeka ile Hava Tahmini: GraphCast, GenCast ve AIFS"
description: "Makine öğrenmesi tabanlı hava tahmin modelleri sayısal tahminden nasıl ayrılıyor, ECMWF AIFS ne zaman operasyonel oldu, neyi yapamıyorlar?"
publishDate: "2026-11-12T09:17:00+03:00"
lang: tr
category: "İklim"
tags: ["Yapay Zeka", "Meteoroloji", "İklim"]
translation: "ai-weather-forecasting"
heroImage:
  src: "../../../assets/blog/covers/yapay-zeka-ile-hava-tahmini.jpg"
  alt: "Küresel hava tahmini haritası ve sinir ağı görselleştirmesi"
---

Hava tahmini, onlarca yıl boyunca dünyanın en güçlü süper bilgisayarlarının en önemli işlerinden biri oldu. Atmosferi fizik denklemleriyle simüle eden bu modeller, bugün birkaç gün sonrasını şaşırtıcı bir isabetle tahmin edebiliyor. Son birkaç yılda ise sahneye farklı bir yaklaşım çıktı: geçmiş hava verisinden öğrenen ve bir tahmini dakikalar yerine saniyeler içinde üretebilen makine öğrenmesi modelleri. 2025'te Avrupa Orta Vadeli Hava Tahminleri Merkezi'nin (ECMWF) yapay zeka modelini operasyonel olarak kullanmaya başlaması, bu alanın artık yalnızca bir araştırma konusu olmadığını gösterdi. TRUBA gibi yüksek başarımlı hesaplama altyapılarında çalışmış biri olarak bu dönüşümü yakından izliyorum. Bu yazıda bu modellerin nasıl çalıştığını, klasik yöntemden nasıl ayrıldığını ve neyi henüz yapamadığını anlatacağım.

## Klasik yöntem: sayısal hava tahmini

Sayısal hava tahmini (NWP), atmosferi üç boyutlu bir ızgaraya böler ve her hücrede rüzgârın, sıcaklığın, nemin ve basıncın zaman içinde nasıl değişeceğini fizik denklemleriyle hesaplar. Süreç iki adımdan oluşur:

1. **Veri asimilasyonu:** Uydulardan, yer istasyonlarından, radyosondalardan, uçaklardan ve şamandıralardan gelen milyonlarca gözlem, atmosferin "şu anki" en iyi tahminini oluşturmak için modelle birleştirilir.
2. **Tahmin:** Bu başlangıç durumundan yola çıkılarak denklemler ileriye doğru çözülür.

ECMWF'nin fizik tabanlı modeli IFS, yaklaşık 9 km ızgara aralığında çalışıyor. Bu ölçekte bir tahmin, devasa bir hesaplama gücü gerektiriyor. Ayrıca hava kaotik bir sistem olduğu için, başlangıçtaki küçük belirsizlikleri hesaba katmak amacıyla aynı tahmin hafifçe farklı koşullarla onlarca kez çalıştırılır. Buna **topluluk (ensemble) tahmini** denir.

## Makine öğrenmesi modelleri ne yapıyor?

Makine öğrenmesi modelleri denklemleri çözmez. Bunun yerine, onlarca yıllık geçmiş atmosfer verisinden, özellikle ECMWF'nin ERA5 yeniden analiz veri setinden, "atmosferin şimdiki durumu buysa birkaç saat sonra ne olur?" sorusunun cevabını öğrenir. Tahmin, bu adımın art arda uygulanmasıyla günlerce ileriye uzatılır.

Öne çıkan modeller şunlar:

- **Pangu-Weather (Huawei):** 2023'te Nature'da yayımlandı ve orta vadeli tahminde makine öğrenmesinin fizik tabanlı modellerle rekabet edebileceğini gösteren ilk çalışmalardan biri oldu.
- **GraphCast (Google DeepMind):** 2023'te Science dergisinde yayımlandı. Yaklaşık 0,25 derece (ekvatorda ~25 km) çözünürlükte 10 günlük bir tahmini Google'ın TPU donanımında bir dakikadan kısa sürede üretebiliyor. Makalede, ECMWF'nin deterministik operasyonel modeli HRES'e karşı değerlendirilen 2.760 değişken ve süre kombinasyonunun %90'ında daha isabetli olduğu raporlanıyor.
- **GenCast (Google DeepMind):** Aralık 2024'te Nature'da yayımlandı. Tek bir tahmin yerine olasılıksal bir topluluk tahmini üretiyor. DeepMind'ın açıklamasına göre, 1.320 hedefin %97,2'sinde ECMWF'nin topluluk tahmini ENS'ten daha isabetli sonuç verdi.

| Model | Geliştiren | Tür | Önemli not |
|---|---|---|---|
| Pangu-Weather | Huawei | Deterministik | 2023, Nature |
| GraphCast | Google DeepMind | Deterministik | 2023, Science; ~0,25° |
| GenCast | Google DeepMind | Olasılıksal (topluluk) | Aralık 2024, Nature |
| AIFS Single | ECMWF | Deterministik | 25 Şubat 2025'ten beri operasyonel |
| AIFS ENS | ECMWF | Olasılıksal (topluluk) | 1 Temmuz 2025'ten beri operasyonel |

## ECMWF AIFS: araştırmadan operasyona

Bu alandaki en önemli eşiklerden biri, ECMWF'nin kendi makine öğrenmesi modeli **AIFS**'i (Artificial Intelligence Forecasting System) operasyonel hale getirmesiydi:

- **AIFS Single**, 25 Şubat 2025'te operasyonel oldu. ECMWF'ye göre birçok ölçütte fizik tabanlı modelleri geride bırakıyor; tropikal siklon rotaları dahil bazı alanlarda %20'ye varan iyileşme gösteriyor. Tahmin başına enerji tüketimi ise fizik tabanlı yaklaşıma göre yaklaşık 1.000 kat daha düşük.
- **AIFS ENS**, yani topluluk versiyonu, 1 Temmuz 2025'te operasyonel oldu ve tahmindeki belirsizliği de ifade etmeye başladı.

Burada önemli bir nokta var: AIFS, fizik tabanlı IFS'nin yerini almadı, onunla **yan yana** çalışıyor. ECMWF iki sistemi birbirini tamamlayan araçlar olarak görüyor. Ayrıca AIFS Single'ın ızgara aralığı 28 km, yani IFS'nin 9 km'sinden daha kaba.

<div class="callout"><strong>İpucu:</strong> Bir yapay zeka hava modeli hakkında "fizik tabanlı modeli geçti" haberi okuduğunuzda, hangi değişkenlerde, hangi tahmin süresinde ve hangi referans modele karşı değerlendirildiğine bakın. "Hedeflerin %90'ı" gibi ifadeler, tüm koşullarda üstünlük anlamına gelmez.</div>

## Bu modeller neyi yapamıyor?

Makine öğrenmesi hava modellerinin başarısı gerçek, ama sınırları da en az o kadar önemli:

- **Hâlâ fiziğe muhtaçlar:** Bu modellerin çoğu, tahmine başlamak için klasik veri asimilasyon sisteminin ürettiği başlangıç durumunu kullanıyor. Yani gözlem ağı ve fizik tabanlı altyapı ortadan kalkmış değil.
- **Eğitim verisinin dışı:** Modeller geçmişten öğrendiği için, kayıtlarda benzeri az olan aşırı olaylarda zorlanabilir. İklim ısındıkça "rekor" olaylar daha sık görülüyor; bu da önemli bir test alanı.
- **Bulanıklaşma:** Deterministik modeller uzun vadede, hata ortalamasını düşürmek için tahminleri yumuşatma eğiliminde olabilir. Bu, ortalama skoru iyileştirirken şiddetli olayların zirvelerini bastırabilir. Olasılıksal modeller bu sorunu kısmen hafifletiyor.
- **Çözünürlük ve yerel ayrıntı:** 25–28 km'lik bir ızgara, bir vadideki sisi veya ani bir yerel sağanağı yakalamakta zorlanır. Yerel tahmin için ek yöntemler gerekiyor.
- **Değişkenler:** Yağış gibi bazı değişkenler hâlâ zorlu. Örneğin AIFS'in ilk sürümündeki bir yağış sorunu, Ağustos 2025'teki bir güncellemeyle giderildi.
- **İklim projeksiyonu değil:** Bu modeller günler ölçeğinde hava tahmini için eğitildi. Onlarca yıllık iklim senaryoları farklı bir problem ve farklı araçlar gerektiriyor.

<div class="callout"><strong>Not:</strong> Fizik tabanlı modeller "neden" sorusuna cevap verebilir: bir süreci değiştirip sonucun nasıl değiştiğini görebilirsiniz. Makine öğrenmesi modelleri ise daha çok "ne olacak" sorusunda güçlü. İki yaklaşımın birlikte kullanılması bu yüzden mantıklı.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Klasik sayısal hava tahmini fizik denklemlerini çözer; makine öğrenmesi modelleri geçmiş veriden atmosferin nasıl değiştiğini öğrenir.</li><li>GraphCast, GenCast ve Pangu-Weather, birçok ölçütte fizik tabanlı modellerle rekabet edebildiklerini hakemli yayınlarla gösterdi.</li><li>ECMWF'nin AIFS'i 25 Şubat 2025'te, topluluk versiyonu AIFS ENS 1 Temmuz 2025'te operasyonel oldu; IFS ile yan yana çalışıyor.</li><li>Başlangıç verisi için fiziğe bağımlılık, aşırı olaylar, bulanıklaşma ve çözünürlük hâlâ temel sınırlar.</li></ul></div>

<div class="faq"><details><summary>Telefonumdaki hava durumu uygulaması yapay zeka mı kullanıyor?</summary><p>Uygulamalar farklı kaynaklardan veri alır; bazıları yapay zeka modellerini, bazıları fizik tabanlı modelleri, çoğu da bunların bir karışımını ve yerel düzeltmeleri kullanır. Hangisinin kullanıldığı genellikle uygulamanın veri sağlayıcısına bağlıdır.</p></details><details><summary>Yapay zeka modelleri meteorologların yerini alacak mı?</summary><p>Görünen o ki hayır. Modeller ne kadar iyileşirse iyileşsin, uyarıların yorumlanması, belirsizliğin iletilmesi ve yerel bilginin işe katılması insan uzmanlığı gerektiriyor.</p></details><details><summary>Bu modeller herkese açık mı?</summary><p>Durum modele göre değişiyor. ECMWF, AIFS tahmin verilerini açık veri olarak paylaşıyor; bazı araştırma modellerinin kodları ve ağırlıkları da yayımlandı. Kullanım koşullarını her modelin kendi sayfasından kontrol etmek gerekir.</p></details></div>

---

**Kaynaklar**

- [ECMWF: ECMWF's AI forecasts become operational](https://www.ecmwf.int/node/29308)
- [ECMWF: An update to ECMWF's machine-learned weather forecast model AIFS (arXiv)](https://arxiv.org/html/2509.18994v1)
- [Lam ve ark.: GraphCast: Learning skillful medium-range global weather forecasting (arXiv)](https://arxiv.org/abs/2212.12794)
- [Google DeepMind: GenCast predicts weather and the risks of extreme conditions with state-of-the-art accuracy](https://deepmind.google/discover/blog/gencast-predicts-weather-and-the-risks-of-extreme-conditions-with-sota-accuracy/)
- [ECMWF: AIFS machine learning data](https://ecmwf.int/en/forecasts/dataset/aifs-machine-learning-data)
