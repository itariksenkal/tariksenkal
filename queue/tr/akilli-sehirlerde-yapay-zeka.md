---
title: "Akıllı Şehirlerde Yapay Zekâ: Trafikten Atığa, Fırsatlar ve Riskler"
description: "Trafik ışıkları, toplu taşıma talebi, enerji ve su şebekeleri, atık toplama: akıllı şehirlerde yapay zekâ nasıl kullanılıyor, gizlilik açısından nerede durmalı?"
publishDate: "2026-12-01T09:17:00+03:00"
lang: tr
category: "Uygulama"
tags: ["Yapay Zeka", "Akıllı Şehir", "Gizlilik"]
translation: "ai-in-smart-cities"
heroImage:
  src: "../../../assets/blog/covers/akilli-sehirlerde-yapay-zeka.jpg"
  alt: "Veri akışlarıyla birbirine bağlanmış bir şehir silueti"
---

Kırmızı ışıkta beklerken karşı yönün bomboş olduğunu fark ettiğiniz anlar olmuştur. Ya da durakta otobüsü beklerken, aynı hattın üç otobüsünün art arda geldiğini görmüşsünüzdür. Şehirler devasa ve karmaşık sistemlerdir; trafik, toplu taşıma, enerji, su ve atık her gün milyonlarca küçük kararla işler. "Akıllı şehir" fikri, bu kararları daha iyi veriye ve daha iyi tahminlere dayandırmaktır. Yapay zekâ bu fikrin önemli bir parçası, ama aynı zamanda şehri izlenen bir alana dönüştürme riskini de taşıyor. Çevre mühendisliği geçmişimden gelen alışkanlıkla şehirlere biraz da hava kalitesi ve kaynak kullanımı gözüyle bakıyorum; bu yazıda hem faydaları hem de dikkat edilmesi gereken sınırları ele alacağım.

## Trafik ışıkları: En görünür örnek

Trafik sinyallerinin çoğu, sabit süre planlarıyla veya basit sensörlerle çalışır. Yapay zekâ burada iki şekilde yardımcı olabilir: kavşaklardaki trafik desenlerini çok daha ayrıntılı modellemek ve komşu kavşakları birbiriyle uyumlu hale getirmek. Çünkü bir kavşakta kazanılan birkaç saniye, bir sonraki kavşakta oluşan kuyrukla kaybedilebilir.

Bilinen bir örnek, Google Research'ün **Project Green Light** çalışması. Google'ın Temmuz 2024 tarihli açıklamasına göre sistem, Google Haritalar'daki toplu sürüş eğilimlerinden kavşaklardaki dur-kalk desenlerini ve bekleme sürelerini modelliyor; ardından şehir trafik mühendislerine sinyal sürelerinde değişiklik önerileri sunuyor. Önemli ayrıntı şu: kararı veren ve uygulayan yine şehrin mühendisleri; sistem ışıkları gerçek zamanlı yönetmiyor. Google, 70'in üzerinde kavşakta ilk sonuçların duruş sayısını yüzde 30'a kadar, kavşaklardaki emisyonu yüzde 10'a kadar azaltma potansiyeli gösterdiğini bildiriyor. Bunlar şirketin kendi açıkladığı erken rakamlar; bağımsız değerlendirmelerle birlikte okumak gerekir.

Dur-kalk trafiğin azalması yalnızca zaman kazancı değildir. Hızlanma ve yavaşlama anlarında egzoz emisyonu artar; kavşak çevresindeki hava kalitesi doğrudan bundan etkilenir.

## Toplu taşıma talebini tahmin etmek

Toplu taşımada asıl soru şudur: hangi hatta, hangi saatte, kaç araç gerekir? Elektronik bilet verileri, araç konum sistemleri, takvim, hava durumu ve şehirdeki etkinlikler bir araya getirildiğinde, makine öğrenmesi modelleri saat bazında yolcu talebini tahmin edebilir. Bu tahminler sefer sıklığının ayarlanmasına, aynı hattaki araçların "kümelenmesinin" önlenmesine ve maç ya da konser gibi özel günlerde ek sefer planlanmasına yardım eder.

Burada dikkat edilmesi gereken nokta, bu verinin aslında bireylerin hareket izleri olmasıdır. Bir kişinin her gün hangi duraktan bindiği ve nerede indiği, evini ve işyerini kolayca ele verebilir. Bu yüzden toplu ve anonimleştirilmiş verilerle çalışmak, iyi bir tasarımın temel şartıdır.

## Enerji ve su şebekeleri

Şehirlerin görünmeyen altyapısı da yapay zekâdan fayda görebilir:

- **Elektrik talebi tahmini:** Saatlik tüketimi önceden tahmin etmek, şebekenin dengelenmesine ve yenilenebilir kaynakların daha iyi kullanılmasına yardım eder.
- **Su kaçaklarının tespiti:** Basınç ve debi sensörlerindeki olağandışı desenler, yer altındaki bir boru patlağını veya sızıntıyı erkenden işaret edebilir. Şebekede kaybolan su, hem kaynak hem enerji israfıdır.
- **Bina enerji yönetimi:** Kamu binalarında ısıtma ve soğutmanın doluluk ve hava tahminine göre ayarlanması, tüketimi düşürmenin görece kolay yollarından biridir.

Bu uygulamaların ortak özelliği, kişisel veriye görece az dokunmalarıdır. Bir boru hattının basınç verisi kimsenin özel hayatını ifşa etmez. Bu nedenle akıllı şehir yatırımlarına başlamak için iyi bir yerdir.

## Atık toplama

