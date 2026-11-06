---
title: "Çok Modlu (Multimodal) Modeller: Görüntü, Metin ve Sesi Birlikte İşleyen Yapay Zekâ Nasıl Çalışır?"
description: "Çok modlu modeller görüntü, metin ve sesi tek bir sistemde nasıl birleştirir? Vision-language modelleri, ortak embedding uzayını ve gerçek kullanım örneklerini sezgisel benzetmeler ve kısa kodla anlatıyoruz."
publishDate: "2026-08-09T23:25:00+03:00"
lang: tr
category: "Çok Modlu"
tags: ["Çok Modlu", "Yapay Zeka"]
translation: "multimodal-models"
heroImage:
  src: "../../../assets/blog/bimg-01.jpg"
  alt: "Çok Modlu (Multimodal) Modeller: Görüntü, Metin ve Sesi Birlikte İşleyen Yapay Zekâ Nasıl Çalışır?"
---

Bir arkadaşınız size bir tatil fotoğrafı gösterip “Burası neresi, sence güzel mi?” diye sorduğunda zihniniz aynı anda birçok şey yapar: görüntüyü görür, sorunun metnini anlar, belki arka plandaki dalga sesini hatırlar ve hepsini tek bir _anlamda_ birleştirir. **Çok modlu (multimodal) modeller** tam olarak bu yeteneği taklit etmeye çalışır: görüntü, metin ve sesi ayrı ayrı değil, _birlikte_ işlemek.

## Modalite nedir, neden “çok modlu”?

“Modalite”, bir bilginin bize ulaştığı kanal demektir: metin bir modalite, görüntü başka bir modalite, ses bir başkası. Klasik modeller genellikle **tek modlu**dur; sadece metin okur ya da sadece görüntü sınıflandırır. Çok modlu bir model ise birden fazla kanalı aynı anda alır ve aralarındaki ilişkiyi kurar.

Aradaki fark, bir kitabı okumakla bir filmi izlemek arasındaki fark gibidir. Metin tek başına çok şey anlatır, ama bir sahnedeki yüz ifadesi, ortamdaki müzik ve söylenen söz bir araya geldiğinde anlam katlanır. İnsan zekâsı doğal olarak çok modludur; yapay zekânın da bu yöne ilerlemesi şaşırtıcı değil.

> “Tek bir modalite dünyanın bir penceresidir; çok modluluk, aynı odaya açılan birkaç pencereyi aynı anda kullanmaktır.”

## Sezgi: farklı dilleri ortak bir dile çevirmek

Buradaki temel sorun şu: Bir görüntü piksellerden, bir metin kelimelerden, bir ses dalga örneklerinden oluşur. Bunlar tamamen farklı “alfabeler”dir. Bir modelin “şu fotoğraftaki kedi” ile “kedi” kelimesinin aynı şeye işaret ettiğini anlaması için, bu farklı alfabeleri **ortak bir dile** çevirmesi gerekir.

Bir benzetme: Üç çevirmen düşünün. Biri sadece resimden, biri sadece metinden, biri sadece sesten anlıyor. Eğer hepsi öğrendiklerini aynı ortak dile (diyelim ki “anlam dili”) çevirirse, artık bir resimle bir cümlenin aynı şeyi söyleyip söylemediğini karşılaştırabiliriz. Çok modlu modellerin kalbinde işte bu “anlam dili” fikri yatar. Teknik adıyla buna **ortak embedding uzayı** denir.

## Ortak embedding uzayı

Embedding, bir bilgiyi sayı vektörüne çevirmenin adıdır. Tek modlu sistemlerde her modalitenin kendi vektör uzayı vardır ve bunlar birbiriyle konuşamaz. Çok modlu modellerin ustalığı, farklı modaliteleri _aynı_ vektör uzayına yerleştirmektir. Bu uzayda:

