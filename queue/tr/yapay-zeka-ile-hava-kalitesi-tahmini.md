---
title: "Yapay Zeka ile Hava Kalitesi Tahmini Nasıl Yapılır?"
description: "İstasyon, meteoroloji ve uydu verisiyle hava kalitesi tahmini: CAMS gibi fizik tabanlı modeller, gradient boosting, LSTM, değerlendirme ve sınırlar."
publishDate: "2026-11-10T09:17:00+03:00"
lang: tr
category: "Çevre"
tags: ["Hava Kalitesi", "Yapay Zeka", "Makine Öğrenmesi"]
translation: "ai-air-quality-forecasting"
heroImage:
  src: "../../../assets/blog/covers/yapay-zeka-ile-hava-kalitesi-tahmini.jpg"
  alt: "Hava kalitesi tahmin haritası ve veri akışı"
---

Yarın sabah çocuğunuzu okula yürüterek mi götürmeli, yoksa dış mekândaki koşuyu bir gün ertelemeli misiniz? Bu kararlar için bugünkü ölçüm yetmez; yarının tahmini gerekir. Hava kalitesi tahmini, hava durumu tahminine benzer ama bir zorluğu daha vardır: yalnızca rüzgârı ve sıcaklığı değil, kirleticilerin nereden geldiğini, nasıl taşındığını ve atmosferde nasıl dönüştüğünü de hesaba katmak gerekir. Hava kirleticileri modelleme ve hava kalitesi tahmini üzerine çalışmış biri olarak, bu yazıda bir tahminin hangi verilerle, hangi yöntemlerle üretildiğini ve nerede zorlandığını genel hatlarıyla anlatmak istiyorum.

## Tahminin hammaddesi: üç veri kaynağı

İyi bir hava kalitesi tahmini genellikle üç tür veriyi birleştirir.

**1. Yer istasyonları:** Saatlik PM2.5, PM10, NO₂, O₃ ve SO₂ ölçümleri. En güvenilir veri budur, ama yalnızca istasyonun bulunduğu noktayı temsil eder ve arada eksik ölçümler olabilir.

**2. Meteoroloji:** Rüzgâr hızı ve yönü, sıcaklık, nem, yağış ve özellikle atmosferin dikey karışımını belirleyen sınır tabakası yüksekliği. Kışın rüzgârsız, durgun ve sıcaklık terselmesinin (inversiyon) olduğu günlerde kirletici yere yakın sıkışır. Pek çok kirlilik epizodu emisyondan çok meteorolojiyle açıklanır.

**3. Uydu ve model alanları:** Uydular geniş alanları kapsayan kolon ölçümleri sağlar; küresel modeller de istasyon olmayan bölgeler için tahmini alanlar üretir. Bunlar, çöl tozu taşınımı veya orman yangını dumanı gibi uzaktan gelen olayları yakalamak için özellikle değerlidir.

## Fizik tabanlı yaklaşım: kimyasal taşınım modelleri

Klasik yöntem, atmosferi fizik ve kimya denklemleriyle simüle etmektir. Bu modeller emisyon envanterlerini (trafik, sanayi, ısınma), meteorolojik tahmini ve kimyasal tepkimeleri birleştirerek kirleticinin üç boyutlu dağılımını hesaplar.

Avrupa'daki en bilinen örnek, Copernicus Atmosfer İzleme Servisi (CAMS). CAMS iki katmanlı bir tahmin sunuyor:

- **Küresel tahmin:** ECMWF'de çalışan sistemle günde iki kez güncellenen, beş gün ileriye uzanan atmosfer kompozisyonu tahminleri. Başlangıç koşulları uydu ve yer gözlemleriyle besleniyor.
- **Avrupa bölgesel tahmini:** Yaklaşık 0,1 derece (~10 km) çözünürlükte, dört gün ileriye uzanan ve on bir farklı hava kalitesi modelinin birleştirildiği bir topluluk (ensemble). Modellerin ortanca değeri tahmin olarak, aralarındaki yayılım ise belirsizliğin bir göstergesi olarak kullanılıyor.

