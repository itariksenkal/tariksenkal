---
title: "Ses Tanıma Nasıl Çalışır? Konuşmadan Metne Giden Yol"
description: "Ses tanıma konuşmayı nasıl metne çevirir? Ses öznitelikleri, Whisper gibi uçtan uca modeller, kelime hata oranı, Türkçenin zorlukları ve ses gizliliği."
publishDate: "2026-11-29T09:17:00+03:00"
lang: tr
category: "Temeller"
tags: ["Ses Tanıma", "Yapay Zeka", "Türkçe NLP"]
translation: "how-speech-recognition-works"
heroImage:
  src: "../../../assets/blog/covers/ses-tanima-nasil-calisir.jpg"
  alt: "Ses dalgasının metne dönüşümünü temsil eden görsel"
---

Telefonunuza bir mesajı sesle yazdırdığınızda, bir toplantının dökümünü otomatik aldığınızda ya da bir çağrı merkezinde "lütfen talebinizi kısaca söyleyin" sesini duyduğunuzda, arka planda aynı teknoloji çalışır: otomatik konuşma tanıma, yani konuşmayı metne çevirme. Kulağa basit geliyor, çünkü biz insanlar bunu zahmetsizce yapıyoruz. Ama bir bilgisayar için konuşma yalnızca havadaki basınç dalgalanmalarından ibaret. Türkçe doğal dil işleme üzerine çalışan biri olarak bu yazıda sesin metne nasıl dönüştüğünü, başarının nasıl ölçüldüğünü, Türkçenin neden ayrıca zor olduğunu ve ses verisini paylaşırken nelere dikkat etmek gerektiğini sade bir dille anlatmaya çalışacağım.

## Bilgisayar için ses nedir?

Mikrofon, havadaki titreşimleri bir elektrik sinyaline çevirir. Bu sinyal saniyede binlerce kez ölçülerek bir sayı dizisine dönüştürülür; buna _örnekleme_ denir. Konuşma tanımada sık kullanılan oran saniyede 16.000 ölçümdür. Yani bir dakikalık konuşma, yaklaşık bir milyon sayıdan oluşan bir dizidir.

Bu ham dizi doğrudan işlenebilir ama genellikle önce daha anlamlı bir temsile çevrilir. Ses, 20–30 milisaniyelik küçük pencerelere bölünür ve her pencerede hangi frekansların ne kadar güçlü olduğuna bakılır. Ortaya çıkan tabloya _spektrogram_ denir: yatay eksen zaman, dikey eksen frekans, renk ise enerjidir. Çoğu sistem, insan kulağının frekansları algılama biçimine benzeyen bir ölçek kullanır (Mel ölçeği). Böylece "a" ile "e" arasındaki fark ya da "s" sesinin tıslaması, model için görünür desenlere dönüşür.

## Klasik hattan uçtan uca modellere

Uzun yıllar boyunca konuşma tanıma sistemleri birkaç ayrı parçadan oluşuyordu:

- **Akustik model:** Ses parçalarını fonem (ses birimi) olasılıklarına çevirir.
- **Telaffuz sözlüğü:** Hangi fonem dizisinin hangi kelimeye karşılık geldiğini söyler.
- **Dil modeli:** "Hangi kelime dizisi daha olası?" sorusunu yanıtlar; "kar yağdı" ile "kâr yağdı" arasında seçim yapmaya yardım eder.

Bu parçaların her biri ayrı ayrı uzmanlık ve veri gerektiriyordu. Son yıllarda yaygınlaşan yaklaşım ise _uçtan uca_ modellerdir: tek bir sinir ağı spektrogramı alır ve doğrudan metni üretir. Ara adımları ağ kendisi öğrenir.

Bunun bilinen bir örneği OpenAI'ın 2022'de yayımladığı **Whisper** modelidir. Makalesine göre model, internetten toplanmış 680.000 saatlik etiketli ses üzerinde eğitildi; bu verinin 117.000 saati İngilizce dışındaki 96 dile aitti. Whisper, sesi 16 kHz'e indirip 30 saniyelik parçalara böler, her parçayı Mel spektrogramına çevirir ve bir kodlayıcı-kod çözücü (encoder-decoder) Transformer ile metni kelime kelime değil, küçük metin parçaları (token) halinde üretir. Kod çözücü kısmı aslında bir dil modeli gibi çalışır: bir önceki tokene bakarak bir sonrakini tahmin eder.

