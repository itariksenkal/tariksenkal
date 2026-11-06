---
title: "Deprem ve Yapay Zekâ: Neyi Yapabilir, Neyi Yapamaz?"
description: "Yapay zekâ depremi önceden bilebilir mi? Sismik sinyal tespiti, erken uyarı sistemleri ve 6 Şubat 2023 sonrası uydu ile hasar tespiti üzerine sakin bir bakış."
publishDate: "2026-12-03T09:17:00+03:00"
lang: tr
category: "Toplum"
tags: ["Yapay Zeka", "Deprem", "Afet Yönetimi"]
translation: "ai-and-earthquakes"
heroImage:
  src: "../../../assets/blog/covers/deprem-ve-yapay-zeka.jpg"
  alt: "Sismograf kaydı ve uydu görüntüsü üzerinde hasar haritası"
---

Türkiye'de deprem, hepimizin hayatına bir şekilde dokunmuş bir konu. 6 Şubat 2023'teki Kahramanmaraş merkezli depremlerden sonra sosyal medyada "yapay zekâ depremi önceden bildi", "şu tarihte büyük deprem olacak" gibi iddialar sıkça dolaştı. Yapay zekâ üzerine çalışan biri olarak bu iddiaları gördükçe, teknolojinin gerçekten neyi yapabildiğini ve neyi yapamadığını sakin bir şekilde anlatmanın önemli olduğunu düşünüyorum. Çünkü yanlış umut da yanlış korku da insanların doğru kararlar almasını zorlaştırıyor. Bu yazıda üç alana bakacağım: sismik sinyallerin tespiti, erken uyarı sistemleri ve deprem sonrası hasar tespiti. Ama önce en sık sorulan soruyla başlayalım.

## Depremler önceden tahmin edilebilir mi?

Kısa cevap: hayır, bugün için güvenilir biçimde edilemez. ABD Jeolojik Araştırmalar Kurumu (USGS) bu soruya açıkça "Hayır" yanıtı veriyor: ne USGS ne de başka bir bilim insanı büyük bir depremi bugüne kadar önceden tahmin edebilmiş. Kurum, bunun nasıl yapılacağını bilmediğini ve yakın gelecekte bilmeyi de beklemediğini belirtiyor.

Burada iki kavramı ayırmak gerekiyor:

| Kavram | Ne söyler? | Mümkün mü? |
|---|---|---|
| **Deprem tahmini (prediction)** | Belirli bir tarihte, belirli bir yerde, belirli büyüklükte deprem olacak | Hayır, bilimsel olarak gösterilmiş bir yöntem yok |
| **Olasılık hesabı (forecast)** | Bir bölgede önümüzdeki yıllarda belirli büyüklükte deprem olma olasılığı | Evet, tehlike haritaları ve yapı yönetmelikleri buna dayanır |
| **Erken uyarı** | Deprem başladıktan sonra, sarsıntı size ulaşmadan saniyeler önce haber verir | Evet, ama yalnızca birkaç saniye ile onlarca saniye arası |

Yapay zekâ bu tabloyu değiştirmiyor. Bir modelin geçmiş verideki desenleri öğrenmesi, gelecekteki büyük bir depremin tarihini söyleyebileceği anlamına gelmez. Büyük depremler nadirdir; öğrenilecek örnek sayısı azdır ve fay hatlarının içinde neler olduğunu doğrudan gözlemleyemiyoruz. "Yapay zekâ şu tarihte deprem olacağını söyledi" türünden bir paylaşım gördüğünüzde, bunu bilimsel bir bulgu olarak değil, doğrulanmamış bir iddia olarak değerlendirin.

<div class="callout"><strong>İpucu:</strong> Deprem tahmini iddialarında üç soruyu sorun: Tarih, yer ve büyüklük net mi? Yöntem hakemli bir bilimsel yayında anlatılmış mı? Aynı kişi veya sistemin geçmişte tutmayan "tahminleri" de sayılıyor mu? Bu sorulara tatmin edici yanıt yoksa iddiayı ciddiye almayın.</div>

## Makine öğrenmesi sismik sinyalleri nasıl okuyor?

Yapay zekânın sismolojide gerçekten fark yarattığı alan, kayıtlardaki depremleri bulmak ve ölçmek. Sismometreler sürekli veri kaydeder; bu kayıtlarda trafik, rüzgâr, dalgalar ve küçük depremler iç içedir. Bir depremin sinyalini gürültüden ayırmak ve P dalgası ile S dalgasının geliş anlarını belirlemek (faz okuma) uzun süre büyük ölçüde uzmanların elle yaptığı ya da basit algoritmalarla sınırlı kalan bir işti.