Fizik tabanlı modellerin gücü, nedensellik içermeleridir: bir emisyon kaynağını değiştirirseniz sonucun nasıl değişeceğini sorabilirsiniz. Zayıf yanları ise emisyon envanterlerindeki belirsizlik, yüksek hesaplama maliyeti ve yerel ölçekte sistematik sapmalardır.

## Makine öğrenmesi yaklaşımı

Makine öğrenmesi modelleri denklemleri çözmez; geçmiş verideki ilişkileri öğrenir. Tipik bir istasyon bazlı tahmin şöyle kurulur: hedef, yarının PM2.5 değeridir; girdiler ise son günlerin ölçümleri, meteorolojik tahminler ve takvim bilgileridir.

- **Gradient boosting (XGBoost, LightGBM):** Tablo biçimli veride güçlü, hızlı ve yorumlanması görece kolay. Yayımlanmış birçok karşılaştırmada, özellikle geçmiş kirlilik değerleri girdi olarak eklendiğinde, iyi bir başlangıç noktası olarak öne çıkıyor.
- **LSTM ve diğer derin öğrenme modelleri:** Zaman serisindeki uzun bağımlılıkları yakalayabiliyor. Çok sayıda istasyon ve uzun veri geçmişi olduğunda avantajlı olabiliyor, ama daha fazla veri ve daha dikkatli ayar gerektiriyor.
- **Hibrit yaklaşımlar:** Fizik tabanlı modelin çıktısını makine öğrenmesiyle düzeltmek (istatistiksel son işlem) pratikte çok yaygın. CAMS bölgesel tahminlerinin yerel istasyonlara göre kalibre edilmesi üzerine yayımlanmış çalışmalar bunun bir örneği.

Basit bir istasyon modeli için özellik hazırlığı kabaca şöyle görünebilir:

```python
import pandas as pd

df["pm25_lag1"]  = df["pm25"].shift(1)    # dünkü değer
df["pm25_lag2"]  = df["pm25"].shift(2)
df["pm25_ort7"]  = df["pm25"].rolling(7).mean()
df["ay"]         = df.index.month          # mevsimsellik
df["hedef"]      = df["pm25"].shift(-1)    # yarının değeri
# + rüzgâr, sıcaklık, nem, sınır tabakası yüksekliği tahminleri
```

Son yıllarda bu iki dünyayı birleştiren büyük modeller de ortaya çıktı. Microsoft'un 2025'te Nature'da yayımlanan Aurora modeli, beş günlük küresel hava kirliliği tahminleri üretebiliyor; geliştiricilerin değerlendirmesine göre hedeflerin %74'ünde CAMS analizine karşı daha iyi sonuç verdi. Bu tür sonuçlar umut verici, ancak bağımsız ve uzun süreli doğrulamalara hâlâ ihtiyaç var.

<div class="callout"><strong>İpucu:</strong> Bir makine öğrenmesi modelini değerlendirmeden önce mutlaka basit bir referansla karşılaştırın: "yarın da bugün gibi olacak" (kalıcılık) tahmini. Hava kalitesi güçlü bir otokorelasyona sahip olduğu için, birçok model bu basit referansı sanıldığı kadar kolay geçemez.</div>

## Tahmin nasıl değerlendirilir?

Tek bir "doğruluk" yüzdesi yanıltıcı olabilir. Genelde birkaç ölçüt birlikte kullanılır:

- **RMSE ve MAE:** Ortalama hata büyüklüğü. RMSE büyük hataları daha çok cezalandırır.
- **Sapma (bias):** Model sistematik olarak fazla mı, az mı tahmin ediyor?
- **Korelasyon:** Günlük iniş çıkışlar yakalanıyor mu?
- **Kategori isabeti:** "Sağlıksız" gün gerçekten "sağlıksız" olarak tahmin edildi mi? Halk sağlığı açısından en önemli soru çoğu zaman budur; kötü günleri kaçırmak, iyi günlerde küçük hatalar yapmaktan daha maliyetlidir.

