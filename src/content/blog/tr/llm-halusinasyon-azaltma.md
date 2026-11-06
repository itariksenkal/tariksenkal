---
title: "LLM Halüsinasyonları: Neden Olur ve Nasıl Azaltılır?"
description: "LLM halüsinasyonu neden olur ve nasıl azaltılır? Kaynağa demirleme (grounding), RAG, doğrulama, kendini kontrol ve temperature ayarıyla pratik önlemler."
publishDate: "2026-08-09T23:09:00+03:00"
lang: tr
category: "Güvenilirlik"
tags: ["Güvenilirlik", "Yapay Zeka"]
translation: "reducing-llm-hallucinations"
heroImage:
  src: "../../../assets/blog/covers/llm-halusinasyon-azaltma.jpg"
  alt: "LLM Halüsinasyonları: Neden Olur ve Nasıl Azaltılır?"
---

Büyük dil modelleri bazen, hiç tereddüt etmeden, son derece kendinden emin bir tonla yanlış bir cevap üretir. Buna "halüsinasyon" diyoruz ve bu, modelin bozuk olmasından değil, tam olarak tasarlandığı gibi çalışmasından kaynaklanır. Peki bu kaçınılmaz mı? Hayır. Doğru önlemlerle halüsinasyonu sıfırlayamasak bile büyük ölçüde dizginleyebiliriz. Bu yazıda nedenini sezgisel olarak anlatıp, pratik bir azaltma kemeri kuracağız.

## Halüsinasyon nedir, neden olur?

Bir büyük dil modeli (LLM) bir "gerçek deposu" değildir. Devasa metin yığınlarından öğrendiği örüntülere bakarak _bir sonraki kelimenin ne olması gerektiğini_ tahmin eden istatistiksel bir motordur. Telefon klavyenizdeki kelime tahminini düşünün: "Bugün hava çok…" yazdığınızda "güzel", "sıcak" önerir. LLM aynı işi yapar; ama milyonlarca belge okuduğu için tahminleri o kadar isabetli olur ki akıcı paragraflar, kod, hatta şiir üretebilir.

İşte sorun da burada: modelin hedefi "doğruyu söylemek" değil, "akla yatkın görünen bir sonraki kelimeyi üretmek"tir. Ona var olmayan bir kaynak sorduğunuzda, gerçek bir kaynağı hatırlamaz; sadece "gerçek bir kaynağın nasıl görünmesi gerektiğini" üretir. Sonuç: gerçekte olmayan ama inandırıcı duran içerik.

> Halüsinasyonun tehlikesi modelin yanılmasında değil; yanıldığını gizleyecek kadar akıcı ve kendinden emin olmasındadır.

Bunu somutlaştıran gerçek bir olay var: 2023'te ABD'de görülen **Mata v. Avianca** davasında avukatlar, bir dilekçeyi hazırlarken ChatGPT'nin ürettiği altı emsal karara atıf yaptı. Kararların hiçbiri gerçek değildi; altısı da tamamen uydurmaydı. Mahkeme avukatlara para cezası verdi. Ders açık: hata yapay zekayı kullanmak değil, çıktısını hiç doğrulamadan kabul etmekti.

Halüsinasyonu besleyen başlıca etkenler şunlardır:

-   **Bilgi boşluğu:** Modelin eğitim verisinde olmayan ya da çok seyrek geçen bir konu sorulduğunda model "boşluğu doldurmaya" eğilimlidir.
-   **Güncellik sınırı:** Modelin bilgisi belirli bir tarihte donar; sonrasını "tahmin eder".
-   **Belirsiz veya çelişkili soru:** Net olmayan bir istem, modeli varsayım yapmaya iter.
-   **Aşırı yardımseverlik:** Model "bilmiyorum" demek yerine bir cevap üretmeye eğilimli hâle getirilmiş olabilir.

## Kaynağa demirleme (grounding) ve RAG

En etkili tek önlem, modeli kendi "hafızasıyla" baş başa bırakmamaktır. Bir öğrenciyi düşünün: kapalı kitap sınavında ezberinden uydurabilir; ama açık kitap sınavında cevabını önündeki metne dayandırmak zorundadır. Kaynağa demirleme tam da bunu yapar.

