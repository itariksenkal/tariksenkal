---
title: "Yapay Zekanın Enerji ve Su Ayak İzi: Rakamlar Ne Diyor?"
description: "Veri merkezleri ne kadar elektrik ve su kullanıyor, tek bir yapay zeka sorgusunun maliyeti neden farklı hesaplanıyor ve ayak izini gerçekten ne azaltıyor?"
publishDate: "2026-11-08T09:17:00+03:00"
lang: tr
category: "İklim"
tags: ["Yapay Zeka", "Enerji", "İklim"]
translation: "ai-energy-and-water-footprint"
heroImage:
  src: "../../../assets/blog/covers/yapay-zekanin-enerji-ve-su-ayak-izi.jpg"
  alt: "Veri merkezlerinin enerji ve su tüketimi"
---

Bir sohbet botuna soru sormak, ekranda birkaç saniyelik bir işlem gibi görünüyor. Ama o cevabın arkasında bir veri merkezinde çalışan çipler, onları soğutan sistemler ve bu sistemleri besleyen elektrik şebekesi var. Son birkaç yılda "yapay zeka ne kadar enerji ve su harcıyor?" sorusu hem kamuoyunda hem politika tartışmalarında sıkça soruluyor; cevaplar ise abartılı alarmlardan aşırı rahatlatıcı açıklamalara kadar geniş bir yelpazede dolaşıyor. Dil modelleriyle çalışan biri olarak bu soruyu kendime de soruyorum. Bu yazıda güvenilir kaynakların ne söylediğini, rakamların neden birbirinden bu kadar farklı çıktığını ve ayak izini gerçekten neyin azalttığını toparlamaya çalışacağım.

## Büyük resim: veri merkezleri ne kadar elektrik kullanıyor?

En sık atıf yapılan kaynaklardan biri, Uluslararası Enerji Ajansı'nın (IEA) 2025'te yayımladığı *Energy and AI* raporu. Rapordaki temel rakamlar şöyle:

- Veri merkezleri 2024'te yaklaşık **415 TWh** elektrik tüketti. Bu, dünya elektrik tüketiminin yaklaşık **%1,5**'i.
- Sektörün tüketimi 2017'den bu yana yılda ortalama %12 civarında arttı.
- IEA'nın temel senaryosunda bu tüketim 2030'a kadar iki katından fazla artarak yaklaşık **945 TWh**'e ulaşıyor.
- 2024 tüketiminin yaklaşık %45'i ABD'de, %25'i Çin'de, %15'i Avrupa'da gerçekleşti.

İki noktanın altını çizmek gerekiyor. Birincisi, bu rakamlar yalnızca yapay zekayı değil, tüm veri merkezlerini kapsıyor: e-posta, video, bulut depolama, bankacılık sistemleri de bunun içinde. Yapay zeka ise artışın en hızlı büyüyen kalemi. İkincisi, IEA da geleceğe dair belirsizliğin büyük olduğunu vurguluyor: 2035 için farklı senaryolarda tahminler 700 ile 1.700 TWh arasında değişiyor.

Küresel ölçekte %1,5 küçük görünebilir. Ancak veri merkezleri belirli bölgelerde yoğunlaştığı için yerel şebekeler üzerindeki etkisi çok daha belirgin olabiliyor. Asıl mesele çoğu zaman küresel toplamdan çok, belirli bir şehirde veya bölgede yeni kapasitenin nereden ve hangi kaynakla karşılanacağı.

## Su nereden giriyor işin içine?

Su ayak izi iki farklı yoldan oluşuyor ve tartışmaların önemli bir kısmı bu ayrımın gözden kaçırılmasından kaynaklanıyor.

1. **Doğrudan su kullanımı:** Veri merkezlerinde sunucuları soğutmak için, özellikle buharlaştırmalı soğutma sistemlerinde, su tüketiliyor.
2. **Dolaylı su kullanımı:** Veri merkezinin kullandığı elektriği üreten santraller de su tüketiyor. Termik santrallerin soğutma ihtiyacı bunun tipik örneği.

