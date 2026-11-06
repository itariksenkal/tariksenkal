---
title: "Token ve Embedding: Bir Dil Modeli Metni Nasıl \"Görür\"?"
description: "Tokenizasyon, kelime parçaları ve embedding vektörleri sezgisel anlatımla: metnin anlamı bir dil modelinin içinde nasıl sayıya ve koordinata dönüşür?"
publishDate: "2026-08-09T23:14:00+03:00"
lang: tr
category: "Temeller"
tags: ["Temeller", "Yapay Zeka"]
translation: "tokens-embeddings"
heroImage:
  src: "../../../assets/blog/bimg-12.jpg"
  alt: "Token ve Embedding: Bir Dil Modeli Metni Nasıl \"Görür\"?"
---

Bir dil modeli aslında harfleri, kelimeleri ya da cümleleri "okumaz". O, yalnızca sayılarla çalışır. Peki "Merhaba dünya" gibi bir metin, bir yapay zekânın içinde nasıl sayıya dönüşür? İşte bu yolculuğun iki durağı var: **tokenizasyon** ve **embedding**. Bu yazıda, metnin anlamının nasıl matematiğe çevrildiğini günlük analojilerle, baştan sona anlatıyoruz.

## Model neden metni doğrudan okuyamaz?

Bir sinir ağı, özünde devasa bir çarpma-toplama makinesidir. Girdi olarak yalnızca sayı kabul eder, çıktı olarak yalnızca sayı üretir. Dolayısıyla "kedi" kelimesini modele veremezsiniz; önce onu modelin anlayacağı sayılara çevirmeniz gerekir.

Bunu, yabancı bir ülkede telefonunuzun çeviri uygulamasını kullanmaya benzetebilirsiniz: Karşınızdaki kişi konuşur, uygulama bunu sizin dilinize çevirir. Dil modeli için de bir "çeviri katmanı" gerekir; bu katman metni sayıya, sayıyı tekrar metne çevirir. Bu yazının konusu, o ilk çevirinin nasıl yapıldığıdır.

> "Bir dil modeli için her şey sayıdır. Metnin sanatı, anlamı kaybetmeden onu sayıya çevirebilmektir."

## Tokenizasyon: metni parçalara ayırmak

İlk adım **tokenizasyon**: metni "token" denilen küçük parçalara bölmek. Bir token bazen tam bir kelime, bazen kelimenin bir parçası, bazen de yalnızca bir noktalama işareti olabilir. Her token'a, modelin sözlüğündeki sırasına karşılık gelen bir sayı (kimlik, yani _ID_) atanır.

Kabaca şöyle düşünün: Modelin elinde, içinde on binlerce parça bulunan dev bir sözlük var. Tokenizasyon, cümlenizi bu sözlükteki parçalara eşleyip her birinin sıra numarasını yazmaktır.

```text
Metin:   "Embedding harika!"

Token'lar:   ["Embed", "ding", " harika", "!"]
Token ID'leri:   [ 51234,  3210,    98765,   0 ]

# Model artık "Embedding harika!" cümlesini
# [51234, 3210, 98765, 0] dizisi olarak "görür".
```

Yukarıdaki ID'ler temsilîdir; gerçek değerler kullanılan tokenizer'a göre değişir. Önemli olan fikir: Metin, bir sayı dizisine indirgenir. Bu noktada modelin elinde hâlâ "anlam" yoktur; sadece "Embedding cümlesindeki ilk parça 51234 numaralı parçadır" bilgisi vardır.

## Neden kelime değil de "kelime parçaları"?

Akla şu soru gelir: Neden her kelimeye tek bir sayı vermiyoruz? Çünkü dünyadaki tüm kelimeleri bir sözlüğe sığdırmak imkânsız. Yeni kelimeler, yazım hataları, isimler, başka diller... Sözlük sonsuza kadar büyür. Üstelik "kitap", "kitaplar", "kitaplık" gibi akraba kelimeler arasındaki bağı tamamen kaybederdik.

Çözüm, **alt-kelime (subword)** tokenizasyonudur. En sık geçen parçalar sözlükte kalır; nadir kelimeler ise daha küçük, bilinen parçalara bölünür. Bu yaklaşıma Byte Pair Encoding (BPE) gibi yöntemler örnek verilebilir.

-   **Sık kelimeler** genellikle tek token olur: "ev", "gel", "ve".
-   **Nadir veya uzun kelimeler** parçalara ayrılır: "tokenizasyon" → "token" + "izasyon" gibi.
-   **Hiç görülmemiş kelime** bile harf/parça düzeyinde temsil edilebilir; yani model asla "bu kelimeyi bilmiyorum" deyip durmaz.

<div class="callout"><strong>İpucu:</strong> Türkçe gibi ekleri bol diller, İngilizceye göre daha fazla token üretmeye eğilimlidir. Aynı anlamdaki bir cümle Türkçede daha çok token tutabilir; bu da maliyeti ve hız bütçesini doğrudan etkiler.</div>

## Token'dan vektöre: embedding

Token ID'leri tek başına anlamsızdır. 51234 sayısı, 51233'ten "bir fazla" olduğu için onunla akraba değildir. Asıl sihir burada başlar: Her token ID'si, bir **embedding vektörüne** çevrilir. Vektör, basitçe bir sayı listesidir; örneğin 768 ya da 1024 sayıdan oluşabilir.

