---
title: "Model Damıtma ve Küçük Modeller: Büyük Öğretmenden Küçük Öğrenciye Bilgi Aktarımı"
description: "Model damıtma (knowledge distillation), büyük bir öğretmen modelin bilgisini küçük ve hızlı bir öğrenci modele aktarır. Yumuşak etiketleri, sıcaklığı ve damıtma kaybını; bunun neden, nasıl ve ne zaman işe yaradığını sezgisel örneklerle anlatıyoruz."
publishDate: "2026-08-09T23:23:00+03:00"
lang: tr
category: "Verimlilik"
tags: ["Verimlilik", "Yapay Zeka"]
translation: "knowledge-distillation"
heroImage:
  src: "../../../assets/blog/bimg-03.jpg"
  alt: "Model Damıtma ve Küçük Modeller: Büyük Öğretmenden Küçük Öğrenciye Bilgi Aktarımı"
---

En güçlü yapay zeka modelleri genellikle en büyük olanlardır; ama büyük olmak her zaman pratik değildir. Devasa bir model gecikmesiz çalışmaz, telefonunuza sığmaz, sunucu faturasını şişirir. İşte model damıtma (knowledge distillation), bu ikilemi çözmek için doğmuş zarif bir fikirdir: büyük ve becerikli bir “öğretmen” modelin bildiklerini, küçük ve hızlı bir “öğrenci” modele aktarmak. Bu yazıda damıtmanın ne olduğunu günlük analojilerle, neden işe yaradığını ve ne zaman tercih edilmesi gerektiğini sezgisel olarak anlatıyoruz.

## Damıtma tek cümlede

Model damıtma, büyük bir modelin (öğretmen) ürettiği zengin çıktıları, küçük bir modelin (öğrenci) taklit etmesini sağlayarak onu eğitme tekniğidir. Amaç, öğretmenin doğruluğunu mümkün olduğunca koruyan ama çok daha küçük, hızlı ve ucuz çalışan bir model elde etmektir.

Fikrin temelinde basit ama güçlü bir gözlem yatar: bir modeli yalnızca “doğru cevabı” öğreterek değil, “neye ne kadar emin olduğunu” da öğreterek eğitmek çok daha verimlidir. Bu fikir, 2015 yılında Geoffrey Hinton ve arkadaşlarının çalışmasıyla popülerleşti.

> Pratik kural: Damıtma, bilgiyi büyük bir modelden küçük bir modele sıkıştırır; sihir, sadece nihai cevabı değil, modelin “düşünce biçimini” aktarmasındadır.

## Usta-çırak analojisi

Deneyimli bir aşçıyı (öğretmen) ve yanında yetişen bir çırağı (öğrenci) düşünün. Çırak, sadece tarif kitabındaki kuru talimatları okuyarak da yemek yapmayı öğrenebilir; bu, modeli yalnızca “doğru etiketlerle” eğitmeye benzer.

Ama çırak ustanın yanında durup onu izlerse çok daha hızlı ustalaşır. Usta sadece “tuzu koy” demez; “bu çorba tuzu kaldırır ama az, çünkü peynir zaten tuzlu” der. İşte bu ek bilgi (bir seçeneğin diğerine ne kadar yakın olduğu, hangi tuzakların var olduğu) öğretmenin yumuşak bilgisidir. Damıtma, çırağa sadece sonucu değil, bu nüansları da öğretir.

<div class="callout"><strong>İpucu:</strong> Damıtmayı “kopyalama” değil, “mentorluk” olarak düşünün. Öğrenci öğretmeni körü körüne taklit etmez; onun belirsizliklerinden ve önceliklerinden ders çıkarır.</div>

## Neden işe yarar: yumuşak etiketler

Damıtmanın kalbinde **yumuşak etiketler** (soft labels) yatar. Bir görüntü sınıflandırma modeli, bir kedi fotoğrafına baktığında yalnızca “kedi” demez; her sınıf için bir olasılık üretir. Sert etiket (hard label) yalnızca tek doğruyu söyler:

-   **Sert etiket:** kedi = 1, köpek = 0, aslan = 0
-   **Yumuşak etiket (öğretmenin çıktısı):** kedi = 0,90, köpek = 0,07, aslan = 0,03