Bir şirket yalnızca tesis içindeki soğutma suyunu raporlarsa, ikinci kalem dışarıda kalır. Bağımsız tahminler de bu yüzden birbirinden çok farklı çıkabiliyor. Örneğin Rystad Energy'nin bir analizi, veri merkezlerinin doğrudan soğutma suyu ihtiyacının 2030'a kadar yaklaşık 644 milyar litreye çıkabileceğini öngörüyor; elektrik üretimine bağlı dolaylı suyu da sayan çalışmalar ise çok daha yüksek rakamlara ulaşıyor. Bu rakamlar birbiriyle doğrudan karşılaştırılamaz, çünkü farklı şeyleri ölçüyorlar.

<div class="callout"><strong>İpucu:</strong> Bir haberde "yapay zeka şu kadar su tüketiyor" diye bir rakam gördüğünüzde, bunun yalnızca tesis içi soğutmayı mı yoksa elektrik üretimindeki suyu da mı kapsadığını kontrol edin. Fark birkaç kat olabilir.</div>

## Tek bir sorgu ne kadar enerji harcıyor?

Burada elimizdeki en ayrıntılı kamuya açık veri, Google'ın Ağustos 2025'te yayımladığı teknik çalışma. Şirkete göre Gemini uygulamalarında **medyan bir metin sorgusu** yaklaşık:

- **0,24 Wh** enerji,
- **0,03 g** CO₂ eşdeğeri emisyon,
- **0,26 mL** su

kullanıyor. Aynı çalışma, yalnızca aktif çalışan yapay zeka çiplerini sayan daha dar bir hesapta enerji tüketiminin yaklaşık 0,10 Wh'e düştüğünü gösteriyor. Şirket ayrıca medyan sorgunun enerji tüketiminin on iki ayda 33 kat azaldığını bildiriyor.

Bu rakamlar yararlı, ama bağlamıyla okunmalı:

- Hesaba model eğitimi, kullanıcının cihazı ve ağ altyapısı dahil değil.
- Su rakamı yalnızca tesis içindeki soğutma suyunu kapsıyor; eleştirmenler elektrik üretimindeki dolaylı suyun dışarıda bırakıldığına dikkat çekti.
- "Medyan metin sorgusu" kısa bir soruyu temsil ediyor. Uzun belgeler, görsel veya video üretimi ve çok adımlı "akıl yürütme" yapan modeller çok daha fazla hesaplama gerektirebilir.
- Çalışma, yayımlandığı tarihte hakemli bir dergide yayımlanmış değildi.

## Tahminler neden bu kadar farklı?

Farklı kaynaklarda bir sorgu için on kat farklı rakamlar görmek mümkün. Bunun birkaç makul nedeni var:

- **Sınırların nereye çizildiği:** Yalnızca çip mi, yoksa sunucunun tamamı, boşta bekleyen kapasite ve soğutma da mı? Google'ın kendi çalışmasında bile bu tercih rakamı iki katından fazla değiştiriyor.
- **Model büyüklüğü ve görev türü:** Küçük bir modelle kısa bir soru ile büyük bir modelle uzun bir analiz aynı şey değil.
- **Donanım ve verimlilik:** Yeni nesil çipler ve iyi optimize edilmiş yazılım aynı işi çok daha az enerjiyle yapabiliyor.
- **Elektriğin kaynağı:** Aynı kilovatsaat, yenilenebilir ağırlıklı bir şebekede ile kömür ağırlıklı bir şebekede çok farklı emisyon anlamına geliyor.
- **Veri eksikliği:** Şirketlerin çoğu ayrıntılı veri paylaşmıyor; dışarıdan yapılan tahminler varsayımlara dayanmak zorunda kalıyor.

## Ayak izini gerçekten ne azaltır?

Bireysel kullanıcı olarak tek bir sorgudan vazgeçmenin etkisi küçük. Asıl fark sistem düzeyindeki tercihlerden geliyor:

- **Doğru boyutta model:** Her işe en büyük modeli kullanmak yerine, görevin gerektirdiği kadar büyük bir model seçmek. Sınıflandırma veya kısa özetleme gibi işler için küçük modeller çoğu zaman yeterli.
- **Yazılım verimliliği:** Nicemleme (quantization), toplu işleme (batching), önbellekleme ve gereksiz uzun çıktılardan kaçınmak, aynı sonucu daha az hesaplamayla verir.
- **Verimli tesis tasarımı:** Soğutma için daha az enerji ve su harcayan veri merkezleri; su stresi yüksek bölgelerde suyu az kullanan soğutma çözümleri.
- **Temiz elektrik:** Veri merkezlerinin yenilenebilir kaynaklara erişimi, hatta iş yükünün temiz elektriğin bol olduğu saatlere veya bölgelere kaydırılması.
- **Şeffaf raporlama:** Ölçülmeyen şey yönetilemez. Ortak ve karşılaştırılabilir raporlama standartları, tartışmayı tahminlerden verilere taşır.

<div class="callout"><strong>Not:</strong> IEA aynı raporda yapay zekanın binalarda, sanayide ve şebeke yönetiminde enerji tasarrufu sağlayabileceğini de hesaplıyor. Ancak rapor, bu potansiyelin kendiliğinden gerçekleşmeyeceğini ve tek başına iklim sorununu çözmeye yetmeyeceğini de açıkça belirtiyor.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>IEA'ya göre veri merkezleri 2024'te yaklaşık 415 TWh, yani küresel elektriğin yaklaşık %1,5'ini kullandı; 2030 için temel senaryo yaklaşık 945 TWh.</li><li>Su ayak izi doğrudan (soğutma) ve dolaylı (elektrik üretimi) olarak ikiye ayrılır; rakamlar kapsamına göre okunmalı.</li><li>Google'ın Ağustos 2025 verisine göre medyan bir Gemini metin sorgusu yaklaşık 0,24 Wh ve 0,26 mL su kullanıyor, ancak hesaba her şey dahil değil.</li><li>En büyük etkiyi doğru boyutta model, yazılım verimliliği, temiz elektrik ve şeffaf raporlama yaratır.</li></ul></div>

<div class="faq"><details><summary>Bir yapay zeka sorgusu bir Google aramasından fazla enerji mi harcar?</summary><p>Genel olarak büyük dil modelleri klasik bir aramaya göre daha fazla hesaplama gerektirir, ancak fark modelin büyüklüğüne, sorunun uzunluğuna ve kullanılan donanıma göre çok değişir. Tek bir sabit oran vermek yanıltıcı olur.</p></details><details><summary>Model eğitimi mi, kullanım mı daha fazla enerji harcıyor?</summary><p>Büyük bir modelin eğitimi tek seferde çok büyük bir enerji gerektirir. Ancak model milyonlarca kullanıcıya hizmet verdikçe, kullanım (çıkarım) aşamasının toplam payı da büyür. Hangisinin ağır bastığı modelin ne kadar ve ne süreyle kullanıldığına bağlıdır.</p></details><details><summary>Bireysel olarak ne yapabilirim?</summary><p>İşe uygun aracı seçmek, gereksiz uzun çıktılar ve tekrar tekrar üretimler istememek makul adımlardır. Ama asıl etki, kurumların model seçimi, veri merkezi tercihleri ve şeffaf raporlama konusundaki kararlarından gelir.</p></details></div>

---

**Kaynaklar**

- [IEA: Energy and AI – Executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)
- [Google: Measuring the environmental impact of delivering AI at Google Scale (arXiv, 2025)](https://arxiv.org/abs/2508.15734)
- [DatacenterDynamics: Google says median Gemini prompt uses 0.24 watt-hours and 0.26 mL of water](https://www.datacenterdynamics.com/en/news/google-median-gemini-prompt-uses-024-watt-hours-of-power-and-consumes-026ml-of-water/)
- [Down To Earth: Data centre water consumption could triple to 644 billion litres by 2030](https://www.downtoearth.org.in/science-technology/data-centre-water-consumption-could-triple-to-644-billion-litres-by-2030)