Derin öğrenme modelleri bu işi hem daha hızlı hem de daha hassas yapabiliyor. Örneğin 2020'de Nature Communications dergisinde yayımlanan **EQTransformer** modeli, deprem sinyalini tespit etmeyi ve P ile S fazlarını okumayı tek bir ağda birleştiriyor. Bu tür modeller, eski yöntemlerin kaçırdığı çok sayıda küçük depremi kataloglara ekleyebiliyor.

Bu neden önemli? Daha eksiksiz deprem katalogları, fay sistemlerinin nasıl davrandığını, artçı sarsıntıların nasıl yayıldığını ve hangi bölgelerin aktif olduğunu daha iyi anlamaya yardım ediyor. Bu da dolaylı olarak tehlike hesaplarını iyileştiriyor. Ama yine de bir "tahmin" makinesi ortaya çıkarmıyor.

## Erken uyarı: Tahmin değil, hız yarışı

Erken uyarı sistemleri depremi önceden bilmez; deprem başladıktan sonra çalışır. Mantık şu: deprem sırasında önce daha hızlı ama daha az yıkıcı P dalgaları yayılır, ardından daha yavaş ve daha yıkıcı S dalgaları gelir. Merkeze yakın istasyonlar depremi algıladığında, sinyal elektronik olarak dalgalardan çok daha hızlı iletilebilir. Merkeze uzak bir şehre birkaç saniye ile onlarca saniye arasında bir uyarı süresi kazanılabilir. Merkeze çok yakın yerlerde ise bu süre neredeyse sıfırdır.

Türkiye'deki durum dikkatle ifade edilmeli. Boğaziçi Üniversitesi Kandilli Rasathanesi'nin İstanbul'da işlettiği bir erken uyarı sistemi bulunuyor. Kandilli'nin Mart 2023'teki açıklamasına göre bu sistem, sinyali talep eden kurumlara iletiliyor ve doğal gaz kaynaklı patlamaları önlemek veya bazı tesisleri devre dışı bırakmak gibi ikincil afetleri azaltmaya yönelik çalışıyor. Aynı açıklamada Türkiye'de halka yönelik bir erken uyarı sistemi bulunmadığı belirtilmişti. Bu yazıyı hazırlarken (Kasım 2026) AFAD'ın ülke genelinde halka yönelik bir erken uyarı sistemini devreye aldığına dair resmi bir duyuruya ulaşamadım; güncel durum için AFAD ve Kandilli'nin resmi açıklamalarına bakmanızı öneririm.

Telefonlar da bu alanda bir rol üstleniyor. Google'ın Android Deprem Uyarı Sistemi, telefonlardaki ivme ölçerleri küçük sismometreler gibi kullanıyor. Ancak 6 Şubat 2023 depremlerinde sistem beklendiği gibi çalışmadı. Anadolu Ajansı'nın Temmuz 2025'te aktardığına göre Google, araştırmacılarının Science dergisinde yayımladığı değerlendirme ve şirket açıklamalarıyla 7,8 büyüklüğündeki ilk depremi sistemin 4,5–4,9 olarak tahmin ettiğini ve en üst düzey "Harekete Geç" uyarısının yalnızca 469 kişiye gittiğini kabul etti. Şirket, merkeze 157 km mesafedeki yaklaşık 10 milyon kişiye bu uyarının gönderilebileceğini belirtti ve algoritmayı güncellediğini açıkladı. Bu örnek, makine öğrenmesine dayalı sistemlerin en çok ihtiyaç duyulan anda, yani çok büyük ve nadir olaylarda, zorlanabileceğini açıkça gösteriyor.

## Deprem sonrası hızlı hasar tespiti

Yapay zekânın ve uzaktan algılamanın somut katkı sağladığı bir diğer alan, deprem sonrası ilk saatler ve günler. Hangi mahallede kaç bina yıkıldı, hangi yollar kapalı? Bu soruların hızlı yanıtı, arama-kurtarma ekiplerinin ve yardımın nereye yönlendirileceğini belirler.

6 Şubat 2023'te Avrupa Birliği'nin Copernicus Acil Durum Yönetim Servisi, AFAD adına yapılan talep üzerine 7,8 büyüklüğündeki depremden dört saat geçmeden hızlı haritalama modülünü devreye aldı. Copernicus'un 10 Şubat tarihli bülteninde 20 ilgi alanı belirlendiği, ilk hasar derecelendirme haritasının aktivasyondan 40 saat sonra teslim edildiği ve 10 Şubat itibarıyla 53 harita üretildiği aktarılıyor. Analistler, depremden sonraki günlerde çekilmiş çok yüksek çözünürlüklü optik uydu görüntülerini kullandı.

