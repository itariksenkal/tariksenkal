---
title: "Türkiye'de Yüksek Başarımlı Hesaplama: TRUBA, EuroHPC ve Erişim"
description: "Süper bilgisayar nedir, TRUBA ne sunar, Türkiye EuroHPC'de nerede duruyor? Araştırmacılar ve girişimler için hesaplama kaynağına erişim yollarını özetliyorum."
publishDate: "2026-11-22T09:17:00+03:00"
lang: tr
category: "Altyapı"
tags: ["Süper Bilgisayar", "Yapay Zeka", "Araştırma Altyapısı"]
translation: "high-performance-computing-in-turkey"
heroImage:
  src: "../../../assets/blog/covers/turkiyede-yuksek-basarimli-hesaplama.jpg"
  alt: "Bir veri merkezinde sıralanmış süper bilgisayar dolapları"
---

Bir iklim simülasyonu, yeni bir ilacın molekül taraması ya da Türkçe bir dil modelinin eğitimi… Bunların ortak noktası, tek bir bilgisayarın yıllarca uğraşacağı hesapları makul sürede bitirmek için çok sayıda işlemcinin birlikte çalışmasına ihtiyaç duymalarıdır. Yüksek başarımlı hesaplama (HPC) tam olarak bu ihtiyaca cevap veriyor. Yapay zekâ modellerinin büyümesiyle birlikte konu artık yalnızca fizikçilerin ya da meteorologların değil, girişimcilerin ve sosyal bilimcilerin de gündeminde. Bu yazıda süper bilgisayarın ne olduğunu, Türkiye'deki ulusal altyapıyı (TRUBA), Avrupa'daki EuroHPC girişimindeki yerimizi ve bu kaynaklara nasıl başvurulabileceğini, tarihleriyle birlikte özetlemeye çalışacağım.

## Süper bilgisayar dediğimiz şey ne?

Süper bilgisayarı, birbirine çok hızlı bir ağla bağlanmış binlerce sunucudan oluşan bir "küme" olarak düşünebilirsiniz. Her sunucunun içinde çok sayıda işlemci çekirdeği, yapay zekâ ve bilimsel hesaplar için giderek daha fazla da grafik işlemci (GPU) bulunur. Büyük bir iş küçük parçalara bölünür, parçalar aynı anda farklı düğümlerde çalışır ve sonuçlar birleştirilir.

Bu sistemlerin gücü genellikle saniyede yapılan kayan noktalı işlem sayısıyla (FLOP/s) ölçülür ve dünyadaki en güçlü sistemler yılda iki kez yayımlanan **TOP500** listesinde sıralanır. Ancak kullanıcı açısından asıl önemli olan, sistemin ne kadar güçlü olduğundan çok, o güce nasıl ve hangi koşullarla erişilebildiğidir.

## TRUBA: Türkiye'nin ulusal hesaplama altyapısı

**TRUBA** (Türkiye Ulusal Bilim e-Altyapısı), TÜBİTAK ULAKBİM bünyesinde 2003'ten beri hizmet veren ulusal HPC altyapısıdır. TÜBİTAK'ın Ocak 2024 tarihli haberine göre 2023 sonu itibarıyla 180 kurumdan 6.000'i aşkın araştırmacıya hizmet veriyordu; ARF adlı yeni sistem de 2023 sonunda teslim edilmişti.

Son yıllardaki gelişmeler özellikle GPU tarafında dikkat çekici:

-   ARF'nin hızlandırıcılı bölümü **ARF-ACC**, 2024'te H100 GPU'larla donatıldı; 2025'te 192 adet NVIDIA H200 GPU eklendi.
-   TÜBİTAK'ın 28 Kasım 2025 tarihli duyurusuna göre ARF-ACC, 18 Kasım 2025'te açıklanan TOP500 listesinde 266. sıradan 145. sıraya yükseldi; enerji verimliliği listesi Green500'de 45. oldu.
-   Sanayi ve Teknoloji Bakanı Mehmet Fatih Kacır'ın 20 Ekim 2025'teki açıklamasına göre TRUBA-ARF altyapısı 80 binden fazla işlemci çekirdeği, 504 GPU ve 14 petabayt depolama kapasitesine sahip.

TRUBA'nın kullanıcı kitlesi ağırlıklı olarak üniversiteler ve araştırma kurumları. TÜBİTAK yetkilileri, sistemin uzun süredir ücret karşılığında özel sektöre de açık olduğunu, ancak kapasite sıkıştığında araştırmacılara öncelik verildiğini belirtiyor.