Bunun en yaygın yöntemi **RAG**'dir (Retrieval-Augmented Generation — Getirmeyle Güçlendirilmiş Üretim). Mantığı basittir: model cevabı doğrudan belleğinden yazmaz. Önce güvenilir bir kaynaktan (belge tabanı, dokümantasyon, kullanıcının yüklediği dosya) ilgili metni _getirir_, sonra cevabını bu metne _demirleyerek_ üretir.

```text
// Basit RAG akışı (sözde kod)
soru = kullanici_girdisi()

// 1) GETİR: soruya en yakın belgeleri bul
parcalar = vektör_db.ara(göm(soru), ust_k=5)

// 2) DEMİRLE: yalnızca bu parçaları bağlam olarak ver
istem = """
Aşağıdaki KAYNAK metnine dayanarak cevap ver.
Cevap kaynakta yoksa "Kaynakta bulunamadı" de.
Her iddianın yanına [parça-no] olarak atıf ekle.

KAYNAK:
{parcalar}

SORU: {soru}
"""

// 3) ÜRET + ATIF
cevap = llm(istem, temperature=0.2)
```

Üç kritik ayrıntıya dikkat: (1) Modele "kaynakta yoksa uydurma, 'bulunamadı' de" talimatı verin. (2) Atıf isteyin; izlenebilir cevap doğrulanabilir cevaptır. (3) Getirme adımının kendisi isabetli olmalı — yanlış belge getirilirse, üzerine kurulan cevap da yanlış olur. RAG halüsinasyonu büyük ölçüde azaltır ama sıfırlamaz; bu yüzden tek katman değil, savunma katmanlarından biridir.

<div class="callout"><strong>İpucu:</strong> RAG'de "getirme" kalitesi, "üretme" kalitesinden daha belirleyicidir. Önce arama/embedding katmanınızı ölçün; modeli suçlamadan önce ona doğru belgeyi verdiğinizden emin olun.</div>

## Sıcaklık (temperature) ve çözümleme ayarları

**Temperature**, modelin bir sonraki kelimeyi seçerken ne kadar "yaratıcı" davranacağını belirleyen bir ayardır. Düşük değer (örn. 0–0.3) modeli en olası, en güvenli seçeneğe yönlendirir; yüksek değer (örn. 0.8–1.2) çeşitliliği ve sürprizi artırır.

Bunu bir aşçının tuz eline benzetebiliriz: az tuz tutarlı ve öngörülebilir bir tat verir; çok tuz bazen muhteşem bazen felaket sonuç doğurur. Olgusal doğruluk istediğiniz görevlerde (özetleme, soru-cevap, veri çıkarımı) **düşük** temperature kullanın. Beyin fırtınası, reklam metni, yaratıcı yazım gibi görevlerde yüksek değer mantıklıdır.

-   **Olgusal/teknik cevaplar:** temperature ≈ 0.0–0.3
-   **Dengeli sohbet:** ≈ 0.4–0.7
-   **Yaratıcı üretim:** ≈ 0.8–1.2

Önemli bir uyarı: düşük temperature halüsinasyonu _azaltır ama yok etmez_. Model emin bir tonla yanlış bir bilgiyi "en olası" sayıyorsa, sıcaklığı düşürmek o yanlışı daha kararlı biçimde tekrar ettirir. Yani temperature tek başına bir çözüm değil, demirlemeyi tamamlayan bir ayardır.

## Doğrulama ve kendini kontrol

İnsanlar da ilk taslakta hata yapar; farkımız, yazdığımızı bir kez daha okumamızdır. Modele de aynı disiplini uygulayabiliriz.

-   **Kendini kontrol (self-check):** Modelden, ürettiği cevabı kaynağa karşı bir kez daha denetlemesini ve desteklenmeyen iddiaları işaretlemesini isteyin.
-   **Çapraz doğrulama:** Aynı soruyu birkaç kez (veya farklı modellere) sorun; cevaplar tutarsızsa bu bir "düşük güven" sinyalidir.
-   **Programatik doğrulama:** Çıktının biçimini ve gerçekliğini kodla denetleyin — örneğin verilen URL'in açılıp açılmadığını, atıf numarasının kaynakta gerçekten geçip geçmediğini.
-   **İnsan denetimi:** Yüksek riskli alanlarda (hukuk, sağlık, finans) son onay her zaman bir uzmandadır. Yapay zeka taslağı hızlandırır; sorumluluğu devralmaz.