Uçtan uca modellerin gücü, gürültüye, farklı mikrofonlara ve aksanlara karşı daha dayanıklı olmalarıdır. Zayıf tarafı ise yine bir dil modeli gibi davranmalarından gelir: ses belirsiz olduğunda veya uzun sessizliklerde, kulağa makul gelen ama söylenmemiş bir cümle "uydurabilirler". Bu yüzden kritik kayıtlarda çıktının mutlaka bir insan tarafından gözden geçirilmesi gerekir.

## Başarı nasıl ölçülür: Kelime hata oranı

Konuşma tanımanın standart ölçütü **kelime hata oranıdır** (Word Error Rate, WER). Model çıktısı, insanın yazdığı doğru metinle (referans) hizalanır ve üç tür hata sayılır:

| Hata türü | Anlamı | Örnek (referans: "yarın saat üçte geliyorum") |
|---|---|---|
| Yer değiştirme (S) | Yanlış kelime | "yarın saat **üçe** geliyorum" |
| Silme (D) | Eksik kelime | "yarın üçte geliyorum" |
| Ekleme (I) | Fazladan kelime | "yarın saat üçte **ben** geliyorum" |

Formül basittir: WER = (S + D + I) / N. Burada N, referanstaki kelime sayısıdır. %10 WER, kabaca her on kelimeden birinde hata olması demektir. Düşük olan iyidir; ekleme hataları çoksa oran %100'ü bile aşabilir.

<div class="callout"><strong>İpucu:</strong> Bir ürünün "yüzde 95 doğruluk" iddiasını görünce hangi veri üzerinde ölçüldüğünü sorun. Stüdyoda okunmuş metinle gürültülü bir telefon görüşmesi arasında hata oranı kat kat fark edebilir. Kendi kayıtlarınızdan küçük bir test seti hazırlamak en güvenilir yoldur.</div>

## Türkçe neden ayrıca zor?

Türkçe, konuşma tanıma sistemleri için birkaç açıdan zorlu bir dildir.

**Eklemeli yapı.** Türkçede tek bir kelime, İngilizcede bütün bir cümlenin taşıdığı bilgiyi taşıyabilir: "evlerimizdekilerden" gibi. Bu, olası kelime biçimlerinin sayısını neredeyse sınırsız hale getirir. Model daha önce hiç görmediği bir ek dizisiyle karşılaşabilir. Ayrıca WER hesabında tek bir ek hatası ("evlerimizden" yerine "evlerimizde") bütün kelimeyi yanlış sayar. Bu yüzden Türkçe için kelime hata oranının yanında karakter hata oranına (CER) da bakmak daha adil bir tablo sunar.

**Aksan ve ağız farkları.** Karadeniz, Ege, Doğu Anadolu ağızları; ünlü uzunlukları, "ğ"nin telaffuzu, hızlı konuşmada yutulan heceler... Eğitim verisi ağırlıklı olarak İstanbul Türkçesine yakın konuşmalardan oluşuyorsa, diğer ağızlarda hata oranı artar.

**Dil karıştırma (code-switching).** Gündelik ve iş dilinde "toplantıya join oldum", "deadline'ı kaçırdık" gibi cümleler çok yaygın. Model, aynı cümlede İngilizce bir kökü Türkçe bir ekle birleştirmek zorunda kalır ve burada sık sık tökezler.

**Veri miktarı.** İngilizce için yüz binlerce saatlik veri varken, açık Türkçe veri çok daha sınırlıdır. Örneğin Mozilla'nın gönüllü katkılarla oluşan Common Voice projesinin Mart 2026'da yayımlanan 25.0 sürümünde Türkçe için yaklaşık 129 saat doğrulanmış kayıt bulunuyor. Değerli bir kaynak ama ölçek farkı açık.

**Yazım ve normalizasyon.** "3 Mart" mı "üç mart" mı? "Dr." mı "doktor" mu? Model doğru duysa bile referansla farklı biçimde yazarsa hata sayılır. Türkçe değerlendirmelerde metni karşılaştırmadan önce sayıları, büyük-küçük harfleri ve noktalama işaretlerini tutarlı hale getirmek önemlidir. Özellikle "I/ı" ve "İ/i" dönüşümleri, İngilizce varsayılanlarla çalışan araçlarda sinsi hatalara yol açabilir.

## Ses verisi ve gizlilik

Ses kaydı yalnızca söylenen sözcüklerden ibaret değildir. Bir kayıttan konuşanın kimliği, yaşı hakkında ipuçları, duygu durumu ve arka plandaki başka kişilerin sesleri de çıkarılabilir. Bu nedenle ses verisi kişisel veridir ve dikkatle ele alınmalıdır.