<div class="callout"><strong>İpucu:</strong> TRUBA ve benzeri sistemler Linux komut satırı ve iş kuyruğu (job scheduler) mantığıyla çalışır. Başvurmadan önce temel Linux komutlarını, uzak sunucuya bağlanmayı ve basit bir betik yazmayı öğrenmek, ilk haftalarınızı çok daha verimli kılar.</div>

## Türkiye ve EuroHPC

**EuroHPC Ortak Girişimi** (EuroHPC JU), Avrupa'da süper bilgisayar altyapısını ortak finansmanla kurmak ve araştırmacılara açmak için oluşturulmuş bir yapı. TÜBİTAK'a göre Türkiye, Nisan 2019'da EuroHPC'ye katıldı.

Bu katılımın somut sonuçlarından biri, Barselona Süper Bilgisayar Merkezi'ndeki (BSC) **MareNostrum 5** sisteminde Türkiye'nin ortak olması. Bakan Kacır'ın Ekim 2025'teki açıklamasına göre MareNostrum 5'te Türkiye'ye ayrılan pay 70 binden fazla çekirdek ve 446 GPU düzeyinde.

Yapay zekâ tarafında ise EuroHPC, 2024'ten itibaren **"AI Factories"** (Yapay Zekâ Fabrikaları) adlı bir girişim yürütüyor: süper bilgisayarların etrafında, girişimlere, araştırmacılara ve kamuya hesaplama gücü, teknik destek ve veri hizmeti sunan merkezler. TÜBİTAK'ın 19 Aralık 2024 tarihli duyurusuna göre Türkiye, Portekiz ve Romanya ile birlikte İspanya liderliğindeki **BSC AI Factory** konsorsiyumunda ortak olarak yer aldı; bu proje, ilk turda seçilen yedi yapay zekâ fabrikasından biri. Sonraki turlarda başka ülkelerde yeni fabrikalar ve bunlara bağlı "antenler" seçildi. Türkiye'nin bu yapı içindeki güncel rolünü takip etmek için EuroHPC'nin ve TÜBİTAK'ın resmî duyurularına bakmanızı öneririm; program hızla genişlediği için ayrıntılar sık değişiyor.

## Araştırmacı ve girişimler nasıl başvurabilir?

Başvuru yolları kabaca iki gruba ayrılıyor:

| Kaynak | Kimler için? | Nasıl? |
|---|---|---|
| TRUBA | Araştırmacılar, öğretim üyeleri, öğrenciler; ücretli olarak özel sektör | portal.truba.gov.tr üzerinden bireysel hesap başvurusu |
| EuroHPC genel erişim çağrıları | Akademi, kamu ve sanayi | EuroHPC'nin benchmark, geliştirme, düzenli ve ekstrem ölçek çağrıları |
| EuroHPC AI Factories erişimi | Ağırlıklı olarak yapay zekâ girişimleri ve KOBİ'ler | Playground, Fast Lane ve Large Scale erişim modları |

**TRUBA için:** Başvurular bireysel olarak yapılıyor. Üniversitelerin yayımladığı tanıtım belgelerine göre öğrencilerin hesap açabilmesi için birlikte çalıştıkları öğretim üyesinin onay e-postası gerekiyor. TRUBA kaynaklarıyla elde edilen sonuçların kullanıldığı makale, bildiri ve tezlerde TRUBA'ya teşekkür edilmesi de kullanım koşullarından biri. Güncel koşullar için TRUBA'nın kendi dokümantasyonu esas alınmalı.

**EuroHPC için:** EuroHPC'nin kendi sayfasına göre erişim çağrıları üzerinden verilen hesaplama zamanı ücretsiz ve Türkiye, uygun ülkeler listesinde yer alıyor. Yapay zekâ fabrikalarının üç erişim modu var:

-   **Playground:** Yeni ve küçük ölçekli kullanıcılar, girişimler ve KOBİ'ler için hızlı, giriş seviyesinde erişim.
-   **Fast Lane:** 50.000 GPU saatine kadar orta ölçekli talepler; belirli bir son başvuru tarihi olmadan sürekli açık.
-   **Large Scale:** 50.000 GPU saatini aşan, uzman paneli tarafından değerlendirilen büyük talepler.

Hangi sistemin hangi modda açık olduğu dönem dönem değişebiliyor; bazı sistemler geçici olarak yeni başvurulara kapatılabiliyor. Başvurmadan önce EuroHPC'nin güncel çağrı sayfasını kontrol etmek şart.

## Başvurudan önce hazırlanması gerekenler

Hangi kaynağa başvurursanız başvurun, değerlendiriciler benzer sorular soruyor:

1.  **Neden HPC?** Problemin neden tek bir sunucuda çözülemeyeceğini sayılarla açıklayın.
2.  **Ne kadar kaynak?** Küçük bir denemeyle GPU/çekirdek saati ihtiyacınızı tahmin edin; "ne kadar çok o kadar iyi" yaklaşımı ikna edici değildir.
3.  **Kod hazır mı?** Kodunuzun birden fazla GPU'ya ya da düğüme ölçeklenebildiğini gösterin.
4.  **Veri ve gizlilik:** Kişisel ya da hassas veri kullanıyorsanız hangi önlemleri aldığınızı açıklayın.

TRUBA gibi paylaşımlı sistemlerde edinilmesi gereken iyi bir alışkanlık da şu: büyük işi başlatmadan önce küçük ölçekli bir deneme yapmak ve kuyruğa gerçekçi bir kaynak talebiyle girmek. Paylaşımlı sistemlerde gereğinden fazla kaynak istemek, genellikle işin kuyrukta daha uzun beklemesi anlamına gelir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Süper bilgisayar, hızlı bir ağla bağlanmış binlerce sunucudan oluşan bir kümedir; yapay zekâ için GPU kapasitesi giderek belirleyici hale geliyor.</li><li>TRUBA, 2003'ten beri TÜBİTAK ULAKBİM bünyesindeki ulusal altyapıdır; ARF-ACC Kasım 2025 TOP500 listesinde 145. sıraya yükseldi.</li><li>Türkiye 2019'dan beri EuroHPC'de; MareNostrum 5'in ortaklarından ve Aralık 2024'te BSC AI Factory konsorsiyumuna katıldı.</li><li>EuroHPC erişim çağrıları ücretsizdir ve Türkiye'deki başvurucular uygun ülkeler arasındadır.</li><li>İyi bir başvuru; ihtiyacı, kaynak tahminini ve kodun ölçeklenebilirliğini somut olarak gösterir.</li></ul></div>

<div class="faq"><details><summary>Lisans öğrencisiyim, TRUBA'yı kullanabilir miyim?</summary><p>Genel olarak öğrenciler, birlikte çalıştıkları bir öğretim üyesinin onayıyla hesap açabiliyor. Ayrıntılı ve güncel koşullar için TRUBA'nın portalına ve dokümantasyonuna bakmanız gerekir.</p></details><details><summary>Bir girişim olarak ücretsiz GPU zamanı bulabilir miyim?</summary><p>EuroHPC'nin yapay zekâ fabrikaları için açtığı erişim çağrıları ücretsizdir ve özellikle girişimler ile KOBİ'leri hedefler. TRUBA ise özel sektöre ücret karşılığında açıktır. Her iki durumda da projenizi ve kaynak ihtiyacınızı açıkça tanımlamanız beklenir.</p></details><details><summary>Bulut sağlayıcıları varken neden HPC?</summary><p>Bulut esneklik sunar ama büyük ve uzun süreli eğitim işlerinde maliyet hızla artar. Kamu destekli HPC altyapıları, araştırma ve erken aşama inovasyon için bu maliyeti büyük ölçüde ortadan kaldırabilir; karşılığında başvuru, kuyruk ve kullanım kurallarına uymanız gerekir.</p></details></div>

---

**Kaynaklar**

-   [TÜBİTAK, Süper Bilgisayar Odaklı Çözümlerde Yeni İmkanlar ve Fırsatlar: MareNostrum 5 ve TRUBA (Ocak 2024)](https://tubitak.gov.tr/tr/haber/super-bilgisayar-odakli-cozumlerde-yeni-imkanlar-ve-firsatlar-marenostrum-5-ve-truba)
-   [TÜBİTAK, TRUBA'daki ARF-ACC Süper Bilgisayarı Dünya Sıralamasında Büyük Başarı Elde Etti (Kasım 2025)](https://tubitak.gov.tr/tr/haber/trubadaki-arf-acc-super-bilgisayari-dunya-siralamasinda-buyuk-basari-elde-etti)
-   [TÜBİTAK, National Artificial Intelligence Factory Established (Aralık 2024)](https://tubitak.gov.tr/en/news/national-artificial-intelligence-factory-established)
-   [EuroHPC JU, AI Factories sıkça sorulan sorular](https://eurohpc-ju.europa.eu/ai-factories/faqs-ai-factories_en)
-   [EuroHPC JU, Fast Lane Access to AI Factories](https://eurohpc-ju.europa.eu/ai-factories/ai-factories-access-calls/fast-lane-access-ai-factories_en)
-   [DHA, Bakan Kacır: Süper bilgisayar kapasitesiyle... (Ekim 2025)](https://www.dha.com.tr/politika/bakan-kacir-super-bilgisayar-kapasitesiyle-bilim-ve-muhendislik-alaninda-yenilikci-projelere-ivme-kazandiriyoruz-2742278)
