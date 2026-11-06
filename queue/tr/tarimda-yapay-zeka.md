---
title: "Tarımda Yapay Zekâ: Uydudan Tarlaya Hassas Tarım Rehberi"
description: "Uydu ve drone ile ürün izleme, görüntüden hastalık tespiti, sulama ve verim tahmini: tarımda yapay zekâ neler yapabilir, küçük işletmeler için ne gerçekçi?"
publishDate: "2026-11-30T09:17:00+03:00"
lang: tr
category: "Uygulama"
tags: ["Yapay Zeka", "Tarım", "Uzaktan Algılama"]
translation: "ai-in-agriculture"
heroImage:
  src: "../../../assets/blog/covers/tarimda-yapay-zeka.jpg"
  alt: "Uydu görüntüsü üzerinde tarım parselleri ve bitki sağlığı haritası"
---

Bir çiftçi tarlasını yürüyerek dolaşır, yapraklara bakar, toprağı avucuna alır ve kararını verir: sulamalı mı, ilaçlamalı mı, hasadı ne zaman yapmalı? Yapay zekânın tarımdaki vaadi bu bilgiyi yerinden etmek değil, ona yeni gözler eklemek: uzaydan bakan uydular, tarlanın üzerinde uçan dronlar, yaprak fotoğrafını inceleyen telefon uygulamaları. Çevre mühendisliği geçmişim nedeniyle su ve iklim verisiyle çalışan modellere hep yakın durdum; bu yazıda "hassas tarım" denen yaklaşımın neler yapabildiğini, nerede zorlandığını ve özellikle küçük işletmeler için neyin gerçekçi olduğunu sade bir şekilde anlatmak istiyorum.

## Hassas tarım nedir?

Geleneksel yaklaşımda tarla tek bir birim gibi yönetilir: aynı miktar gübre, aynı miktar su, her köşeye. Oysa bir tarlanın içinde bile toprak yapısı, eğim ve nem farklılık gösterir. **Hassas tarım**, bu farklılıkları ölçüp girdileri ihtiyaca göre dağıtma fikridir. Doğru yere, doğru zamanda, doğru miktarda.

Yapay zekâ bu zincirin "ölç ve yorumla" kısmında devreye girer. Görüntülerden, sensörlerden ve hava durumu verilerinden desen çıkarır; insanın tek başına takip edemeyeceği kadar çok veriyi özetler ve bir karar önerisi sunar. Karar yine çiftçinindir.

## Uydu ve drone ile ürün izleme

Avrupa Birliği'nin Copernicus programı kapsamındaki **Sentinel-2** uyduları, bu alanın en yaygın veri kaynaklarından biri. Avrupa Uzay Ajansı'na göre iki uydulu takım ekvatorda beş günde bir aynı noktayı görebiliyor; 13 spektral bandın dördü 10 metre çözünürlükte. Veriler ücretsiz olarak erişilebilir.

Bu bantların bir kısmı insan gözünün göremediği yakın kızılötesi ışığı ölçer. Sağlıklı yeşil yapraklar yakın kızılötesini güçlü biçimde yansıtır, kırmızı ışığı ise emer. Bu iki ölçümü birleştiren **NDVI** gibi bitki örtüsü indeksleri, bir parseldeki bitkilerin ne kadar "canlı" olduğuna dair kaba ama kullanışlı bir sinyal verir. Yapay zekâ modelleri bu sinyalin zaman içindeki değişimini izleyerek:

- hangi parselde hangi ürünün ekildiğini sınıflandırabilir,
- komşu alanlara göre geride kalan bölgeleri işaretleyebilir,
- kuraklık veya su stresi belirtilerini erkenden gösterebilir.