```python
// Atıfların gerçekliğini koda dökerek denetleyin
for iddia in cevap.iddialar:
    if iddia.atif not in kaynak_metin:
        isaretle(iddia, "Kaynakta doğrulanamadı")
        # kullanıcıya göster veya cevabı reddet
```

> Doğrulamayı modelin iyi niyetine bırakmayın. Doğrulanabilir olanı kodla doğrulayın; yalnızca yargı gerektireni insana bırakın.

## Prompt ve sistem tasarımı

Çoğu halüsinasyon, kötü modelden değil, belirsiz istemden doğar. İstemi netleştirmek tek başına büyük fark yaratır:

-   **Bilmeme iznini açıkça verin:** "Emin değilsen 'bilmiyorum' de" cümlesi, modelin uydurma baskısını azaltır.
-   **Kapsamı daraltın:** "Yalnızca verilen metne dayan", "tarih aralığını şu yapma" gibi sınırlar varsayımları keser.
-   **Adım adım düşünme isteyin:** Karmaşık görevlerde önce muhakeme, sonra sonuç istemek tutarlılığı artırır.
-   **Çıktı biçimini sabitleyin:** Yapısal (JSON, tablo) çıktı, hem doğrulamayı kolaylaştırır hem serbest uydurmayı azaltır.

Kaynağa demirlenmiş, doğrulanabilir ve insan denetiminden geçen bir mimari kurmak istiyorsanız, bu yaklaşımı pratikte nasıl uyguladığımızı [HatsonTech](/posts/hatsontech-nedir/) sayfamızda anlatıyoruz.

## Pratik kontrol listesi

1.  Olgusal görevde **RAG** kullan; cevabı kaynağa demirle ve atıf iste.
2.  **Temperature**'ı göreve göre seç; doğruluk istiyorsan düşük tut.
3.  İsteme **"bilmiyorsan söyle"** iznini ekle.
4.  Atıf ve biçimi **kodla doğrula**; serbest metni denetlenebilir hâle getir.
5.  Tutarsızlık testi için cevabı **çapraz doğrula**.
6.  Yüksek riskte **insan onayını** akışa zorunlu kıl.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Halüsinasyon bir arıza değil, "bir sonraki kelimeyi tahmin etme" tasarımının doğal sonucudur.</li><li>En güçlü tek önlem kaynağa demirlemedir (RAG); model "hatırlamak" yerine "okuyup atıf vermek" zorunda kalır.</li><li>Düşük temperature doğruluğu artırır ama halüsinasyonu tek başına bitirmez.</li><li>Doğrulanabilir olanı kodla, yargı gerektireni insanla denetleyin.</li><li>Güvenlik tek katmanda değil, üst üste binen savunma katmanlarındadır.</li></ul></div>

<div class="faq"><details><summary>Halüsinasyon tamamen önlenebilir mi?</summary><p>Tamamen sıfırlanamaz; çünkü model olasılıkçı bir tahmin motorudur. Ancak RAG, düşük temperature, doğrulama ve insan denetimi birlikte kullanıldığında oran pratik olarak kabul edilebilir bir düzeye iner.</p></details><details><summary>RAG kullanırsam temperature'ı sıfırlamalı mıyım?</summary><p>Şart değil, ama olgusal görevlerde düşük (0–0.3) tutmak mantıklıdır. RAG kaynağı sağlar, düşük temperature ise modelin o kaynaktan sapma eğilimini azaltır. İkisi birbirini tamamlar.</p></details><details><summary>Modelin "bilmiyorum" demesini nasıl sağlarım?</summary><p>İsteme açıkça bu izni ekleyin ("Kaynakta yoksa 'bulunamadı' de"), kapsamı daraltın ve atıf zorunluluğu getirin. Atıfı olmayan iddiayı kodla reddetmek, modeli dürüst davranmaya yöneltir.</p></details></div>

---

Özetle: halüsinasyon, akıcılığın bedelidir; ama kaderimiz değildir. Modeli gerçeğe demirleyip cevaplarını doğrulanabilir kıldığınızda, yapay zeka "kendinden emin bir uydurma makinesi" olmaktan çıkıp güvenilir bir yardımcıya dönüşür. Anahtar tek bir sihirli düğme değil; üst üste binen küçük, disiplinli önlemlerdir.