-   Bir kedi fotoğrafının vektörü ile “bir kedi” cümlesinin vektörü birbirine **yakın** düşer.
-   Aynı kedi fotoğrafının vektörü ile “bir kamyon” cümlesinin vektörü birbirinden **uzak** düşer.
-   Yakınlık, çoğunlukla iki vektör arasındaki açıyla (kosinüs benzerliğiyle) ölçülür.

Peki model bunu nasıl öğrenir? Çoğu vision-language modeli, internetteki milyonlarca **resim–altyazı çifti** üzerinde eğitilir. Eğitim sırasında modele “bu resim hangi metne ait?” sorusu sorulur. Doğru eşleşen çiftler birbirine yaklaştırılır, yanlış eşleşmeler uzaklaştırılır. Buna _karşıtsal öğrenme_ (contrastive learning) denir ve CLIP gibi tanınmış modellerin temelidir. Sonuçta model, hiç görmediği bir resmi bile bir metinle anlamca eşleştirebilir hale gelir.

<div class="callout"><strong>İpucu:</strong> “Ortak uzay” fikrini şöyle hatırlayın: aynı anlamın farklı kıyafetleri (resim, metin, ses) aynı adrese taşınır. Adres aynıysa anlam aynıdır.</div>

## Vision-language modeller nasıl çalışır?

Görüntü ve dili birlikte işleyen modellere **vision-language modeller** (VLM) denir. Kabaca üç parça vardır:

1.  **Görüntü kodlayıcı (image encoder):** Resmi parçalara (yamalara) böler ve her birini vektöre çevirir. Genellikle bir Vision Transformer kullanılır.
2.  **Metin kodlayıcı / dil modeli:** Kelimeleri token'lara ayırıp vektörlere çevirir; bu, bildiğimiz dil modelinin temsil katmanıdır.
3.  **Hizalama / birleştirme katmanı:** İki tarafın vektörlerini aynı uzayda buluşturan köprü. Bazı modeller bunu karşıtsal eğitimle yapar; bazıları ise görüntü vektörlerini doğrudan dil modeline “görsel token’lar” olarak besler.

İkinci yaklaşım, bugün sohbet edebilen görme-dil modellerinin (ör. bir fotoğrafı yükleyip soru sorduğunuz asistanlar) çalışma biçimine yakındır: görüntü, dil modelinin “okuyabileceği” bir temsile dönüştürülür ve metinle birlikte aynı dikkat (attention) mekanizmasından geçer. Böylece model “bu grafikte hangi ay en yüksek?” gibi hem görmeyi hem okumayı gerektiren sorulara cevap verebilir.

## Küçük bir şema

Ortak uzay fikrini birkaç satır sözde-kodla görelim. Amaç: bir resmi en iyi anlatan metni bulmak.

```python
# Girdi: bir resim ve birkaç aday altyazi
resim_vektoru   = goruntu_kodlayici(resim)        # -> d boyutlu vektor
metin_vektorleri = [metin_kodlayici(t) for t in adaylar]  # -> d boyutlu vektorler

# Hepsini ayni "anlam uzayinda" karsilastiriyoruz
def kosinus(a, b):
    return dot(a, b) / (norm(a) * norm(b))   # -1 ile 1 arasi yakinlik

skorlar = [kosinus(resim_vektoru, v) for v in metin_vektorleri]
en_iyi  = adaylar[argmax(skorlar)]   # resme anlamca en yakin metin

print("Resmi en iyi anlatan:", en_iyi)
```

Dikkat edin: Resim ve metin _aynı_ `d` boyutlu uzaya yerleştiği için doğrudan karşılaştırılabiliyorlar. Sıfır görsel etiketle (yalnızca metin tarif ederek) sınıflandırma yapabilmenin sırrı budur — buna **sıfırdan örnekle (zero-shot)** sınıflandırma denir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Çok modlu modeller görüntü, metin ve sesi ayrı değil, ortak bir anlam uzayında birlikte işler.</li><li>Ortak embedding uzayı, farklı modaliteleri aynı vektör uzayına yerleştirip yakınlıkla karşılaştırır.</li><li>Vision-language modeller bir görüntü kodlayıcı, bir dil modeli ve onları birleştiren bir köprüden oluşur.</li><li>Karşıtsal öğrenme (eşleşeni yaklaştır, eşleşmeyeni uzaklaştır) bu hizalamanın en yaygın yoludur.</li></ul></div>

