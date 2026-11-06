---
title: "Uydu Verisiyle Emisyon Takibi: Kirliliği Uzaydan İzlemek"
description: "Sentinel-5P/TROPOMI ile NO₂ ve metan izleme, Copernicus'un yeni uyduları, yapay zekanın emisyon bulutlarını bulmadaki rolü ve sınırlar."
publishDate: "2026-11-11T09:17:00+03:00"
lang: tr
category: "Çevre"
tags: ["Uydu", "Emisyon", "Yapay Zeka"]
translation: "satellite-emissions-monitoring"
heroImage:
  src: "../../../assets/blog/covers/uydu-verisiyle-emisyon-takibi.jpg"
  alt: "Uydudan görülen atmosferdeki kirlilik haritası"
---

Bir fabrikanın bacasından ya da bir doğal gaz hattındaki sızıntıdan çıkan gazı uzaydan görmek, birkaç on yıl önce bilim kurgu gibi gelirdi. Bugün ise Avrupa'nın Copernicus programına ait uydular her gün neredeyse tüm dünyanın azot dioksit ve metan haritasını çıkarıyor; bu veriler de herkese açık. Bu, emisyonların yalnızca beyanlara değil, bağımsız gözlemlere de dayanarak takip edilebilmesi anlamına geliyor. Hava kirliliği ve iklim verisiyle çalışan biri olarak bu alanı çok heyecan verici buluyorum; ama uydunun neyi gerçekten görebildiğini ve neyi göremediğini bilmek de en az bu kadar önemli. Bu yazıda ikisini de anlatmaya çalışacağım.

## Uydu kirliliği nasıl "görür"?

Atmosferdeki her gaz, güneş ışığının belirli dalga boylarını kendine özgü bir biçimde soğurur. Uydudaki spektrometre, yeryüzünden ve atmosferden yansıyan ışığı çok sayıda dar dalga boyu bandında ölçer. Bu "parmak izlerinden" yola çıkılarak, uydu ile yer arasındaki hava sütununda ne kadar gaz bulunduğu hesaplanır.

Burada önemli bir ayrıntı var: uydu genellikle **kolon miktarı**, yani yerden atmosferin üst katmanlarına kadar olan toplam miktarı ölçer. Bu, yer istasyonlarının ölçtüğü ve sağlığı doğrudan ilgilendiren yüzey konsantrasyonu ile aynı şey değildir. İkisi arasında köprü kurmak için modellere ihtiyaç duyulur.

## Sentinel-5P ve TROPOMI: günlük küresel harita

Bu alanın son yıllardaki en önemli araçlarından biri, Copernicus programının **Sentinel-5P** uydusu. 13 Ekim 2017'de fırlatılan uydu, üzerindeki **TROPOMI** spektrometresiyle şu ürünleri sağlıyor:

- Azot dioksit (NO₂)
- Metan (CH₄)
- Ozon (O₃)
- Karbon monoksit (CO)
- Formaldehit (HCHO)
- Kükürt dioksit (SO₂)
- Bulut ve aerosol bilgisi

Yaklaşık 2.600 km genişliğindeki tarama şeridi sayesinde dünyanın neredeyse tamamını her gün bir kez görüyor; yerel saatle 13:30 civarında geçiyor. Ağustos 2019'dan bu yana UV-görünür bantlarda piksel boyutu yaklaşık 5,5 × 3,5 km. Uydu yedi yıllık tasarım ömrünü aşmış olsa da ESA'nın 2026 tarihli görev durumu sunumlarında veri üretmeye devam ettiği görülüyor.

**NO₂ haritaları**, şehirleri, büyük yolları, limanları ve termik santralleri açıkça gösteriyor. NO₂ atmosferde görece kısa ömürlü olduğu için, kaynağına yakın yerde yoğunlaşıyor; bu da onu insan faaliyetinin iyi bir göstergesi yapıyor.

**Metan** ise farklı bir hikâye. Güçlü bir sera gazı olan metan için TROPOMI, petrol ve gaz sahaları, kömür madenleri ve çöp depolama alanları üzerindeki büyük salımları görebiliyor. Ancak tek tek tesisleri ayırt etmek için daha yüksek çözünürlüklü uydulara ihtiyaç var.

## Yeni nesil: Sentinel-4 ve Sentinel-5

Copernicus atmosfer izleme ailesi 2025'te iki önemli üyeyle genişledi:

- **Sentinel-4**, yer sabit (geostationary) yörüngedeki MTG-Sounder uydusunda yer alıyor ve Avrupa ile çevresini saatlik olarak izleyecek şekilde tasarlandı. İlk NO₂, SO₂ ve ozon görüntüleri Ekim 2025'te yayımlandı. Saatlik gözlem, kirliliğin gün içindeki değişimini izlemek için büyük bir kazanım.
- **Sentinel-5**, 13 Ağustos 2025'te Ariane 6 ile fırlatılan MetOp-SG-A1 uydusunda bulunuyor ve uzun vadede Sentinel-5P'nin küresel gözlem görevini devralması amaçlanıyor. İlk görüntüleri yayımlandı.

Ticari ve sivil toplum girişimleri de bu alanda yer alıyor, ama her zaman beklendiği gibi gitmiyor. Örneğin metan için tasarlanan MethaneSAT, Mart 2024'te fırlatıldıktan yaklaşık bir yıl sonra, Haziran 2025'te bağlantısını kaybetti ve kurtarılamaz kabul edildi. Bu da uzay tabanlı izlemenin birden fazla uyduya ve kaynağa yayılmasının neden önemli olduğunu gösteriyor.

