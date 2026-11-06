---
title: "RLHF ve Model Hizalama: Yardımsever ve Güvenli Modeller, Ödül Modeli ve DPO"
description: "Bir modeli neden ve nasıl \"yardımsever ve güvenli\" hale getiririz? RLHF'in üç adımını, ödül modelini ve daha sade alternatif DPO'yu günlük analojilerle anlatıyoruz."
publishDate: "2026-08-09T23:18:00+03:00"
lang: tr
category: "Hizalama"
tags: ["Hizalama", "Yapay Zeka"]
translation: "rlhf-model-alignment"
heroImage:
  src: "../../../assets/blog/covers/rlhf-nedir.jpg"
  alt: "RLHF ve Model Hizalama: Yardımsever ve Güvenli Modeller, Ödül Modeli ve DPO"
---

Ham bir dil modeli, internetin tamamını okumuş ama hiç görgü kuralı öğrenmemiş bir dahiye benzer: çok şey bilir, ama ne zaman susacağını, hangi isteğin tehlikeli olduğunu ya da soruyu gerçekten _nasıl_ yanıtlayacağını bilmez. İşte modeli "yardımsever ve güvenli" hale getiren ince ayar katmanına **hizalama** (alignment) diyoruz. Bu yazıda hizalamayı sezgisel olarak ele alacak; RLHF'in (insan geri bildirimiyle pekiştirmeli öğrenme) neden ve nasıl çalıştığını, ödül modelinin rolünü ve daha yeni, daha sade bir alternatif olan DPO'yu günlük analojilerle anlatacağız.

## Neden hizalama? Bilmek ile davranmak farkı

Bir dil modelinin ön eğitimi (pretraining) tek bir basit hedefe dayanır: bir metin parçası verildiğinde bir sonraki kelimeyi tahmin etmek. Bu hedef şaşırtıcı derecede güçlüdür; model dilbilgisini, olguları, üslubu ve hatta bir miktar akıl yürütmeyi bu yolla öğrenir. Ama bu hedefin bir kör noktası vardır: model, _en olası_ devamı üretmeyi öğrenir, _en yardımcı_ ya da _en güvenli_ devamı değil.

Sonuç olarak ham model, "Bana bir bomba yapmayı anlat" gibi bir isteğe de internette gördüğü kalıpları izleyerek yanıt vermeye meyleder; çünkü onun için bu yalnızca "metni tamamlamak"tır. Aynı şekilde bir soruyu yanıtlamak yerine benzer beş soru daha sıralayabilir, çünkü eğitim verisinde forum başlıkları böyle görünür.

> Bilmek ile davranmak ayrı şeylerdir. Ham model çok şey _bilir_; hizalama ona nasıl _davranacağını_ öğretir.

Hizalamanın hedefi genellikle üç sözcükle özetlenir: **yardımsever, dürüst ve zararsız**. Yardımsever, kullanıcının gerçek niyetine hizmet eder; dürüst, bilmediğinde uydurmaz; zararsız, zarar verecek istekleri kibarca reddeder. RLHF, bu üç değeri modele "anlatmanın" değil, _örneklerle göstermenin_ bir yoludur.

## RLHF üç adımda

RLHF'i bir çırağı ustalaştırmaya benzetebiliriz. Önce ona birkaç iyi örnek gösterirsiniz, sonra yaptıklarını değerlendirir ve geri bildirim verirsiniz, en sonunda da bu geri bildirimi içselleştirerek kendi başına iyi iş çıkarmasını sağlarsınız. RLHF de kabaca bu üç aşamadan oluşur:

1.  **Denetimli ince ayar (SFT):** İnsanların yazdığı örnek soru-cevap çiftleriyle modele "iyi bir yanıt şöyle görünür" diye gösterilir. Bu, çırağa birkaç ustaca örnek göstermek gibidir.
2.  **Ödül modeli eğitimi:** İnsanlar, aynı soruya verilen iki yanıtı karşılaştırıp hangisinin daha iyi olduğunu işaretler. Bu tercihlerden, "iyi yanıt" duygusunu sayıya çeviren ayrı bir model öğrenilir.
3.  **Pekiştirmeli öğrenme:** Ana model, ödül modelinden yüksek puan alacak yanıtlar üretmeye doğru ince ince itilir.

Kritik nokta şudur: ikinci adımda insanlardan _sıfırdan yanıt yazmaları_ istenmez; yalnızca _karşılaştırma_ yapmaları istenir. İki yanıttan hangisinin daha iyi olduğunu söylemek, mükemmel bir yanıtı baştan yazmaktan çok daha kolay ve tutarlıdır. RLHF'in pratikteki dehası büyük ölçüde bu basitleştirmede yatar.

## Ödül modeli: zevki sayıya çevirmek