## Sesi de katmak

Aynı mantık sese de uzanır. Ses dalgası önce çoğunlukla bir **spektrograma** (zaman–frekans haritası) çevrilir; bu, sesi adeta bir “resme” dönüştürür. Sonra bir ses kodlayıcı bu temsili vektöre çevirir. Konuşma metne dökülecekse (otomatik konuşma tanıma) ses ile metin hizalanır; bir asistan hem sizi dinleyip hem ekrandaki görseli yorumlayacaksa üç modalite de aynı uzayda buluşur.

Önemli nokta şu: Tarif her modalitede aynıdır. Önce ham veriyi (piksel, token, dalga) bir kodlayıcıyla vektöre çevir, sonra hepsini ortak uzayda hizala. Modaliteyi değiştiren sadece kodlayıcıdır; “anlam dili” aynı kalır.

## Kullanım örnekleri

Bu yaklaşım soyut görünebilir, ama çıktıları çoktan günlük hayatın içinde:

-   **Görsel soru-cevap:** Bir fotoğraf yükleyip “Bu faturada toplam tutar ne?” diye sormak.
-   **Metinle görsel arama:** “Kar yağarken köprü” yazıp eşleşen fotoğrafları bulmak.
-   **Erişilebilirlik:** Görme engelliler için ekrandaki görselleri sesli olarak betimlemek.
-   **Belge anlama:** Tablo, grafik ve metni bir arada içeren PDF'leri okuyup özetlemek.
-   **İçerik denetimi:** Bir görselin yanındaki metinle birlikte uygunluğunu değerlendirmek.

Bu yeteneklerin bir ürüne, bir iş akışına dönüşmesi ise ayrı bir uzmanlık ister: doğru modeli seçmek, veriyi hazırlamak, güvenilirliği ölçmek. Yapay zekâyı gerçek işlere uygulama tarafını merak ediyorsanız [HatsonTech](/posts/hatsontech-nedir/)'e göz atabilirsiniz.

<div class="faq"><details><summary>Çok modlu model ile tek modlu model arasındaki fark nedir?</summary><p>Tek modlu model yalnızca tek tür girdiyle çalışır (sadece metin ya da sadece görüntü). Çok modlu model birden fazla modaliteyi aynı anda alır ve aralarındaki ilişkiyi kurar; örneğin bir resmi ona dair bir soruyla birlikte yorumlayabilir.</p></details><details><summary>Ortak embedding uzayı neden bu kadar önemli?</summary><p>Çünkü farklı modaliteleri doğrudan karşılaştırılabilir hale getirir. Resim ve metin aynı uzaya yerleştiğinde, “bu resim bu cümleye uyuyor mu?” sorusu basit bir yakınlık ölçümüne dönüşür ve sıfırdan örnekle (zero-shot) görevler mümkün olur.</p></details><details><summary>Ses, görüntü modelleriyle aynı şekilde mi işlenir?</summary><p>Mantık aynıdır ama kodlayıcı farklıdır. Ses çoğunlukla önce spektrograma çevrilir, sonra ona uygun bir kodlayıcıyla vektöre dönüştürülür. Ardından, tıpkı görüntü ve metinde olduğu gibi, ortak uzayda hizalanır.</p></details></div>

---

Özetle çok modlu modeller, insanın en doğal yeteneklerinden birini taklit eder: dünyayı tek bir pencereden değil, görüntü, metin ve sesin birlikte oluşturduğu bütünden anlamak. Bunu mümkün kılan fikir şaşırtıcı derecede sade — farklı kanalları ortak bir anlam uzayında buluşturmak — ama etkisi, asistanlardan aramaya kadar pek çok aracı bugün çok daha yetenekli kılıyor.