Türkiye'den somut bir örnek: Tarım ve Orman Bakanlığı Tarım Reformu Genel Müdürlüğü'nün Temmuz 2026'da yayımladığı habere göre, uzaktan algılamaya dayalı ürün belirleme çalışması 2025 üretim yılında ilk kez uygulamaya alınmış. Sahadan toplanan referans parseller uydu görüntüleriyle birlikte makine öğrenmesiyle değerlendirilerek ekili ürünler tespit ediliyor ve üretim desenleri belirleniyor. Aynı haberde güvenilir referans verinin, özellikle hasattan önce toplanan kışlık ürün verilerinin, sistemin başarısı için kritik olduğu vurgulanıyor. Bu, makine öğrenmesinin genel bir gerçeğini de hatırlatıyor: model, sahadan gelen doğru etiketler kadar iyidir.

Dronlar ise daha küçük bir alanı santimetre düzeyinde ayrıntıyla görüntüleyebilir. Uydudan farklı olarak buluttan etkilenmez ve istenen gün uçurulabilir; buna karşılık ekipman, yazılım ve pilot maliyeti vardır.

## Görüntüden hastalık tespiti

Bir yaprak fotoğrafından hastalığı tanımak, derin öğrenmenin tarımdaki en bilinen uygulamalarından biri. 2016'da Frontiers in Plant Science dergisinde yayımlanan ve sık atıf alan bir çalışmada araştırmacılar, PlantVillage projesindeki 54.306 yaprak görüntüsüyle (14 ürün türü, 26 hastalık) bir model eğitti ve ayrılmış test setinde yüzde 99'un üzerinde doğruluk bildirdi.

Ama aynı çalışmanın daha az bilinen bir bulgusu en az bu kadar önemli: model, eğitim verisinden farklı koşullarda çekilmiş görüntülerle test edildiğinde doğruluk yüzde 31 civarına düştü. Laboratuvarda düz bir arka plan önünde çekilmiş yaprak ile tarlada güneş altında, gölgeli, toz içinde bir yaprak arasındaki fark, modeller için çok büyük.

<div class="callout"><strong>İpucu:</strong> Bir hastalık tespit uygulamasını değerlendirirken "hangi ürünlerde ve hangi koşullarda test edildi?" diye sorun. Sonucu kesin teşhis değil, bir ön uyarı olarak görün; şüpheli durumlarda il veya ilçe tarım müdürlüğündeki uzmanlara danışın.</div>

## Sulama ve verim tahmini

Su, tarımın en kritik ve giderek kıtlaşan girdisi. Sulama kararları için yapay zekâ genellikle üç tür veriyi birleştirir: toprak nem sensörleri, hava durumu tahminleri ve bitkinin su tüketimini (evapotranspirasyon) tahmin eden modeller. Amaç, "bugün sulamalı mıyım, ne kadar?" sorusuna veri temelli bir yanıt vermek. Burada karmaşık bir sinir ağından çok, iyi kalibre edilmiş bir sensör ve güvenilir bir hava tahmini fark yaratır.

**Verim tahmini** ise uydu zaman serilerini, iklim verisini, toprak bilgisini ve geçmiş yılların hasat kayıtlarını birleştirir. Bu tür modeller bölge veya il ölçeğinde planlama için değerlidir: depolama, lojistik, ithalat-ihracat kararları. Tek bir parsel için ise belirsizlik çok daha yüksektir, çünkü yerel bir dolu, bir hastalık salgını veya geç bir don, modelin göremeyeceği kadar ani gelişebilir.

## Küçük işletmeler için ne gerçekçi?

Türkiye'de tarım arazilerinin önemli bir kısmı küçük ve parçalı. Bu da bazı teknolojileri doğrudan zorlaştırıyor. Örneğin 10 metrelik bir uydu pikseli 100 metrekareyi kapsar; yarım dönümlük bir bahçe sadece birkaç piksele denk gelir ve kenar pikselleri komşu tarlayla karışır.

| Araç | Küçük işletme için durumu |
|---|---|
| Ücretsiz uydu indeksleri (NDVI vb.) | Orta ve büyük parsellerde faydalı; çok küçük parsellerde sınırlı |
| Telefon ile hastalık ön tespiti | Düşük maliyetli; ön uyarı olarak kullanılmalı |
| Hava durumu temelli hastalık ve don uyarıları | Genellikle en yüksek getiri/maliyet oranına sahip araçlardan |
| Toprak nem sensörü ve basit sulama planı | Su tasarrufu için makul yatırım |
| Drone ile düzenli görüntüleme | Kooperatif veya hizmet satın alma modeliyle daha mantıklı |
| Otonom makineler, robotik hasat | Şu an için büyük işletmelere daha uygun |

