---
title: "Orman Yangını Tespitinde Yapay Zekâ: Kameradan Uyduya Erken Uyarı"
description: "Kule kameraları, uydu tabanlı yangın tespiti, yayılma modelleri ve risk haritaları: yapay zekâ orman yangınlarında nasıl yardımcı oluyor, sınırları neler?"
publishDate: "2026-12-04T09:17:00+03:00"
lang: tr
category: "Çevre"
tags: ["Yapay Zeka", "Orman Yangınları", "Çevre"]
translation: "ai-wildfire-detection"
heroImage:
  src: "../../../assets/blog/covers/orman-yangini-tespitinde-yapay-zeka.jpg"
  alt: "Ormanlık tepeden yükselen duman ve gözetleme kulesi kamerası"
---

Orman yangınlarında ilk dakikalar her şeyi belirler. Küçük bir duman kolonu birkaç kişiyle söndürülebilirken, rüzgârın arkasına aldığı bir yangın günlerce sürebilir, binlerce hektarı ve yerleşim yerlerini tehdit edebilir. Bu yüzden yangınla mücadelenin en kritik sorusu basittir: yangını ne kadar erken fark edebiliriz? Çevre mühendisliği geçmişim nedeniyle yangınlara biraz da hava kalitesi gözüyle bakıyorum; yangın dumanı, kilometrelerce uzaktaki şehirlerde bile ince partikül kirliliğini artırabiliyor. Bu yazıda yapay zekânın yangın tespitinde, yayılma tahmininde ve risk haritalarında nasıl kullanıldığını, Türkiye'deki uygulamaları ve bu sistemlerin sınırlarını anlatacağım.

## Gözetleme kulesinden akıllı kameraya

Uzun yıllar boyunca orman yangınlarının erken tespiti, tepelere kurulan gözetleme kulelerindeki görevlilerin dürbünle ufku taramasına dayandı. Bu hâlâ değerli bir yöntem, ama insanın dikkatinin saatlerce aynı yoğunlukta kalması zor.

Bugün kulelere yerleştirilen kameralar ufku sürekli tarıyor ve görüntüler, duman desenlerini tanımak üzere eğitilmiş bilgisayarlı görü modelleriyle inceleniyor. Model şüpheli bir duman gördüğünde bir uyarı üretiyor, görevli de bu uyarıyı kontrol ediyor. Kameranın konumu ve bakış yönü bilindiği için, birden fazla kameranın gördüğü bir dumanın yeri yaklaşık olarak hesaplanabiliyor.

Dünyadaki bilinen örneklerden biri Kaliforniya'daki **ALERTCalifornia** programı. UC San Diego'nun Ekim 2023 tarihli açıklamasına göre ağ, eyaletin yangın riski yüksek bölgelerini izleyen 1.050'den fazla kameradan oluşuyor. Yapay zekâ olağandışı bir durum fark ettiğinde nöbetçi görevlileri uyarıyor; ekipler ancak bir insan uyarıyı doğruladıktan sonra harekete geçiyor. Sistem, 2023 yazında test edildikten sonra Eylül 2023'te Kaliforniya Ormancılık ve Yangından Korunma Dairesi'nin (CAL FIRE) 21 biriminin tamamına yayıldı.

## Türkiye'de durum

Türkiye'de Orman Genel Müdürlüğü (OGM) de benzer bir yaklaşım kullanıyor. Şubat 2022'de dönemin Tarım ve Orman Bakanı, gözetleme kulelerindeki kameraların ormandaki dumanı yapay zekâ ve makine öğrenmesiyle tespit ettiğini, uygulamanın Antalya'da başlayıp Muğla'ya genişletildiğini ve duman algılandığında ilgili birimlere SMS veya MMS ile uyarı gönderildiğini açıklamıştı. Kamera ve kule sayıları farklı tarihlerde farklı rakamlarla aktarıldığı için burada belirli bir sayı vermiyorum; güncel bilgi için OGM'nin resmi açıklamalarına bakmak en doğrusu.