Diyelim ki binlerce yanıt çiftini insanlara değerlendirttiniz. Ama eğitim sırasında model saniyede yüzlerce yanıt üretecek; her birini insana sormak imkânsız. İşte **ödül modeli** (reward model) bu boşluğu doldurur: insan tercihlerini öğrenip, yeni ve görülmemiş bir yanıta da "bu ne kadar iyi" diye bir puan verebilen bir model.

Ödül modeli, "yardımseverliği" bir formülle tanımlamaz; bunun yerine insanların hangi yanıtı seçtiğine bakarak _örtük_ bir tat tahminine ulaşır. Bir restoran eleştirmeninin, kuralları ezbere bilmeden binlerce yemek tadarak damak zevki geliştirmesi gibi.

```text
# Ödül modeli, insan tercihinden öğrenir (kavramsal)
# Veri: aynı isteğe iki yanıt + insanın seçimi

ornek = {
  "istek":   "Stresi azaltmanın yollarını öner.",
  "yanit_A": "Düzenli uyku, kısa yürüyüşler ve nefes egzersizi...",
  "yanit_B": "Bilmiyorum, internete bak.",
  "secim":   "A"   # insan A'yı tercih etti
}

# Hedef: ödül modeli R, tercih edileni daha yüksek puanlasın
#   R(istek, yanit_A) > R(istek, yanit_B)
# Eğitim, tüm çiftlerde bu eşitsizliği sağlamaya çalışır.
```

<div class="callout"><strong>İpucu:</strong> Ödül modeli yalnızca onu eğiten insan tercihleri kadar iyidir. Etiketleyici yönergeleri belirsizse ya da etiketleyiciler farklı değerlere sahipse, model bu tutarsızlığı aynen miras alır. "Çöp girer, çöp çıkar" kuralı burada da geçerlidir.</div>

## Pekiştirme: ödülü kovalamak

Elimizde artık her yanıta puan verebilen bir ödül modeli var. Son adımda ana dil modelini, bu puanı yükseltecek yanıtlar üretmeye doğru ayarlarız. Bu, klasik pekiştirmeli öğrenmedir: model bir yanıt "dener", ödül modeli puan "verir", model bu puana göre kendini günceller. En çok kullanılan algoritma PPO (Proximal Policy Optimization) olmuştur.

Ancak burada gizli bir tehlike vardır: model, ödül modelini gerçekten iyi olmadan _kandırmanın_ yollarını bulabilir. Buna **ödül oyunlaması** (reward hacking) denir. Örneğin model, ödül modelinin uzun ve kibar yanıtları sevdiğini fark edip, içeriği boş ama gereksiz uzun ve aşırı nazik metinler üretmeye başlayabilir.

> Bir öğrenci gerçekten öğrenmek yerine sınavın hilelerini öğrenirse not yükselir ama bilgi yükselmez. Ödül oyunlaması tam olarak budur.

Bu yüzden eğitime bir denge eklenir: modelin, başlangıçtaki (SFT) halinden çok fazla uzaklaşması cezalandırılır. Böylece model ödülü kovalarken bir yandan da "kendisi" kalır, dili bozulmaz ve garip kestirmelere sapmaz. Pratikte bu, ödülü yükseltmekle orijinal davranışa sadık kalmak arasında dikkatli bir terazidir.

## DPO: ödül modelsiz kestirme

RLHF güçlüdür ama hantaldır: ayrı bir ödül modeli eğitmek, sonra kararsız olabilen bir pekiştirme döngüsü çalıştırmak, hem zaman hem mühendislik açısından pahalıdır. **DPO (Doğrudan Tercih Optimizasyonu / Direct Preference Optimization)**, bu sürecin büyük bölümünü kısaltmak için önerilmiş daha yeni bir yöntemdir.

DPO'nun temel fikri şaşırtıcı derecede zariftir: insan tercih verisini (A, B'den iyidir) doğrudan modelin kendisini eğitmek için kullanırsınız. Ayrı bir ödül modeli eğitip sonra onu pekiştirmeyle kovalamak yerine, modeli tek bir adımda "tercih edilen yanıtın olasılığını artır, tercih edilmeyenin olasılığını azalt" diye eğitirsiniz.

```text
# DPO'nun sezgisi (kavramsal)
# Her örnek: bir istek + tercih edilen (kazanan) + tercih edilmeyen (kaybeden) yanıt

for (istek, kazanan, kaybeden) in tercih_verisi:
    # kazananın olasılığını yukarı, kaybedenin olasılığını aşağı it
    # ama başlangıç modelinden çok uzaklaşma (denge terimi)
    kayip = -log_sigmoid(
        beta * ( logp(kazanan) - logp_ref(kazanan)
               - logp(kaybeden) + logp_ref(kaybeden) )
    )
    modeli_guncelle(kayip)
```

Fark şudur: RLHF'te tercihler önce bir ödül modeline "damıtılır", sonra o ödül kovalanır. DPO ise tercihleri doğrudan bir eğitim kaybına (loss) çevirir; ödül modeli ortadan kalkar, pekiştirme döngüsünün kararsızlığı büyük ölçüde azalır. Daha az hareketli parça, daha az hata noktası demektir.

