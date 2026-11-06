---
title: "Prompt Mühendisliği: Pratik Teknikler ve Gerçek Örnekler"
description: "Açık talimat, few-shot, adım adım düşündürme, rol verme ve çıktı biçimlendirme: dil modellerinden daha iyi sonuç almanın pratik tekniklerini örneklerle anlatıyoruz."
publishDate: "2026-08-09T23:11:00+03:00"
lang: tr
category: "Pratik"
tags: ["Pratik", "Yapay Zeka"]
translation: "prompt-engineering-techniques"
heroImage:
  src: "../../../assets/blog/covers/prompt-muhendisligi.jpg"
  alt: "Prompt Mühendisliği: Pratik Teknikler ve Gerçek Örnekler"
---

İyi bir komut (prompt), bir dil modeline ne istediğinizi açıkça söylediğiniz, onu doğru zihinsel çerçeveye yerleştirdiğiniz ve sonucu kullanılabilir bir biçimde geri istediğiniz andır. Prompt mühendisliği büyülü bir hile değil; daha çok iyi bir brief yazma sanatıdır. Bu yazıda günlük analojilerle beş pratik tekniği ele alıyoruz: açık talimat, örnekle öğretme, adım adım düşündürme, rol verme ve çıktı biçimlendirme.

## Prompt mühendisliği nedir?

Bir dil modeline yazdığınız metne _prompt_ diyoruz. Model, bu metni bir bağlam olarak alır ve en olası devamını üretir. Yani aslında bir cevap "aramaz", istatistiksel olarak en uygun metni _tahmin eder_. Bu basit gerçek, tekniklerin neden işe yaradığını açıklar: modele ne kadar iyi bir başlangıç verirseniz, devamı da o kadar isabetli olur.

Bunu yeni başlayan bir stajyere iş anlatmak gibi düşünün. Stajyer zekidir ve çok şey okumuştur, ama sizin kafanızdaki bağlamı bilmez. "Şunu hallet" derseniz tahmin yürütür; net bir brief verirseniz işi ilk seferde doğru yapar. Prompt mühendisliği, işte o brief'i yazma disiplinidir.

> Model okuyucunuzu okuyamaz. Aklınızdaki her kısıtı, her tercihi yazıya dökmeniz gerekir; aksi halde model boşlukları kendi varsayımlarıyla doldurur.

## Açık talimat: ne, kime, nasıl

En temel teknik, ne istediğinizi belirsizlik bırakmadan söylemektir. Zayıf bir prompt genellikle üç bilgiyi eksik bırakır: **görev** (ne yapılacak), **kitle** (kim için) ve **kısıtlar** (uzunluk, ton, dil, format).

-   **Belirsiz:** "Bana yapay zekayı anlat."
-   **Açık:** "Lise öğrencileri için yapay zekayı 150 kelimeyle, günlük bir analojiyle ve teknik jargon kullanmadan anlat."

İkinci prompt aynı modelden çok daha kullanışlı bir cevap çıkarır, çünkü hedefi, sınırı ve tonu baştan belirler. Bir de olumlu talimat verin: "madde kullanma" yerine "akıcı paragraflarla yaz" demek genellikle daha iyi sonuç verir, çünkü modele kaçınılacak şeyi değil, üretilecek şeyi gösterirsiniz.

<div class="callout"><strong>İpucu:</strong> Promptunuzu yüksek sesle bir meslektaşınıza okuyun. "Peki tam olarak ne istiyorsun?" diye sorma ihtiyacı duyarsa, model de aynı boşlukla karşı karşıyadır.</div>

## Örnekle öğretme (few-shot)

Bazen ne istediğinizi tarif etmek yerine _göstermek_ daha kolaydır. Prompt içine birkaç örnek giriş-çıktı çifti koymaya _few-shot_ denir; hiç örnek vermemeye _zero-shot_. Örnekler, modele istediğiniz biçimi ve üslubu sözcüklerle anlatmaktan daha net aktarır.

