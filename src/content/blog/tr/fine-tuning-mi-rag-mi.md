---
title: "Fine-tuning mi, RAG mi, Prompt mu? Hangisini Ne Zaman Kullanmalı"
description: "Fine-tuning, RAG ve prompt yaklaşımlarını maliyet, güncellik ve doğruluk açısından karşılaştırıyoruz. Hangisini ne zaman seçmeli? Pratik karar tablosu içerir."
publishDate: "2026-08-09T23:10:00+03:00"
lang: tr
category: "Karar"
tags: ["Karar", "Yapay Zeka"]
translation: "fine-tuning-vs-rag-vs-prompt"
heroImage:
  src: "../../../assets/blog/covers/fine-tuning-mi-rag-mi.jpg"
  alt: "Fine-tuning mi, RAG mi, Prompt mu? Hangisini Ne Zaman Kullanmalı"
---

Bir yapay zeka projesine başlarken en çok sorulan sorulardan biri şudur: “Modeli kendi verimizle eğitelim mi (fine-tuning), dışarıdan bilgi mi besleyelim (RAG), yoksa sadece iyi bir komut mu yazalım (prompt)?” Üçü de geçerlidir; ama yanlış olanı seçmek size aylar ve ciddi bir bütçe kaybettirebilir. Bu yazıda üç yaklaşımı günlük analojilerle, maliyet–güncellik–doğruluk ekseninde karşılaştırıyor ve sonunda hızlı bir karar tablosu veriyoruz.

## Üç yaklaşım, tek cümlede

Karmaşık görünen bu üç kavram aslında modele “bilgiyi ne zaman verdiğinizle” ilgilidir:

-   **Prompt (komut mühendisliği):** Modele _soruyu sorarken_ talimatı ve örnekleri siz verirsiniz. Modelin ağırlıklarına dokunmazsınız.
-   **RAG (Retrieval-Augmented Generation):** Model cevap üretmeden hemen önce, ilgili belgeleri bir veritabanından _çekip_ isteme ekler. Bilgi dışarıda, taze ve değiştirilebilir kalır.
-   **Fine-tuning (ince ayar):** Modeli kendi örnekleriniz üzerinde yeniden eğitirsiniz; bilgi ve davranış modelin _ağırlıklarına_ işler.

> Pratik kural: Prompt davranışı şekillendirir, RAG bilgiyi taze tutar, fine-tuning üslubu ve formatı kalıcı hâle getirir.

## Sınava giren öğrenci analojisi

Bir öğrenciyi sınava hazırladığınızı düşünün:

-   **Prompt**, sınav sorusunu net yazmak gibidir: “Cevabı üç maddede ve resmî bir dille ver.” Doğru yönlendirme çoğu zaman tek başına şaşırtıcı sonuç verir.
-   **RAG**, açık kitap sınavı gibidir: Öğrenci her şeyi ezberlemez; soruyla ilgili sayfayı açıp oradan okur. Kitap güncellenince cevap da güncellenir.
-   **Fine-tuning**, aylarca süren bir kurs gibidir: Öğrenci konuyu içselleştirir, refleks kazanır. Ama müfredat değişirse kursu tekrar almak gerekir.

<div class="callout"><strong>İpucu:</strong> Çoğu ekibin hatası, en pahalı yoldan (fine-tuning) başlamaktır. Önce prompt’u zorlayın, sonra RAG ekleyin; fine-tuning’i yalnızca ölçülebilir bir ihtiyaç ortaya çıkınca düşünün.</div>

## Maliyet açısından karşılaştırma

Maliyeti iki kalemde düşünmek gerekir: **kurulum (bir kerelik)** ve **çalıştırma (her istekte).**

-   **Prompt:** Kurulum maliyeti neredeyse sıfır. Tek dikkat edilmesi gereken, uzun talimatların her istekte token tükettiği ve istemi şişirebileceğidir.
-   **RAG:** Orta düzey kurulum: belgeleri parçalama (chunking), gömme (embedding) ve bir vektör veritabanı gerekir. Çalıştırmada her istek biraz daha uzar, çünkü çekilen belgeler isteme eklenir.
-   **Fine-tuning:** En yüksek kurulum maliyeti: kaliteli etiketli veri, eğitim süresi ve uzmanlık ister. Buna karşılık çalışma anında istemi kısaltabildiği için tekil istek maliyetini bazen düşürür.

## Güncellik açısından karşılaştırma

Bilginiz ne sıklıkla değişiyor? Bu soru genellikle kararı tek başına belirler.

-   **RAG burada açık ara önde:** Yeni bir belge eklemek, onu indekslemek kadar kolaydır; modeli yeniden eğitmenize gerek yoktur. Fiyat listeleri, mevzuat, ürün dokümanları gibi sık değişen içerikler için idealdir.
-   **Fine-tuning durağandır:** Modele işlediğiniz bilgi “dondurulur”. Bilgi değişince yeni bir eğitim turu gerekir, bu da gecikme ve maliyet demektir.
-   **Prompt** anlıktır ama bilgiyi siz isteme elle koyduğunuz sürece günceldir; büyük bilgi tabanları için ölçeklenmez.