Yumuşak etiket çok daha fazla bilgi taşır. Modele “bu bir kedi” demenin yanında, “ama köpeğe biraz benziyor, aslana ise hiç benzemiyor” bilgisini de verir. Bu nüanslı sinyal, öğretmenin yıllarca süren eğitiminde öğrendiği gizli ilişkileri (sınıflar arası benzerlikleri) özetler. Hinton bu bilgiye “karanlık bilgi” (dark knowledge) adını verir: doğru cevapta görünmeyen ama yanlış cevapların göreli olasılıklarında saklı olan değerli sinyal.

> Öğrenci, öğretmenin neden emin olduğunu değil, neden tereddüt ettiğini öğrenince gerçekten hızlanır.

## Nasıl çalışır: sıcaklık ve kayıp

Yumuşak etiketler bazen fazla keskindir; öğretmen “kedi = 0,99” derse, diğer sınıfların taşıdığı nüans neredeyse kaybolur. Bu nüansı belirginleştirmek için **sıcaklık (temperature)** adında bir ayar kullanılır.

Sıcaklık, softmax fonksiyonuna eklenen bir parametredir. Yüksek bir sıcaklık, olasılık dağılımını “yumuşatır”: keskin tepeyi düzleştirir ve küçük olasılıkları daha görünür kılar. Böylece öğrenci, öğretmenin ince ayrımlarını daha net görebilir.

Eğitim sırasında öğrenci iki sinyali birden dengeler:

-   **Damıtma kaybı:** Öğrencinin (yumuşatılmış) çıktısı, öğretmenin (yumuşatılmış) çıktısına ne kadar benziyor?
-   **Öğrenci kaybı:** Öğrencinin çıktısı, gerçek/sert etikete ne kadar yakın?

Bu iki kayıp ağırlıklı olarak birleştirilir. Böylece öğrenci hem doğru cevabı hedefler hem de öğretmenin zengin “bakış açısını” taklit eder.

## Küçük bir örnek (pseudocode)

Aşağıdaki sözde-kod, tipik bir damıtma eğitim adımının iskeletini gösterir:

```python
def damitma_adimi(ogretmen, ogrenci, x, gercek_etiket, T, alpha):
    # Öğretmen sabittir; gradyan hesaplanmaz
    ogretmen_logit = ogretmen.tahmin(x).durdur_gradyan()
    ogrenci_logit  = ogrenci.tahmin(x)

    # 1) Yumuşatılmış dağılımlar (sıcaklık T ile)
    yumusak_ogretmen = softmax(ogretmen_logit / T)
    yumusak_ogrenci  = softmax(ogrenci_logit  / T)

    # 2) Damıtma kaybı: öğretmeni taklit et
    kayip_damitma = KL(yumusak_ogretmen, yumusak_ogrenci) * (T * T)

    # 3) Öğrenci kaybı: gerçek etikete uy
    kayip_ogrenci = capraz_entropi(softmax(ogrenci_logit), gercek_etiket)

    # 4) İki sinyali ağırlıklı birleştir
    toplam = alpha * kayip_damitma + (1 - alpha) * kayip_ogrenci
    return toplam
```

Buradaki `T` sıcaklık, `alpha` ise iki kayıp arasındaki dengedir. `T * T` çarpanı, sıcaklık yükseldiğinde küçülen gradyanları dengelemek için kullanılır.

## Damıtma türleri

Damıtma tek bir yöntem değil, bir aileyi tarif eder. En sık karşılaşılan üç yaklaşım şudur:

-   **Cevap tabanlı (response-based):** Öğrenci yalnızca öğretmenin son çıktısını (yumuşak etiketleri) taklit eder. En klasik ve en basit yaklaşımdır.
-   **Özellik tabanlı (feature-based):** Öğrenci, öğretmenin ara katmanlarındaki temsilleri de taklit eder. Yani sadece sonucu değil, “düşünme sürecindeki ara adımları” da öğrenir.
-   **İlişki tabanlı (relation-based):** Öğrenci, öğretmenin örnekler veya katmanlar arasında kurduğu ilişkileri yakalamaya çalışır.

Üretken dil modellerinde ise yaygın bir varyant, öğretmen modelin ürettiği yüksek kaliteli metinlerin doğrudan öğrenci için eğitim verisine dönüştürülmesidir; buna sıklıkla “sequence-level” veya veri damıtma denir.

## Ne zaman kullanmalı, ne zaman kaçınmalı

Damıtma her derde deva değildir. Doğru senaryoda parlar:

-   **Gecikme kritikse →** mobil cihaz, tarayıcı veya gerçek zamanlı uygulamalarda küçük model şarttır.
-   **Maliyet önemliyse →** küçük model daha az hesaplama, daha düşük sunucu faturası demektir.
-   **Cihaz üstü (on-device) çalışma gerekiyorsa →** büyük model sığmadığında damıtma tek yol olabilir.
-   **Elinizde güçlü bir öğretmen ve bol etiketsiz veri varsa →** öğretmen bu veriyi yumuşak etiketlerle “zenginleştirebilir”.

Kaçınmanız gereken durumlar da var:

-   Öğretmen modeliniz zaten zayıfsa, öğrenci ondan iyisini öğrenemez. “Çöp girer, çöp çıkar.”
-   Görev son derece basitse, küçük bir modeli sıfırdan eğitmek daha az zahmetli olabilir.
-   Maksimum doğruluk tek önceliğinizse ve donanım kısıtınız yoksa, büyük modeli doğrudan kullanmak daha mantıklıdır.

<div class="callout"><strong>İpucu:</strong> Damıtmayı genellikle nicemleme (quantization) ve budama (pruning) gibi diğer küçültme teknikleriyle birlikte düşünün; bunlar rakip değil, üst üste binen katmanlardır.</div>

## Gerçek dünyadan örnekler

Damıtma akademik bir merak değil, sahada yaygın bir pratiktir. Dil işleme dünyasında **DistilBERT**, BERT’in damıtılmış bir sürümü olarak tanınır: belirgin biçimde daha küçük ve hızlıdır, buna karşılık performansının büyük kısmını korur. Benzer şekilde **TinyBERT** gibi çalışmalar, ara katman temsillerini de damıtarak daha agresif küçültmeler hedefler.

Günümüzde büyük dil modelleri çağında damıtma yeniden parladı: güçlü bir model, kendisinden çok daha küçük modelleri eğitmek için yüksek kaliteli örnekler üretir. Böylece sınırlı kaynaklı ekipler bile, dev modellerin yeteneklerinin önemli bir kısmını çok daha küçük modellere taşıyabilir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Damıtma, büyük bir öğretmen modelin bilgisini küçük bir öğrenci modele aktarır.</li><li>Sihir, sert etiketlerde değil, öğretmenin yumuşak etiketlerindeki nüanslı “karanlık bilgi”dedir.</li><li>Sıcaklık parametresi nüansı belirginleştirir; eğitim, damıtma ve öğrenci kaybını dengeler.</li><li>Gecikme, maliyet ve cihaz üstü çalışma kritikse damıtma çok değerlidir.</li><li>Zayıf bir öğretmenden iyi bir öğrenci çıkmaz; öğretmenin kalitesi tavanı belirler.</li></ul></div>

<div class="faq"><details><summary>Damıtma her zaman doğruluk kaybına yol açar mı?</summary><p>Genellikle küçük bir kayıp olur, çünkü öğrenci öğretmenden daha küçüktür. Ancak iyi tasarlanmış bir damıtmada öğrenci, aynı boyutta sıfırdan eğitilmiş bir modelden belirgin biçimde daha iyi olur; çoğu uygulamada bu küçük kayıp, hız ve maliyet kazancının yanında kabul edilebilir.</p></details><details><summary>Öğrenci öğretmenden daha iyi olabilir mi?</summary><p>Nadir durumlarda evet. Yumuşak etiketler bir tür düzenlileştirme (regularization) etkisi yaratabilir ve öğrenci, özellikle belirli alt görevlerde öğretmeni geçebilir. Yine de tipik beklenti, öğretmenin performansına yaklaşmaktır, onu aşmak değil.</p></details><details><summary>Damıtma ile fine-tuning aynı şey mi?</summary><p>Hayır. Fine-tuning, bir modeli yeni bir görev veya veriyle yeniden eğitmektir. Damıtma ise bir modelin bilgisini başka (genelde daha küçük) bir modele aktarmaya odaklanır. İkisi birlikte de kullanılabilir: önce büyük modeli fine-tune edip sonra onu öğretmen olarak kullanabilirsiniz.</p></details></div>

---

Model damıtma, “daha büyük her zaman daha iyi” varsayımına zarif bir cevaptır: doğru yapıldığında, dev bir modelin zekâsının çoğunu cebinize sığacak kadar küçük bir modele taşır. Türkçe yapay zeka ürünleri geliştirirken hız ve maliyet dengesini pratikte nasıl kurduğumuzu merak ediyorsanız [HatsonTech](/posts/hatsontech-nedir/)'in yaklaşımına göz atabilirsiniz.