Bu tür haritalama büyük ölçüde uzman görüntü yorumlamasına dayanıyor; makine öğrenmesi modelleri ise önceki ve sonraki görüntüleri karşılaştırarak hasarlı olabilecek binaları otomatik işaretleyip süreci hızlandırmak için giderek daha fazla kullanılıyor. Ancak sınırları var: üstten bakıldığında çatısı sağlam görünen ama katları birbirinin üzerine çökmüş bir bina gözden kaçabilir; bulut, gölge ve çekim açısı sonuçları etkiler. Bu nedenle uydu tabanlı değerlendirmeler saha ekiplerinin yerini almaz, onlara nereden başlayacaklarını gösterir.

<div class="callout"><strong>Not:</strong> Deprem anında ve sonrasında AFAD, Kandilli Rasathanesi ve valilikler gibi resmi kaynakları takip edin. Doğrulanmamış uygulama bildirimleri ve sosyal medya paylaşımları paniğe yol açabilir.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Depremler bugün güvenilir biçimde tahmin edilemiyor; yapay zekâ da bunu değiştirmiş değil.</li><li>Makine öğrenmesi, sismik kayıtlardaki küçük depremleri bulmada ve faz okumada gerçek bir ilerleme sağladı.</li><li>Erken uyarı tahmin değildir; deprem başladıktan sonra saniyeler kazandırır. Türkiye'de halka yönelik ulusal bir sistem için resmi açıklamaları takip edin.</li><li>Uydu görüntüleri ve yapay zekâ, afet sonrası hasar tespitini hızlandırabilir ama saha doğrulamasının yerini tutmaz.</li><li>Depreme karşı en etkili önlem hâlâ sağlam bina ve hazırlıktır.</li></ul></div>

<div class="faq"><details><summary>Hayvanların depremi önceden hissettiği doğru mu?</summary><p>Bu konuda çok sayıda anekdot olsa da hayvan davranışının depremleri güvenilir biçimde önceden haber verdiği bilimsel olarak gösterilmiş değil. Bir yöntemin işe yaraması için tarih, yer ve büyüklüğü tekrar tekrar doğru bilmesi gerekir.</p></details><details><summary>Telefonuma gelen deprem uyarısına güvenmeli miyim?</summary><p>Telefon tabanlı uyarılar, deprem başladıktan sonra birkaç saniye kazandırabilir; ama 2023 örneğinde görüldüğü gibi büyük depremlerde hata yapabilirler. Uyarıyı aldığınızda "çök-kapan-tutun" hareketini uygulamak mantıklıdır; ayrıntılı bilgi için resmi kurumların açıklamalarını bekleyin.</p></details><details><summary>Yapay zekâ depreme hazırlıkta nasıl yardımcı olabilir?</summary><p>Bina envanteri çıkarmak, riskli yapıları önceliklendirmek, senaryo bazlı kayıp tahminleri yapmak ve afet sonrası lojistiği planlamak gibi alanlarda destek olabilir. Ama sağlam yapı stoku ve bireysel hazırlığın yerini alamaz.</p></details></div>

---

**Kaynaklar**

- [USGS: Can you predict earthquakes?](https://www.usgs.gov/faqs/can-you-predict-earthquakes)
- [Mousavi ve diğerleri (2020), "Earthquake transformer", Nature Communications](https://www.nature.com/articles/s41467-020-17591-w)
- [CNN Türk: Kandilli'den "deprem erken uyarı" sistemi açıklaması (Mart 2023)](https://www.cnnturk.com/turkiye/kandilliden-deprem-erken-uyari-sistemi-aciklamasi-1902771)
- [Anadolu Ajansı: Google, 2023 depremlerinde 10 milyon kişiyi uyaramadığını kabul etti (Temmuz 2025, İngilizce)](https://aa.com.tr/en/science-technology/google-admits-it-failed-to-alert-10m-in-turkiye-about-severity-of-2023-earthquakes/3644795)
- [Copernicus EMS: Türkiye depremi hasar değerlendirmesi, Bilgi Bülteni 165](https://mapping.emergency.copernicus.eu/news/information-bulletin-165-the-copernicus-emergency-management-service-assesses-the-damage-caused-by-the-earthquake-in-t%C3%BCrkiye/)
