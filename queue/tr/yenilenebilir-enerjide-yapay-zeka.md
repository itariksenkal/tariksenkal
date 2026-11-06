---
title: "Yenilenebilir Enerjide Yapay Zekâ: Rüzgârı ve Güneşi Tahmin Etmek"
description: "Güneş ve rüzgâr üretim tahmini, şebeke dengeleme, türbin bakımı ve talep esnekliği: yapay zekâ yenilenebilir enerjinin şebekeye uyumuna nasıl yardım ediyor?"
publishDate: "2026-12-02T09:17:00+03:00"
lang: tr
category: "İklim"
tags: ["Yapay Zeka", "Yenilenebilir Enerji", "İklim"]
translation: "ai-in-renewable-energy"
heroImage:
  src: "../../../assets/blog/covers/yenilenebilir-enerjide-yapay-zeka.jpg"
  alt: "Rüzgâr türbinleri ve güneş panelleri üzerinde tahmin grafiği"
---

Bir kömür ya da doğal gaz santrali, yakıt verildiği sürece istenen saatte istenen kadar elektrik üretebilir. Rüzgâr ve güneş ise böyle değil: rüzgâr eser ya da durur, bulut geçer ve güneş paneli bir anda üretimini kaybeder. Elektrik şebekesi ise her an üretimle tüketimin dengede olmasını ister. Yenilenebilir enerjinin payı arttıkça şu soru kritikleşiyor: yarın saat 14.00'te ne kadar rüzgâr ve güneş elektriği olacak? Çevre mühendisliği geçmişimde hava kalitesi modelleriyle, yani atmosferin davranışını tahmin etmeye çalışan sistemlerle uğraştım; yenilenebilir enerji tahmini de aynı atmosferle boğuşur. Bu yazıda yapay zekânın burada neler yapabildiğini ve tahmin doğruluğunun neden bu kadar önemli olduğunu anlatacağım.

## Neden tahmin bu kadar önemli?

Elektrik büyük ölçüde depolanmadan, üretildiği anda tüketilir. Şebeke işletmecisi, talebi karşılamak için hangi santralin ne zaman devreye gireceğini önceden planlar. Birçok ülkede, Türkiye dahil, elektrik bir gün önceden kurulan piyasalarda da alınıp satılır. Bir rüzgâr santrali yarın için 100 megavat satıp 70 megavat üretirse, aradaki fark başka bir kaynaktan, genellikle daha pahalıya karşılanmak zorundadır. Bu farkın maliyeti de çoğu zaman tahmini tutturamayan üreticiye yansır.

Kötü tahminin bedeli yalnızca para değildir. Şebeke işletmecisi belirsizlik arttıkça daha fazla yedek kapasiteyi, çoğu zaman fosil yakıtlı santralleri, hazırda bekletmek zorunda kalır. Uluslararası Enerji Ajansı'nın (IEA) değişken yenilenebilir kaynaklar üzerine çalışmaları, bu kaynakların şebekeye entegrasyonunda esnekliğin ve tahmin edilebilirliğin merkezi rol oynadığını vurgular. Kısacası, daha iyi tahmin daha temiz bir şebeke demektir.

## Rüzgâr ve güneş üretim tahmini nasıl yapılır?

Üretim tahmini genellikle iki katmandan oluşur:

1. **Hava tahmini:** Sayısal hava tahmin modelleri rüzgâr hızını, bulutluluğu ve güneş ışınımını öngörür.
2. **Hava durumundan elektriğe çeviri:** Makine öğrenmesi modelleri, bu tahminleri belirli bir santralin geçmiş üretim verileriyle eşleştirir. Türbinlerin konumu, arazinin etkisi, panellerin kirlenmesi gibi fiziksel modellerle yakalanması zor ayrıntıları veriden öğrenir.

Zaman ufku da yöntemi belirler. Birkaç dakika ile birkaç saat arasındaki "anlık tahminlerde" (nowcasting) uydu görüntülerinden veya gökyüzü kameralarından bulutların hareketini izlemek işe yarar. Gün öncesi tahminlerde ise hava tahmin modelleri ön plana çıkar.