Türkiye'de 6698 sayılı Kişisel Verilerin Korunması Kanunu, biyometrik verileri "özel nitelikli kişisel veri" olarak sayar. Bir ses kaydının kişiyi tanımak veya doğrulamak için (ses izi gibi) kullanılması, onu bu daha sıkı korunan kategoriye taşıyabilir. Yalnızca metne çevirme amacıyla işlenen kayıtlar bile kişisel veri olarak kalır.

Pratikte sorulması gereken sorular şunlardır:

- **Ses nerede işleniyor?** Cihaz üzerinde mi, bir bulut sunucusunda mı? Bulutsa hangi ülkede?
- **Kayıt saklanıyor mu?** Metin üretildikten sonra ses siliniyor mu, ne kadar süre tutuluyor?
- **Model eğitiminde kullanılıyor mu?** Birçok hizmette bu bir ayardır; varsayılan değeri kontrol edin.
- **Kimler duyuyor?** Toplantı kaydı alıyorsanız katılımcıları önceden bilgilendirin.

<div class="callout"><strong>Not:</strong> Bu bölüm genel bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Kurumsal bir projede ses verisi işleyecekseniz bir uzmandan destek alın.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Konuşma tanıma, sesi önce spektrogram gibi bir temsile çevirir, ardından bir model bu temsilden metni üretir.</li><li>Whisper gibi uçtan uca modeller eski çok parçalı sistemlerin yerini büyük ölçüde aldı; ancak belirsiz seste metin uydurabilirler.</li><li>Kelime hata oranı (WER) standart ölçüttür; Türkçede karakter hata oranına da bakmak daha adil bir tablo verir.</li><li>Eklemeli yapı, ağız farkları, dil karıştırma ve sınırlı açık veri Türkçeyi zorlaştırır.</li><li>Ses kaydı kişisel veridir; nerede işlendiğini, saklanıp saklanmadığını ve eğitimde kullanılıp kullanılmadığını sorun.</li></ul></div>

<div class="faq"><details><summary>Ses tanıma ile ses asistanı aynı şey mi?</summary><p>Hayır. Ses tanıma yalnızca konuşmayı metne çevirir. Bir ses asistanı ise bu metni anlamaya, bir işlem yapmaya ve çoğu zaman yanıtı yeniden sese çevirmeye (metinden sese) çalışır. Ses tanıma, bu zincirin ilk halkasıdır.</p></details><details><summary>İyi bir Türkçe döküm için ne yapabilirim?</summary><p>Mikrofonu ağza yakın tutun, arka plan gürültüsünü azaltın, aynı anda birden fazla kişinin konuşmasından kaçının. Özel isimler ve terimler çoksa, bazı araçların sunduğu "özel kelime listesi" veya bağlam ipucu özelliklerini kullanın. Çıktıyı mutlaka gözden geçirin.</p></details><details><summary>Kelime hata oranı yüzde kaç olursa "iyi" sayılır?</summary><p>Tek bir eşik yoktur; kullanım amacına bağlıdır. Not almak için biraz hata tolere edilebilir; altyazı, tıbbi veya hukuki kayıt gibi alanlarda çok daha düşük hata ve insan kontrolü gerekir. Önemli olan, kendi kayıtlarınıza benzeyen verilerde ölçmektir.</p></details><details><summary>Sesimi metne çeviren uygulama sesimi saklar mı?</summary><p>Uygulamaya göre değişir. Gizlilik politikasında sesin nerede işlendiğini, ne kadar süre saklandığını ve model geliştirmede kullanılıp kullanılmadığını kontrol edin. Mümkünse bu kullanımı kapatabileceğiniz ayarları arayın.</p></details></div>

---

**Kaynaklar**

- [Radford ve diğerleri, "Robust Speech Recognition via Large-Scale Weak Supervision" (Whisper makalesi)](https://ar5iv.labs.arxiv.org/html/2212.04356)
- [Hugging Face Evaluate: Kelime hata oranı (WER) ölçütü](https://huggingface.co/spaces/evaluate-metric/wer/blob/main/README.md)
- [Mozilla Common Voice Scripted Speech 25.0 – Türkçe veri seti](https://datacollective.mozillafoundation.org/datasets/cmn2e7kbl01k2mm07gm5n1bc9)
- [6698 sayılı Kişisel Verilerin Korunması Kanunu (Mevzuat Bilgi Sistemi)](https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf)