OGM'nin bir diğer aracı, 2022'den beri kullanılan yapay zekâ destekli **Karar Destek Sistemi**. Tarım ve Orman Bakanlığı'nın Mart 2024 tarihli açıklamasına göre sistem; meteorolojik verileri, Orman Bilgi Sistemi (ORBİS) verilerini, insansız hava aracı ve uydu görüntülerini bir araya getiriyor. Yangın çıkma olasılığını tahmin etmeye, aktif bir yangının nasıl davranıp yayılacağını öngörmeye, müdahale stratejisi önermeye ve risk altındaki yerleşimlerin zamanında tahliyesini desteklemeye yönelik çalışıyor. Sistem, Birleşmiş Milletler'e bağlı Uluslararası Telekomünikasyon Birliği'nin (ITU) Dünya Bilgi Toplumu Zirvesi (WSIS) 2024 ödüllerine aday gösterildi; Haziran 2024'te Bakanın açıklamasına dayanan haberlere göre çevre kategorisinde ikinci oldu.

## Uzaydan yangın tespiti

Kameraların göremediği uzak ve dağlık alanlarda uydular devreye giriyor. NASA'nın **FIRMS** (Fire Information for Resource Management System) hizmeti, MODIS ve VIIRS algılayıcılarıyla tespit edilen aktif yangın noktalarını, gözlemden sonra genellikle yaklaşık üç saat içinde tüm dünya için paylaşıyor. VIIRS'ün yaklaşık 375 metrelik, MODIS'in yaklaşık 1 kilometrelik çözünürlüğü var.

Bu algılayıcılar, yeryüzündeki olağandışı sıcak noktaları kızılötesi bantlarda yakalar. Ancak bir pikselin yüzlerce metre olması, çok küçük ve yeni başlamış bir yangının gözden kaçabileceği anlamına gelir. Ayrıca uydular bir bölgenin üzerinden günde yalnızca birkaç kez geçer. Bu yüzden uydu verisi, ilk dakikaları yakalamaktan çok büyük yangınları izlemek, yangının sınırlarını takip etmek ve geniş ölçekli durum değerlendirmesi yapmak için daha uygundur. Yeni nesil yer sabit uydular ve küçük uydu takımları bu boşluğu daraltmaya çalışıyor.

## Yayılma modelleri ve risk haritaları

Yangın başladıktan sonraki soru şudur: nereye, ne hızla ilerleyecek? Yangın yayılma modelleri; rüzgâr hızı ve yönü, nem, eğim ve yanıcı madde (bitki örtüsü türü ve kuruluğu) bilgilerini kullanarak yangının olası ilerleyişini simüle eder. Geleneksel olarak bu modeller fizik ve deneysel ilişkilere dayanır. Makine öğrenmesi, geçmiş yangınların verisinden öğrenerek bu modelleri hızlandırmak veya tamamlamak için kullanılıyor.

**Risk haritaları** ise yangın henüz çıkmadan önce, hangi bölgelerin hangi günlerde daha tehlikeli olduğunu gösterir. Avrupa'da Copernicus programı kapsamında Avrupa Komisyonu Ortak Araştırma Merkezi'nin yürüttüğü **EFFIS** (Avrupa Orman Yangını Bilgi Sistemi), hava tahminlerine dayalı yangın tehlikesi tahminleri yayımlıyor. Bu tahminler, Kanada'da geliştirilmiş ve dünyada yaygın kullanılan Yangın Hava İndeksi (Fire Weather Index) sistemine dayanıyor. Risk haritaları ekiplerin ve araçların önceden konumlandırılmasına, ormana giriş yasaklarının planlanmasına yardım eder.

<div class="callout"><strong>İpucu:</strong> Yaz aylarında ormanlık bir bölgeye gitmeden önce resmi yangın riski duyurularını ve giriş yasaklarını kontrol edin. Duman veya ateş gördüğünüzde 112 Acil Çağrı Merkezi'ni arayın. Hiçbir otomatik sistem, erken bir vatandaş ihbarının yerini tamamen tutmaz.</div>

## Sınırlar ve yanlış alarmlar

Yapay zekâ destekli yangın tespitinin en büyük pratik sorunu yanlış alarmlardır. Kamera tabanlı sistemler sis, alçak bulut, toz, tarla yakımı, fabrika bacası, hatta güneş yansıması gibi durumları duman sanabilir. Çok sık yanlış alarm veren bir sistem, görevlilerde "alarm yorgunluğu" yaratır ve gerçek bir uyarının gözden kaçma riskini artırır. Hassasiyeti düşürmek ise gerçek yangınları kaçırma riskini yükseltir. Bu dengenin ayarı teknik olduğu kadar operasyonel bir karardır.