Bilinen bir örnek DeepMind'ın 2019'da paylaştığı çalışma. Şirketin açıklamasına göre, hava tahminleri ve türbin verileriyle eğitilen bir sinir ağı, Google'ın ABD'de kullandığı yaklaşık 700 megavatlık rüzgâr kapasitesinin üretimini 36 saat önceden tahmin etti. Sistem, bu tahmine dayanarak şebekeye bir gün önceden saatlik teslim taahhütleri önerdi. DeepMind, bu yaklaşımın rüzgâr enerjisinin değerini, zamana bağlı taahhüt verilmeyen senaryoya kıyasla kabaca yüzde 20 artırdığını bildirdi. Bu, şirketin kendi ölçümü; ama tahminin doğrudan ekonomik değere nasıl dönüştüğünü göstermesi açısından öğretici.

Türkiye'de de bu alanda kamu destekli çalışmalar var. TÜBİTAK, 2013'te Türkiye'nin ilk Rüzgâr Gücü İzleme ve Tahmin Merkezi'ni (RİTM) tanıttı; o tarihteki açıklamaya göre sistem her rüzgâr santralinin sonraki 48 saatlik üretimini tahmin ediyor, hedef ufuk ise 72 saatti.

<div class="callout"><strong>İpucu:</strong> İyi bir üretim tahmini tek bir sayı değil, bir aralıktır. "Yarın 80 MW" demek yerine "yüzde 90 olasılıkla 60 ile 95 MW arası" diyen olasılıksal tahminler, şebeke işletmecisinin ne kadar yedek tutacağına karar vermesini kolaylaştırır.</div>

## Şebeke dengeleme ve talep esnekliği

Tahmin denklemin yalnızca bir tarafı. Diğer taraf, belirsizliğe karşı esneklik sağlamak. Yapay zekâ burada da çeşitli roller üstlenebilir:

- **Talep tahmini:** Tüketimi saatlik olarak tahmin etmek, üretim tahmini kadar önemlidir. Sıcaklık, takvim, tatiller ve ekonomik etkinlik bu modellerin temel girdileridir.
- **Depolama yönetimi:** Bataryaların ne zaman şarj edilip ne zaman boşaltılacağına, fiyat ve üretim tahminlerine göre karar vermek bir optimizasyon problemidir.
- **Talep esnekliği (demand response):** Elektrikli araç şarjı, su ısıtıcıları, soğuk hava depoları veya sanayi tesisleri, tüketimlerini güneşin bol olduğu saatlere kaydırabilir. Yapay zekâ, binlerce küçük esnek yükü birlikte yöneterek bunları sanal bir santral gibi kullanmaya yardım eder.

Esneklik, yenilenebilir payı arttıkça daha da değer kazanır. Güneşin öğle saatlerinde bol, akşam ise hiç olmaması, tüketimi doğru zamana kaydırabilen her sistemi değerli kılar.

## Türbinlerde kestirimci bakım

Bir rüzgâr türbininin dişli kutusu veya yatağı arızalandığında onarım hem pahalıdır hem de uzun sürebilir; özellikle deniz üstü santrallerde. **Kestirimci bakım**, arızayı gerçekleşmeden önce fark etmeye çalışır. Türbinler sürekli olarak sıcaklık, titreşim, dönüş hızı ve güç verisi kaydeder (SCADA verisi). Makine öğrenmesi modelleri bu verilerdeki normal davranışı öğrenir ve örneğin bir yataktaki sıcaklığın benzer koşullarda olması gerekenden yavaş yavaş yükselmesi gibi sapmaları işaretler.

ABD'deki NREL laboratuvarı araştırmacılarının dişli kutusu yatak arızaları üzerine yaptığı bir çalışmada, SCADA verisine fiziksel modellerden üretilen verilerin eklenmesi arıza tahminini iyileştirdi ve yanlış alarmları azalttı. Bu, bence önemli bir dersi özetliyor: veriyle fiziği birleştiren yaklaşımlar, yalnızca birine dayananlardan çoğu zaman daha güvenilirdir.