Bir başka kritik konu, veriyi zaman sırasına göre bölmektir. Rastgele bölünmüş bir test seti, geleceğe ait bilgiyi eğitime sızdırabilir ve sonuçları olduğundan iyi gösterebilir.

## Sınırlar: modeller nerede zorlanır?

- **Nadir olaylar:** Çöl tozu taşınımı, orman yangınları veya beklenmedik sanayi olayları geçmiş veride az olduğundan, salt veri odaklı modeller bunları kaçırabilir.
- **Değişen emisyonlar:** Yeni bir yol, kapanan bir santral ya da ısınmada yakıt değişimi, geçmişten öğrenilen ilişkileri bozabilir.
- **Meteoroloji hatası:** Hava kalitesi tahmini, meteorolojik tahmin kadar iyidir. Rüzgâr ve inversiyon tahmini yanlışsa, kirlilik tahmini de yanlış olur.
- **İstasyon temsiliyeti:** Bir cadde kenarındaki istasyonla bir park içindeki istasyon aynı mahallede çok farklı değerler ölçebilir.
- **Veri boşlukları:** Arızalar ve bakım dönemleri eksik veri yaratır; bunların nasıl doldurulduğu sonuçları etkiler.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Hava kalitesi tahmini istasyon ölçümlerini, meteorolojiyi ve uydu ile model alanlarını birleştirir.</li><li>CAMS gibi fizik tabanlı sistemler nedensellik sunar; makine öğrenmesi yerel ölçekte hızlı ve isabetli düzeltmeler yapabilir.</li><li>En iyi sonuçlar çoğu zaman hibrit yaklaşımlardan gelir.</li><li>Değerlendirmede kalıcılık referansı, zaman sıralı bölme ve "kötü günleri yakalama" başarısı kritik önemdedir.</li></ul></div>

<div class="faq"><details><summary>Makine öğrenmesi fizik tabanlı modellerin yerini alacak mı?</summary><p>Kısa vadede ikisinin birlikte kullanılması daha olası görünüyor. Makine öğrenmesi hız ve yerel isabet sağlarken, fizik tabanlı modeller emisyon senaryolarını test etmek ve nadir olayları anlamak için hâlâ gerekli.</p></details><details><summary>Kaç gün ileriyi tahmin etmek mümkün?</summary><p>Operasyonel sistemler tipik olarak birkaç gün ileriye tahmin üretir; örneğin CAMS küresel tahmini beş gün, Avrupa bölgesel tahmini dört gün ileriye uzanır. Doğruluk, zaman ilerledikçe meteorolojik belirsizlikle birlikte azalır.</p></details><details><summary>Kendi şehrim için basit bir model kurabilir miyim?</summary><p>Evet, açık istasyon verisi ve meteoroloji verisiyle gradient boosting tabanlı basit bir model kurmak mümkün. Önemli olan, sonucu kalıcılık referansıyla dürüstçe karşılaştırmak ve resmî tahminlerin yerine koymamaktır.</p></details></div>

---

**Kaynaklar**

- [Copernicus Atmosphere Monitoring Service: Global atmospheric composition forecasts](https://atmosphere.copernicus.eu/global-atmospheric-composition-forecasts-were-never-so-fine-tuned)
- [Calibrating the CAMS European multi-model air quality forecasts for regional air pollution monitoring (arXiv)](https://arxiv.org/abs/2201.13355)
- [Bodnar ve ark.: A Foundation Model for the Earth System (arXiv ön baskısı; Nature, 2025)](https://arxiv.org/abs/2405.13063)
- [Microsoft Research: Introducing Aurora](https://www.microsoft.com/en-us/research/blog/introducing-aurora-the-first-large-scale-foundation-model-of-the-atmosphere/)
- [Dünya Sağlık Örgütü: Ambient (outdoor) air quality and health](https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health)