Diğer sınırlar şunlardır:

- **Görüş hattı:** Kamera, tepenin arkasındaki dumanı göremez; vadiler ve sık orman kör noktalar yaratır.
- **Gece ve kötü hava:** Görünür ışıkla çalışan kameralar gece duman göremez; kızılötesi kameralar daha pahalıdır.
- **Uydu gecikmesi ve çözünürlüğü:** Küçük yangınlar yakalanmayabilir, bulut ve yoğun duman görüşü engelleyebilir.
- **Veri ve bakım:** Kameraların, iletişim hatlarının ve modellerin sürekli bakımı ve güncellenmesi gerekir.

<div class="callout"><strong>Not:</strong> Bu sistemlerin en iyi çalıştığı yapı, "yapay zekâ işaretler, insan doğrular" modelidir. Otomatik tespit hızı artırır; nihai karar ve müdahale deneyimli ekiplerindir.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Yangınla mücadelede en kritik etken erken tespittir; yapay zekâ kamera ve uydu görüntülerini sürekli tarayarak bu süreyi kısaltabilir.</li><li>Türkiye'de OGM, kulelerdeki kameralarla duman tespiti ve 2022'den beri kullanılan yapay zekâ destekli bir Karar Destek Sistemi kullanıyor.</li><li>Uydular büyük yangınları izlemede güçlüdür, ancak çok küçük ve yeni yangınları kaçırabilir.</li><li>Yayılma modelleri ve risk haritaları, ekiplerin önceden konumlanmasına yardım eder.</li><li>Yanlış alarmlar temel sorundur; en sağlıklı yapı, insan doğrulamalı sistemlerdir.</li></ul></div>

<div class="faq"><details><summary>Yapay zekâ yangınları tamamen önleyebilir mi?</summary><p>Hayır. Yapay zekâ riskli günleri ve bölgeleri belirlemeye, yangınları erken fark etmeye ve müdahaleyi planlamaya yardım eder. Yangınların büyük kısmı insan kaynaklı olduğu için önleme, büyük ölçüde dikkatli davranış ve denetime bağlıdır.</p></details><details><summary>Uydu verilerine ben de bakabilir miyim?</summary><p>Evet. NASA FIRMS ve Avrupa'nın EFFIS sistemi, aktif yangın noktalarını ve yangın tehlikesi haritalarını herkese açık çevrim içi haritalarda sunuyor. Ancak bu veriler gecikmeli olabilir; acil durumda resmi kurumlara başvurun.</p></details><details><summary>Kameralar insan gözcülerin yerini aldı mı?</summary><p>Tamamen değil. Kameralar ve yapay zekâ geniş alanları kesintisiz tarayabilir, ama uyarıları doğrulamak ve sahayı yorumlamak için deneyimli görevlilere hâlâ ihtiyaç var. Pratikte ikisi birlikte çalışıyor.</p></details></div>

---

**Kaynaklar**

- [T.C. Tarım ve Orman Bakanlığı: Orman yangınlarıyla mücadelede kullanılan yapay zekâ sistemi uluslararası ödüle aday (Mart 2024)](https://www.tarimorman.gov.tr/Haber/6249/Orman-Yanginlariyla-Mucadelede-Kullanilan-Yapay-Zek%C3%A2-Sistemi-Uluslararasi-Odule-Aday)
- [Türkiye Gazetesi: Bakan Pakdemirli, "Dumanı yapay zekâ ile tespit ediyoruz" (Şubat 2022)](https://www.turkiyegazetesi.com.tr/gundem/bakan-pakdemirli-dumani-yapay-zeka-ile-tespit-ediyoruz-820437)
- [NASA FIRMS: Fire Information for Resource Management System](https://firms2.modaps.eosdis.nasa.gov/)
- [EFFIS: European Forest Fire Information System](https://forest-fire.emergency.copernicus.eu/)
- [UC San Diego Today: ALERTCalifornia (Ekim 2023)](https://today.ucsd.edu/story/alert-california)