Burada da en büyük sorun yanlış alarmlar. Her uyarıda teknisyen göndermek pahalıdır; çok sık yanlış alarm veren bir sistem bir süre sonra görmezden gelinir.

## Sınırlar ve dikkat edilmesi gerekenler

- **Hava tahmininin sınırı:** Makine öğrenmesi, hava tahminindeki temel belirsizliği ortadan kaldıramaz; ancak onu santral ölçeğinde daha iyi kullanabilir.
- **Uç olaylar:** Fırtınalar, toz olayları veya panellerde kar birikmesi gibi nadir durumlar eğitim verisinde az bulunur ve tahmin hataları en çok burada büyür.
- **Dağıtık üretim:** Çatı tipi güneş panelleri dağıtım şebekesine yayılmış olduğu için izlenmeleri ve tahmin edilmeleri büyük santrallere göre daha zordur.
- **Veri erişimi:** İyi model, iyi veri ister; santral verilerinin paylaşımı ve kalitesi, tahmin başarısını doğrudan belirler.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Rüzgâr ve güneş değişkendir; şebekeye entegrasyonun anahtarı, üretimi doğru tahmin etmek ve esneklik sağlamaktır.</li><li>Tahmin hatası hem para hem de yedekte bekletilen fosil kapasite anlamına gelir.</li><li>Makine öğrenmesi, hava tahminlerini santral ölçeğinde üretime çevirmede güçlüdür; olasılıksal tahminler tek sayılı tahminlerden daha kullanışlıdır.</li><li>SCADA verisiyle kestirimci bakım, türbin arızalarını önceden fark etmeye yardım eder; yanlış alarmlar ise temel zorluktur.</li></ul></div>

<div class="faq"><details><summary>Yapay zekâ hava tahmin modellerinin yerini mi alıyor?</summary><p>Yenilenebilir enerji tahmininde yapay zekâ çoğunlukla hava tahmin modellerinin üzerine eklenen bir katman olarak çalışır: genel hava tahminini belirli bir santralin üretimine çevirir. Son yıllarda doğrudan hava tahmini yapan yapay zekâ modelleri de geliştirildi, ancak pratikte iki yaklaşım birlikte kullanılıyor.</p></details><details><summary>Güneş tahmini mi daha zor, rüzgâr tahmini mi?</summary><p>İkisinin zorluğu farklıdır. Güneşte gündüz-gece döngüsü öngörülebilirdir ama bulutlar kısa vadede ani düşüşlere yol açar. Rüzgârda ise üretim, rüzgâr hızındaki küçük değişimlere çok duyarlıdır. Zorluk, konuma ve zaman ufkuna göre değişir.</p></details><details><summary>Ev kullanıcısı olarak bunun benimle ne ilgisi var?</summary><p>Elektrikli araç şarjı veya akıllı termostat gibi esnek yükler, ileride tüketimi güneş ve rüzgârın bol olduğu saatlere kaydırarak şebekeye katkı sağlayabilir. Bunun nasıl ödüllendirileceği, ülkedeki tarife ve piyasa düzenlemelerine bağlıdır.</p></details></div>

---

**Kaynaklar**

- [DeepMind: Machine learning can boost the value of wind energy (Şubat 2019)](https://deepmind.google/discover/blog/machine-learning-can-boost-the-value-of-wind-energy/)
- [IEA: Empowering Variable Renewables – Options for Flexible Electricity Systems](https://www.iea.org/reports/empowering-variable-renewables-options-for-flexible-electricity-systems)
- [TÜBİTAK: Rüzgâr Gücü İzleme ve Tahmin Merkezi Tanıtıldı (Kasım 2013)](https://tubitak.gov.tr/tr/haber/ruzgar-gucu-izleme-ve-tahmin-merkezi-tanitildi)
- [NREL: Prognosis of Wind Turbine Gearbox Bearing Failures Using SCADA and Modeled Data](https://research-hub.nrel.gov/en/publications/prognosis-of-wind-turbine-gearbox-bearing-failures-using-scada-an-2/)