Gerçekçi yol çoğu zaman tek tek çiftçinin pahalı ekipman alması değil; kooperatiflerin, üretici birliklerinin veya kamu kurumlarının ortak altyapı ve danışmanlık sunmasıdır. Verinin kime ait olduğu da sorulması gereken bir soru: tarla verinizi bir uygulamaya yüklediğinizde, o veriyi kimin hangi amaçla kullanabileceğini kontrol edin.

<div class="callout"><strong>Not:</strong> Teknolojinin değeri, sahadaki bilgiyle birleştiğinde ortaya çıkar. Bir haritanın "burada sorun var" demesi yeterli değildir; tarlaya gidip nedenini anlamak hâlâ gereklidir.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Hassas tarım, tarladaki farklılıkları ölçüp girdileri ihtiyaca göre dağıtma fikridir; yapay zekâ ölçme ve yorumlama kısmında yardım eder.</li><li>Sentinel-2 gibi ücretsiz uydu verileri ürün izleme için güçlü bir kaynak, ancak bulut ve küçük parsel sınırlamaları var.</li><li>Laboratuvarda çok başarılı görünen hastalık tespit modelleri, tarla koşullarında belirgin biçimde zayıflayabilir.</li><li>Türkiye'de Bakanlık, 2025 üretim yılından itibaren uydu ve makine öğrenmesine dayalı ürün belirleme çalışması yürütüyor.</li><li>Küçük işletmeler için en gerçekçi kazanımlar uyarı sistemleri, basit sensörler ve ortak kullanılan hizmetlerden gelir.</li></ul></div>

<div class="faq"><details><summary>NDVI nedir, kendi tarlam için bakabilir miyim?</summary><p>NDVI, kırmızı ve yakın kızılötesi ışık ölçümlerinden hesaplanan bir bitki örtüsü indeksidir; yüksek değerler genellikle daha yoğun ve sağlıklı yeşil örtüye işaret eder. Ücretsiz Sentinel-2 verilerini görselleştiren çevrim içi araçlarla bakabilirsiniz, ancak çok küçük parsellerde ve bulutlu günlerde sonuçlar yanıltıcı olabilir.</p></details><details><summary>Yapay zekâ ilaçlamayı azaltabilir mi?</summary><p>Potansiyel olarak evet: hastalık riskinin yüksek olduğu dönemleri ve alanları belirleyerek takvime göre değil ihtiyaca göre ilaçlamaya yardım edebilir. Ancak bu, doğru teşhis ve uzman görüşüyle birlikte işe yarar; model çıktısı tek başına ilaçlama kararı için yeterli değildir.</p></details><details><summary>Verim tahminleri ne kadar güvenilir?</summary><p>Bölge veya il ölçeğinde, birden fazla veri kaynağı birleştirildiğinde planlama için yararlı olabilir. Tek bir tarla ölçeğinde ise ani hava olayları ve yerel sorunlar nedeniyle belirsizlik yüksektir; tahmini kesin bir sonuç değil, bir aralık olarak düşünmek gerekir.</p></details></div>

---

**Kaynaklar**

- [ESA: Sentinel-2 temel bilgiler ve teknik özellikler](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures)
- [ESA: Sentinel-2 ve bitki sağlığı](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Plant_health)
- [Mohanty, Hughes ve Salathé (2016), "Using Deep Learning for Image-Based Plant Disease Detection", Frontiers in Plant Science](https://www.frontiersin.org/articles/10.3389/fpls.2016.01419/full)
- [T.C. Tarım ve Orman Bakanlığı Tarım Reformu Genel Müdürlüğü: Ürün Belirleme Çalışması Bölge Değerlendirme Toplantıları](https://www.tarimorman.gov.tr/TRGM/Haber/912/Urun-Belirleme-Calismasi-Bolge-Degerlendirme-Toplantilari-Gerceklestirildi)