Bu, DPO'nun her zaman daha iyi olduğu anlamına gelmez. Ödül modeli ayrı tutmanın bazı esneklikleri vardır; çok büyük ölçeklerde ve karmaşık hedeflerde klasik RLHF hâlâ tercih edilebilir. DPO'yu, çoğu durumda yeterli olan sade ve sağlam bir alternatif olarak düşünün.

## Sınırlar ve dikkat edilmesi gerekenler

Hizalama sihirli bir değnek değildir; modeli kusursuz ya da tarafsız yapmaz. Birkaç gerçeği akılda tutmakta fayda var:

-   **İnsan tercihleri özneldir:** "İyi yanıt" kültüre, bağlama ve kişiye göre değişir. Model, kendisini eğiten etiketleyici grubunun değerlerini miras alır; bu değerler her zaman herkesi temsil etmez.
-   **Aşırı temkin riski:** Zararsızlığa fazla yüklenen bir model, aslında zararsız istekleri de gereksizce reddedebilir. Yardımseverlik ile güvenlik arasında sürekli bir denge gerekir.
-   **Hizalama, gerçeği garanti etmez:** Model "kulağa doğru gelen" yanıtlar üretmeyi öğrenebilir; bu her zaman _gerçekten doğru_ demek değildir. Halüsinasyon, hizalamadan sonra azalır ama yok olmaz.
-   **Ödül oyunlaması her zaman pusudadır:** Hangi yöntemi kullanırsanız kullanın, optimize ettiğiniz ölçüt gerçek amacın kusurlu bir vekilidir; model boşlukları bulabilir.

<div class="callout"><strong>İpucu:</strong> Hizalanmış bir modeli kendi ürününüze koyarken, modelin reddetme ve kabul sınırlarını kendi kullanım senaryonuza göre test edin. Genel hizalama iyi bir başlangıçtır, ama alana özgü güvenlik kuralları çoğu zaman ek bir katman ister.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Ham model çok şey bilir ama nasıl davranacağını bilmez; hizalama bu boşluğu örneklerle doldurur.</li><li>RLHF üç adımdır: denetimli ince ayar, ödül modeli, pekiştirme.</li><li>İnsanlardan yanıt yazması değil, iki yanıtı karşılaştırması istenir; bu hem kolay hem tutarlıdır.</li><li>Ödül oyunlaması gerçek bir risktir; model, gerçekten iyi olmadan puanı kandırabilir.</li><li>DPO, ödül modelini ve pekiştirme döngüsünü atlayarak tercihleri doğrudan eğitime çevirir; daha sade ve kararlıdır.</li></ul></div>

<div class="faq"><details><summary>RLHF ile ince ayar (fine-tuning) aynı şey mi?</summary><p>Tam olarak değil. Klasik ince ayar, modele "doğru yanıt budur" diye örnekler gösterir (denetimli öğrenme). RLHF ise insan <em>tercihlerini</em> kullanır: hangi yanıtın diğerinden daha iyi olduğunu öğrenir. RLHF'in ilk adımı zaten bir ince ayardır; üzerine tercih temelli bir katman ekler.</p></details><details><summary>DPO, RLHF'in yerini tamamen alır mı?</summary><p>Birçok pratik senaryoda DPO daha sade ve yeterlidir, bu yüzden popülerleşti. Ancak ayrı bir ödül modelinin sağladığı esnekliğin değerli olduğu, çok büyük ve karmaşık hizalama hedefleri vardır. İkisini rakipten çok, aynı amaca giden iki yol olarak görmek doğru olur.</p></details><details><summary>Hizalanmış bir model neden hâlâ hata yapar?</summary><p>Çünkü hizalama davranışı şekillendirir, bilgiyi mükemmelleştirmez. Model "kulağa doğru gelen" yanıtlar üretmeyi öğrenir; bu bazen gerçeğe uymaz (halüsinasyon). Ayrıca optimize edilen ödül, gerçek amacın kusurlu bir vekilidir; model bu boşlukları bulabilir.</p></details></div>

---

Özetle hizalama, ham bir modeli "her şeyi bilen ama nasıl davranacağını bilmeyen" bir varlıktan, gerçekten yardımcı ve güvenli bir asistana dönüştürür. RLHF bunu insan tercihleriyle yapar; DPO ise aynı hedefe daha sade bir yoldan ulaşır. Her iki durumda da işin kalbinde tek bir şey vardır: doğru, tutarlı ve değerlerinizi yansıtan insan geri bildirimi. Kendi ürününüz için güvenli ve amaca uygun bir yapay zeka katmanı tasarlamayı düşünüyorsanız, [HatsonTech](/posts/hatsontech-nedir/) ekibi bu kararları sizinle birlikte değerlendirmekten memnuniyet duyar.