Bir aşçıya tarif okumak ile bir tabak yemeği gösterip "bunun gibi yap" demek arasındaki farktır bu. İkincisi çoğu zaman daha hızlı ve daha az hatalıdır.

```text
Görev: Müşteri yorumunu olumlu / olumsuz / nötr olarak etiketle.

Yorum: "Kargo çok hızlıydı, bayıldım."
Etiket: olumlu

Yorum: "Ürün açıklamadaki gibi değildi."
Etiket: olumsuz

Yorum: "Fiyatına göre idare eder."
Etiket: nötr

Yorum: "Kutusu ezikti ama içi sağlamdı."
Etiket:
```

Burada modele kuralı tarif etmedik; üç örnekle _gösterdik_. Model dördüncü satırı aynı biçimde tamamlayacaktır. Few-shot özellikle sınıflandırma, biçim dönüştürme ve tutarlı üslup gerektiren işlerde güçlüdür.

## Adım adım düşündürme

Çok adımlı akıl yürütme gereken sorularda, modelden doğrudan cevabı değil, önce düşünme sürecini istemek isabeti artırır. Bu yaklaşım genellikle _düşünce zinciri_ (chain-of-thought) olarak anılır; en bilinen tetikleyici cümle "adım adım düşünelim"dir.

Neden işe yarar? Model bir kelimeyi diğerinin üstüne tahmin ederek ilerler. Ona ara adımları yazma alanı verirseniz, her ara adım bir sonrakine sağlam bir zemin olur; tek hamlede sonuca atlamaya zorlandığında ise yanılma olasılığı artar. Bir matematik sınavında "sadece sonucu yaz" demekle "işlemleri göster" demek arasındaki farktır.

<div class="callout"><strong>İpucu:</strong> Nihai cevabın temiz görünmesini istiyorsanız, modelden önce adımları yazmasını, sonra cevabı belirgin bir etiketle (örneğin "Sonuç:") vermesini isteyin. Böylece düşünmeyi kaybetmeden temiz çıktıyı ayıklayabilirsiniz.</div>

Unutmayın: Adım adım düşündürme her işe gerekmez. Basit, tek adımlı bir soru için fazladan akıl yürütme istemek hem yavaşlatır hem de gereksiz uzunluk yaratır. Tekniği, gerçekten birden fazla adım gerektiren görevlere saklayın.

## Rol verme

Modele bir kimlik atamak, onu doğru bilgi ve üslup bölgesine yönlendirir. "Sen deneyimli bir editörsün" ya da "Sen titiz bir güvenlik denetçisisin" gibi bir cümle, cevabın odağını ve tonunu belirgin biçimde değiştirir.

Bir tiyatro yönetmeninin oyuncuya rol vermesi gibidir: "Sabırsız bir avukatı oynuyorsun" dediğinizde, oyuncunun her replikası o çerçeveye oturur. Modelde de rol, hangi kelimelerin "uygun" olduğuna dair beklentiyi şekillendirir.

-   **Rolsüz:** "Bu metni düzelt."
-   **Rollü:** "Sen titiz bir teknik editörsün. Bu metni anlamı bozmadan kısalt; jargonu sadeleştir ve her değişikliğin nedenini tek cümleyle açıkla."

Rol verme, açık talimatın yerine geçmez; onu güçlendirir. En iyi sonucu rol ile net görevi birlikte kullandığınızda alırsınız.

## Çıktı biçimlendirme

Cevabı bir program işleyecekse ya da belli bir kalıba ihtiyacınız varsa, istediğiniz biçimi açıkça tarif edin. "JSON döndür", "yalnızca bir tablo ver", "her madde en fazla bir cümle" gibi kısıtlar, çıktıyı tahmin edilebilir kılar.

En güvenilir yöntem, istediğiniz biçimin _iskeletini_ göstermektir:

```text
Çıktıyı tam olarak şu JSON şemasında ver, başka metin ekleme:

{
  "baslik": "...",
  "ozet": "... (en fazla 20 kelime)",
  "etiketler": ["...", "..."]
}
```

İskeleti vermek, biçimi kelimelerle tarif etmekten çok daha az hataya yol açar. Ayrıca "başka metin ekleme" gibi bir sınır koymak, modelin cevabı gereksiz açıklamalarla sarmasını engeller; bu, çıktıyı doğrudan bir koda besleyecekseniz kritiktir.

## Hepsini birleştiren bir örnek

Bu teknikler birlikte kullanıldığında en iyi sonucu verir. Aşağıdaki prompt; rol, açık talimat, bir örnek ve kesin bir çıktı biçimini tek bir brief'te toplar:

```text
Sen deneyimli bir müşteri destek analistisin.        # rol
Görevin: Gelen e-postayı aciliyetine göre sınıflandır. # açık talimat

Örnek:                                                # few-shot
E-posta: "Hesabıma giremiyorum, sunum 1 saat sonra."
{"aciliyet": "yuksek", "neden": "zaman baskisi var"}

Şimdi şu e-postayı aynı JSON biçiminde değerlendir,   # çıktı biçimi
başka metin ekleme:
E-posta: "Faturamda küçük bir yazım hatası var."
```

Görüldüğü gibi prompt mühendisliği gizli komutlar ezberlemek değil; modele ne istediğinizi, hangi rolde, hangi örneklerle ve hangi biçimde istediğinizi net biçimde iletmektir. Bu disiplini bir kez edindiğinizde, aynı modelden çok daha tutarlı ve kullanışlı sonuçlar alırsınız.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Görevi, kitleyi ve kısıtları açıkça yazın; model aklınızı okuyamaz.</li><li>Tarif etmek zorsa örnek verin: few-shot, biçimi ve üslubu sözcüklerden daha net aktarır.</li><li>Çok adımlı sorularda "adım adım düşün" demek isabeti artırır; basit sorularda gereksizdir.</li><li>Rol vermek tonu ve odağı şekillendirir, ama açık talimatın yerini tutmaz.</li><li>Çıktı biçimini iskeletle gösterin ve "başka metin ekleme" gibi sınırlar koyun.</li></ul></div>

<div class="faq"><details><summary>Prompt mühendisliği gerçek bir beceri mi, yoksa geçici bir moda mı?</summary><p>Modeller geliştikçe bazı küçük hileler önemini yitiriyor; ancak ne istediğinizi açık, yapılandırılmış ve örnekli biçimde anlatma becerisi kalıcıdır. Bu, aslında iyi iletişim ve iyi brief yazma becerisidir.</p></details><details><summary>Her zaman örnek vermeli miyim?</summary><p>Hayır. Basit ve genel görevlerde örnek vermeden (zero-shot) de iyi sonuç alabilirsiniz. Örnekler özellikle belirli bir biçim, tutarlı üslup veya ince ayrım gerektiren işlerde fark yaratır.</p></details><details><summary>Daha uzun prompt her zaman daha iyi midir?</summary><p>Hayır. Önemli olan uzunluk değil, netliktir. Gereksiz ayrıntı modeli yanıltabilir. Hedef, ilgili tüm kısıtları içeren ama dağılmayan bir brief yazmaktır.</p></details></div>

---

Prompt mühendisliği, bir dil modeliyle kurduğunuz iletişimin kalitesini doğrudan belirler. Bu teknikleri kendi işlerinizde denedikçe, hangi durumda hangisinin gerektiğine dair bir sezgi geliştireceksiniz. Yapay zekayı günlük iş akışlarına oturtma üzerine daha fazlası için [HatsonTech](/posts/hatsontech-nedir/) sayfamıza göz atabilirsiniz.