Bunu bir "anlam koordinatı" gibi düşünün. Bir şehri nasıl enlem ve boylamla iki sayıyla konumlandırıyorsak, model de her token'ı yüzlerce boyutlu bir uzayda bir noktayla konumlandırır. Bu koordinatlar rastgele değildir; model, eğitim sırasında "hangi kelimeler benzer bağlamlarda geçiyor?" sorusuna bakarak onları öğrenir.

```text
"kral"   -> [ 0.21, -0.47,  0.88, ... ]   (768 sayı)
"kraliçe" -> [ 0.19, -0.51,  0.83, ... ]
"muz"    -> [-0.62,  0.10, -0.05, ... ]

# "kral" ile "kraliçe" vektörleri birbirine yakın;
# "muz" ise çok uzak bir bölgede.
```

Sonuç olarak metnin yolculuğu şudur: _metin → token'lar → token ID'leri → embedding vektörleri_. Modelin asıl düşündüğü yer, bu son adımdan itibaren başlar.

## Anlam neden "yön"dür?

Embedding uzayının en güzel yanı, anlamların geometriye dönüşmesidir. Benzer anlamlı kelimeler birbirine yakın oturur; farklı anlamdakiler uzaklaşır. İki vektörün ne kadar "aynı yöne baktığını" ölçmek için genellikle **kosinüs benzerliği** kullanılır.

Klasik örnek şudur: "kral" vektöründen "erkek" yönünü çıkarıp "kadın" yönünü eklediğinizde, vardığınız nokta şaşırtıcı biçimde "kraliçe" vektörüne yakın çıkar. Yani anlam ilişkileri, uzaydaki yönlere karşılık gelir. Bu, embedding'lerin "kelimeleri ezberlemek" değil, "kelimeler arasındaki ilişkileri öğrenmek" anlamına geldiğinin en somut kanıtıdır.

> "Embedding uzayında yakınlık, anlamca yakınlıktır. Mesafe, anlamı görünür kılan harita olur."

Burada önemli bir incelik var: Modern dil modellerinde bir kelimenin vektörü sabit değildir; **bağlama göre** değişir. "Yüz" kelimesi "yüzüne baktı" cümlesinde ile "yüze ulaştı" cümlesinde farklı bir noktaya yerleşir. Modelin katmanları, ilk embedding'i cümlenin geri kalanına göre yeniden şekillendirir.

## Pratikte ne işimize yarar?

Bu kavramlar yalnızca teorik değildir; gündelik birçok yapay zekâ uygulamasının temelidir:

-   **Anlamsal arama:** Sorgunuzu ve belgeleri embedding'e çevirip en yakın vektörleri bulmak, anahtar kelime aramasından çok daha akıllıdır.
-   **Öneri ve gruplama:** Benzer içerikleri vektör yakınlığına göre kümelemek mümkün olur.
-   **RAG (belgeye dayalı yanıt):** Model, soruya en alakalı metin parçalarını embedding benzerliğiyle bulup yanıtı bunlara dayandırır.

Bu nedenle tokenizasyon ve embedding, modern yapay zekânın görünmeyen ama olmazsa olmaz iki dişlisidir. Türkçe metinleri doğru tokenize etmek ve anlamını iyi yakalayan embedding'ler üretmek, biz [HatsonTech](/posts/hatsontech-nedir/) olarak üzerinde çalıştığımız konuların tam kalbinde yer alır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Dil modelleri metni değil, yalnızca sayıyı işler; metin önce sayıya çevrilir.</li><li>Tokenizasyon, metni "token" parçalarına bölüp her birine bir ID atar.</li><li>Alt-kelime yaklaşımı, sınırsız sözlük sorununu çözer ve nadir kelimeleri de temsil eder.</li><li>Embedding, her token'ı yüzlerce boyutlu bir anlam koordinatına (vektöre) çevirir.</li><li>Anlamca yakın kelimeler uzayda birbirine yakın oturur; ilişkiler yönlere karşılık gelir.</li><li>Bu iki adım; anlamsal arama, öneri ve RAG gibi uygulamaların temelidir.</li></ul></div>

<div class="faq"><details><summary>Token ile kelime aynı şey mi?</summary><p>Hayır. Bir token bazen tam bir kelime, bazen kelimenin bir parçası, bazen de yalnızca bir noktalama işareti olabilir. Sık kelimeler genellikle tek token olurken, nadir veya uzun kelimeler birden çok token'a bölünür.</p></details><details><summary>Embedding vektörünün boyutu neden yüzlerce sayıdan oluşur?</summary><p>Anlamın çok yönlü olması nedeniyle. Tek bir sayı, bir kelimenin yalnızca tek bir özelliğini taşıyabilir. Yüzlerce boyut, modele aynı anda pek çok anlam inceliğini (konu, duygu, dil bilgisi, çağrışım) kodlama imkânı verir.</p></details><details><summary>Aynı kelimenin embedding'i her zaman aynı mıdır?</summary><p>Başlangıç (sözlük) embedding'i aynıdır, ancak modern modellerde nihai temsil bağlama göre değişir. "Yüz" kelimesi geçtiği cümleye göre farklı bir vektöre yerleşebilir; modelin katmanları temsili cümlenin geri kalanına göre yeniden şekillendirir.</p></details></div>

---

Özetle: Bir dil modeli metni "okumaz", onu sayıya çevirip anlamını bir uzayda konumlandırır. Tokenizasyon metni parçalara böler, embedding ise bu parçalara anlam koordinatı verir. Bu sessiz iki adım olmadan bugünkü yapay zekânın hiçbir cümlesi mümkün olmazdı.