<div class="callout"><strong>İpucu:</strong> Copernicus verilerine Copernicus Data Space Ecosystem üzerinden ücretsiz erişebilirsiniz. Başlamak için hazır NO₂ ürününü bir şehir üzerinde birkaç ay boyunca incelemek, verinin mantığını kavramanın iyi bir yolu.</div>

## Yapay zeka nerede devreye giriyor?

Her gün terabaytlarca görüntü üreten uyduları insan gözüyle taramak imkânsız. Yapay zeka burada üç ana iş üstleniyor:

1. **Emisyon bulutunu (plume) bulmak:** Evrişimli sinir ağları gibi görüntü modelleri, metan veya NO₂ haritalarında arka plandan ayrışan, belirli bir kaynaktan rüzgâr yönünde uzanan bulutları otomatik olarak işaretleyebiliyor.
2. **Gürültüyü ayıklamak:** Parlak yüzeyler, kar, su ve bulut kenarları yanlış alarmlara yol açabilir. Modeller bu hatalı tespitleri elemek için eğitiliyor.
3. **Kaynağı ve miktarı tahmin etmek:** Rüzgâr verisiyle birleştirilen tespitler, bulutun hangi tesisten geldiğini ve saatte ne kadar gaz salındığını kabaca tahmin etmeye yarıyor.

Bunun somut bir örneği, Birleşmiş Milletler Çevre Programı'nın (UNEP) **Metan Uyarı ve Müdahale Sistemi (MARS)**. Sistem, 30'dan fazla uydu cihazının verisini bilimsel uzmanlık ve yapay zeka modelleriyle birleştirerek büyük metan salımlarını tespit ediyor ve ilgili hükümetlere ve şirketlere bildiriyor. Ancak UNEP'in COP29'da açıkladığı rapora göre, gönderilen 1.200'ü aşkın uyarının yarısından azına yanıt alınmıştı. Yani teknoloji tek başına yetmiyor; tespiti eyleme dönüştürecek kurumsal mekanizmalar da gerekiyor.

## Sınırlar: uydu her şeyi göremez

- **Bulutlar:** Bu tür optik ölçümler bulutun altını göremez. Bulutlu bir bölgede günlerce veri boşluğu oluşabilir.
- **Çözünürlük:** Birkaç kilometrelik bir piksel, bir şehrin genelini gösterir ama tek bir bacayı ayırt etmeye yetmeyebilir.
- **Zaman:** Kutupsal yörüngedeki uydular bir yeri günde bir kez görür. Gün içindeki değişim ya da kısa süreli bir sızıntı kaçabilir; Sentinel-4 gibi yer sabit görevler bu boşluğu Avrupa için kapatmaya başlıyor.
- **Kolon ve yüzey farkı:** Uydu kolonu ölçer; yere yakın konsantrasyon ve sağlık etkisi için modelle yorumlama gerekir.
- **Yüzey koşulları:** Kar, su ve çok karanlık yüzeyler özellikle metan ölçümlerini zorlaştırır.

<div class="callout"><strong>Not:</strong> Uydu verisi yer istasyonlarının yerini almaz, onları tamamlar. En güvenilir tablo, uydu, yer ölçümü ve modellerin birlikte kullanılmasıyla ortaya çıkar.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Sentinel-5P/TROPOMI, 2017'den bu yana NO₂, metan ve diğer gazlar için neredeyse günlük küresel haritalar üretiyor.</li><li>2025'te Sentinel-4 (saatlik, Avrupa) ve Sentinel-5 (küresel) ilk görüntülerini verdi.</li><li>Yapay zeka, büyük veri akışında emisyon bulutlarını bulmak, yanlış alarmları ayıklamak ve kaynağı tahmin etmek için kullanılıyor.</li><li>Bulut, çözünürlük ve günde tek geçiş gibi sınırlar nedeniyle uydu verisi yer ölçümleriyle birlikte yorumlanmalı.</li></ul></div>

<div class="faq"><details><summary>Uydular karbondioksiti de ölçebiliyor mu?</summary><p>Evet, CO₂ ölçen uydular var; ancak CO₂'nin atmosferdeki arka plan miktarı çok yüksek olduğu için, insan kaynaklı salımları ayırt etmek NO₂ veya metana göre daha zordur. Bu alan için Avrupa'da özel görevler planlanıyor.</p></details><details><summary>Bu veriler gerçekten herkese açık mı?</summary><p>Copernicus programı açık ve ücretsiz veri politikası izliyor. Ham ve işlenmiş ürünlere çevrimiçi platformlar üzerinden erişilebiliyor; teknik bilgi gerektiren ürünlerin yanında hazır harita servisleri de bulunuyor.</p></details><details><summary>Uydu bir sızıntıyı tespit ederse ne olur?</summary><p>Bu, tespiti kimin yaptığına ve hangi mekanizmaya bağlı olduğuna göre değişir. Örneğin UNEP'in MARS sistemi, tespit ettiği büyük metan salımlarını ilgili hükümetlere ve mümkünse tesis işletmecilerine bildiriyor; müdahale ise o kurumların sorumluluğunda kalıyor.</p></details></div>

---

**Kaynaklar**

- [Copernicus SentiWiki: Sentinel-5P mission](https://sentiwiki.copernicus.eu/web/s5p-mission)
- [ESA: Sentinel-4 images](https://www.esa.int/ESA_Multimedia/Missions/Sentinel-4/(result_type)/images)
- [ESA: Sentinel-5 images](https://www.esa.int/ESA_Multimedia/Missions/Sentinel-5/(result_type)/images)
- [UNEP: About the Methane Alert and Response System (MARS)](https://unep.org/about-methane-alert-and-response-system-mars)
- [MethaneSAT: MethaneSAT Loses Contact with Satellite](https://www.methanesat.org/project-updates/methanesat-loses-contact-satellite)