## Doğruluk açısından karşılaştırma

Doğruluk tek bir şey değildir; “hangi tür doğruluk?” diye sormak gerekir.

-   **Olgusal doğruluk ve kaynak gösterme** için RAG güçlüdür: Cevaplar gerçek belgelere dayanır ve atıf verilebilir, bu da uydurma (halüsinasyon) riskini azaltır.
-   **Üslup, format ve alana özgü davranış** için fine-tuning güçlüdür: Modelin her seferinde tutarlı bir biçimde, doğru terminolojiyle cevap vermesini sağlar.
-   **Prompt** ile de yüksek doğruluk mümkündür, ama tutarlılık talimatın kalitesine bağlı kalır ve karmaşık görevlerde dalgalanabilir.

> Özetle: “Ne söylediği” genelde RAG’in, “nasıl söylediği” genelde fine-tuning’in işidir.

## Bir karar akışı (pseudocode)

Aşağıdaki basit sözde-kod, çoğu projede doğru sıralamayı yakalar:

```python
def yaklasim_sec(gorev):
    # 1. Adım: Önce en ucuz yolu dene
    if iyi_prompt_yeterli(gorev):
        return "Prompt"

    # 2. Adım: Bilgi dışarıda ve değişken mi?
    if harici_bilgi_gerek(gorev) or bilgi_sik_degisir(gorev):
        cozum = "RAG"
        # Üslup/format hâlâ tutarsızsa ekle
        if uslup_tutarsiz(gorev):
            cozum += " + Fine-tuning"
        return cozum

    # 3. Adım: Sabit, derin, üslup-yoğun davranış
    if buyuk_etiketli_veri_var(gorev) and uslup_kritik(gorev):
        return "Fine-tuning"

    return "Prompt"  # şüphedeyken en yalın çözüm
```

## Karar tablosu

Hızlı bir referans için:

-   **Bilgi sık değişiyor →** RAG
-   **Kaynak/atıf gerekiyor →** RAG
-   **Sınırlı bütçe, hızlı başlangıç →** Prompt
-   **Tutarlı üslup/format/terminoloji →** Fine-tuning
-   **Çok dar, tekrarlayan, sabit bir görev →** Fine-tuning
-   **Geniş, taze bir bilgi tabanı + tutarlı üslup →** RAG + Fine-tuning
-   **Belirsiz veya prototip aşaması →** Prompt (sonra RAG)

## İkisini birden kullanmak

Bu üçü rakip değil, katmandır. Olgun bir sistem genellikle hepsini bir arada kullanır: net bir **prompt** ile davranışı belirler, **RAG** ile cevabı güncel belgelere bağlar ve gerekiyorsa **fine-tuning** ile alanına özgü üslubu kalıcılaştırır. Örneğin hukuk gibi hem güncel hem de terminolojiye duyarlı bir alanda, RAG’in tazeliğiyle ince ayarın tutarlılığı birbirini tamamlar.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Prompt davranışı şekillendirir, RAG bilgiyi taze tutar, fine-tuning üslubu kalıcılaştırır.</li><li>En ucuzdan başlayın: önce prompt, sonra RAG, en son fine-tuning.</li><li>Bilgi sık değişiyorsa veya kaynak gerekiyorsa RAG neredeyse her zaman doğru seçimdir.</li><li>Fine-tuning bilgiyi değil, asıl olarak üslubu ve formatı öğretmek için güçlüdür.</li><li>Olgun sistemler üçünü birlikte kullanır; bunlar rakip değil katmandır.</li></ul></div>

<div class="faq"><details><summary>RAG kullanıyorsam fine-tuning’e hiç gerek kalmaz mı?</summary><p>Çoğu bilgi-yoğun senaryoda RAG tek başına yeterlidir. Fine-tuning’e asıl ihtiyaç, cevabın <em>içeriği</em> değil <em>biçimi</em> (üslup, format, terminoloji) tutarsız kaldığında ortaya çıkar.</p></details><details><summary>Fine-tuning modele yeni güncel bilgi öğretmez mi?</summary><p>Öğretebilir, ama bilgi “dondurulur”. İçerik değiştiğinde yeniden eğitim gerekir. Sık değişen bilgiyi taze tutmanın daha ucuz ve hızlı yolu RAG’dir.</p></details><details><summary>Küçük bir ekip için en mantıklı başlangıç hangisi?</summary><p>Neredeyse her zaman prompt ile başlayın; ölçülebilir bir sınıra çarpınca RAG ekleyin. Fine-tuning’i ancak net, tekrar eden bir ihtiyaç doğunca düşünün, çünkü en yüksek kurulum maliyetine ve uzmanlığa o ihtiyaç duyar.</p></details></div>

---

Doğru yaklaşım, projenizin sorununa göre değişir; çoğu zaman cevap “üçünden biri” değil, “doğru sırayla hepsi”dir. Bilgiyi gerçek belgelere bağlayan RAG mimarisini pratikte nasıl kurduğumuzu merak ediyorsanız, Türkçe yapay zeka ürünleri geliştiren [HatsonTech](/posts/hatsontech-nedir/)’in yaklaşımına göz atabilirsiniz.