Atık toplama kamyonları çoğu zaman sabit rotalarla çalışır: dolu ya da boş, her konteyner aynı sıklıkla boşaltılır. Konteynerlere yerleştirilen doluluk sensörleri ve rota optimizasyon algoritmaları ile yalnızca dolmaya yaklaşan konteynerler ziyaret edilebilir. Daha az kilometre, daha az yakıt, daha az gürültü ve emisyon demektir. Burada çoğu zaman "yapay zekâ" dediğimiz şey, iyi kurulmuş bir optimizasyon problemi ve güvenilir sensörlerdir. Her akıllı çözümün büyük bir sinir ağı gerektirmediğini hatırlatmak gerekir.

<div class="callout"><strong>İpucu:</strong> Bir akıllı şehir projesini değerlendirirken "hangi sorunu, hangi ölçütle çözüyor?" diye sorun. Bekleme süresi, su kaybı oranı veya katedilen kilometre gibi somut ve ölçülebilir hedefler, belirsiz "akıllılaşma" vaatlerinden çok daha güvenilirdir.</div>

## Gizlilik ve gözetim: Çizgi nerede?

Akıllı şehir tartışmasının en hassas kısmı kameralar ve yüz tanımadır. Trafik yoğunluğunu ölçmek için araç saymak ile kalabalıkta tek tek insanları tanımlamak çok farklı şeylerdir; ama aynı kamera altyapısı her ikisi için de kullanılabilir.

Avrupa Birliği'nin 2024'te yayımlanan Yapay Zekâ Yasası (Tüzük 2024/1689), kamuya açık alanlarda kolluk amaçlı **gerçek zamanlı uzaktan biyometrik tanımlamayı** ilke olarak yasaklıyor. İstisnalar dar tutulmuş: kayıp kişilerin aranması, yakın ve somut bir tehdidin önlenmesi ve belirli ağır suçların şüphelilerinin tespiti gibi durumlar; bunlar da önceden yargısal veya bağımsız bir makamın iznine bağlanıyor. Türkiye'de ise 6698 sayılı Kişisel Verilerin Korunması Kanunu biyometrik verileri özel nitelikli kişisel veri olarak sayıyor ve işlenmesini sıkı koşullara bağlıyor.

Kendi gözlemim, iyi tasarlanmış projelerin şu ilkelere dikkat ettiği yönünde:

- **Amaçla sınırlılık:** Trafik saymak için kurulan sistem, kimlik tespiti için kullanılmamalı.
- **Veri en aza indirme:** Mümkünse görüntü değil, yalnızca sayım sonucu saklanmalı; görüntü cihaz üzerinde işlenip silinmeli.
- **Şeffaflık:** Vatandaş hangi verinin, hangi amaçla toplandığını öğrenebilmeli.
- **Denetlenebilirlik:** Algoritmaların kararları bağımsız olarak incelenebilmeli.

<div class="callout"><strong>Not:</strong> Bu bölüm genel bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Belirli bir projenin mevzuata uygunluğu için uzman görüşü alınmalıdır.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Akıllı şehirlerde yapay zekâ en çok tahmin ve optimizasyon için kullanılır: trafik, yolcu talebi, enerji, su ve atık.</li><li>Trafik sinyali optimizasyonunda öneriyi model, kararı çoğu zaman şehir mühendisi verir; erken sonuçlar umut verici ama çoğunlukla şirket kaynaklıdır.</li><li>Altyapı şebekeleri gibi kişisel veriye az dokunan alanlar, başlamak için güvenli ve verimli bir zemindir.</li><li>Kameralar ve yüz tanıma, akıllı şehir ile gözetim şehri arasındaki çizginin belirlendiği yerdir; AB bu alanda sıkı kısıtlamalar getirdi.</li></ul></div>

<div class="faq"><details><summary>Akıllı şehir demek her yere kamera koymak mı demek?</summary><p>Hayır. Akıllı şehir uygulamalarının önemli bir kısmı kamera gerektirmez: su şebekesindeki basınç sensörleri, konteyner doluluk sensörleri veya toplu bilet verileri gibi. Kamera kullanılan yerlerde de görüntüyü saklamadan yalnızca sayım yapmak mümkündür.</p></details><details><summary>Trafik ışıklarını yapay zekâ mı yönetiyor?</summary><p>Çoğu uygulamada yapay zekâ öneri üretir veya sinyal sürelerini önceden belirlenmiş sınırlar içinde ayarlar. Güvenlik kuralları ve son karar, trafik mühendislerinin kontrolündedir.</p></details><details><summary>Kişisel verilerim akıllı şehir sistemlerinde nasıl korunuyor?</summary><p>Bu, sistemi işleten kuruma ve uygulanan mevzuata bağlıdır. Türkiye'de kişisel veriler KVKK kapsamında korunur. Bir uygulamanın hangi veriyi topladığını öğrenmek için ilgili kurumun aydınlatma metnine bakabilir, veri sorumlusuna başvurabilirsiniz.</p></details></div>

---

**Kaynaklar**

- [Google: Project Green Light ile trafik kaynaklı emisyonları azaltma çalışması (Temmuz 2024)](https://blog.google/outreach-initiatives/sustainability/google-ai-project-greenlight/)
- [EUR-Lex: Tüzük (AB) 2024/1689, Yapay Zekâ Yasası](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)
- [Future of Privacy Forum: AB Yapay Zekâ Yasası'nda gerçek zamanlı uzaktan biyometrik tanımlamaya getirilen sınırlar](https://fpf.org/blog/red-lines-under-the-eu-ai-act-restricting-real-time-remote-biometric-identification-systems-for-law-enforcement-purposes/)
- [6698 sayılı Kişisel Verilerin Korunması Kanunu (Mevzuat Bilgi Sistemi)](https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf)
