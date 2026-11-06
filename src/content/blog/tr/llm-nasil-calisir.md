---
title: "Büyük Dil Modelleri (LLM) Nasıl Çalışır? Transformer Mimarisinin Sezgisel Anlatımı"
description: "LLM'ler nasıl çalışır? Bir sonraki kelimeyi tahmin etme, dikkat (attention) ve katmanlar üzerinden Transformer mimarisini sezgisel, teknik ama anlaşılır anlatıyoruz."
publishDate: "2026-08-09T23:15:00+03:00"
lang: tr
category: "LLM"
tags: ["LLM", "Yapay Zeka"]
translation: "how-llms-work"
heroImage:
  src: "../../../assets/blog/covers/llm-nasil-calisir.jpg"
  alt: "Büyük Dil Modelleri (LLM) Nasıl Çalışır? Transformer Mimarisinin Sezgisel Anlatımı"
---

Bir sohbet robotuna soru sorduğunuzda, perde arkasında aslında tek bir basit oyun oynanıyor: "sıradaki kelime ne olmalı?" Büyük dil modelleri (LLM) bu küçük tahmini milyarlarca kez, akıl almaz bir ustalıkla yapar. Peki bir sonraki kelimeyi tahmin eden bir makine nasıl olur da kod yazar, şiir kurar, bir fikri özetler? Bu yazıda Transformer mimarisini günlük analojilerle, teknik ama anlaşılır bir dille açıyoruz.

## 1\. Her şey "sıradaki kelime" oyunu

Telefonunuzun klavyesini düşünün. "Bugün hava çok…" yazdığınızda size "güzel", "sıcak", "soğuk" gibi öneriler sunar. Büyük dil modelleri özünde aynı işi yapar: önlerindeki metne bakıp bir sonraki kelime için en olası adayı seçer. Fark, ölçekte. Bir LLM, milyonlarca kitabı, makaleyi ve web sayfasını "okuyarak" eğitilir; bu yüzden tahminleri o kadar isabetli hale gelir ki akıcı paragraflar, çalışan kodlar, hatta tutarlı argümanlar üretebilir.

Model bir cümleyi tek seferde "düşünüp" yazmaz. Kelime kelime ilerler: ürettiği her yeni kelimeyi metnin sonuna ekler, sonra tüm metne yeniden bakıp bir sonrakini tahmin eder. Bu döngüye **otoregresif üretim** denir.

> Bir LLM, "doğruyu söylemek" için değil, "bir sonraki kelimeyi olabildiğince iyi tahmin etmek" için eğitilmiş devasa bir örüntü makinesidir.

## 2\. Kelimeyi sayıya çevirmek: token ve gömme

Bilgisayarlar harflerle değil sayılarla çalışır. Bu yüzden ilk adım metni parçalara ayırmaktır. Bu parçalara **token** denir. Bir token bazen tam bir kelimedir ("ev"), bazen bir kelime parçasıdır ("ev" + "ler" + "imiz"). Model her token'ı bir kimlik numarasına çevirir.

Ardından her token, **gömme (embedding)** adı verilen bir sayı listesine (vektöre) dönüştürülür. Bunu anlamların haritası gibi düşünün: birbirine yakın anlamlı kelimeler bu haritada birbirine yakın noktalarda durur. "Kral" ile "kraliçe", "Ankara" ile "İstanbul" haritada komşudur. Bu sayede model kelimeleri salt etiket olarak değil, ilişkili kavramlar olarak işler.

<div class="callout"><strong>İpucu:</strong> Token sayısı, hem maliyeti hem de modelin "hafızasını" (bağlam penceresi) belirler. Uzun bir belgeyi modele verirken token sayısını dert etmenizin sebebi budur: model aynı anda yalnızca sınırlı sayıda token'a bakabilir.</div>

## 3\. Dikkat (attention): bağlama bakmak

Transformer mimarisinin kalbi **dikkat (attention)** mekanizmasıdır. Şu cümleyi düşünün:

> "Çanta masanın üstündeydi çünkü _o_ çok ağırdı."

"O" kelimesi neye işaret ediyor? Çantaya mı, masaya mı? Bir insan bağlamdan anlar: ağır olan çantadır. Dikkat mekanizması da tam olarak bunu yapar. Her kelimeyi işlerken, cümledeki diğer tüm kelimelere "ne kadar ilgiliyim?" diye sorar ve en alakalı olanlara daha fazla ağırlık verir.

Bunu bir toplantıya benzetebiliriz: bir kelimeyi anlamak için diğer tüm kelimelere kulak verirsiniz, ama yalnızca konuyla ilgili olanları dikkate alır, gerisini arka plana atarsınız. Model her kelime için üç şey üretir: bir **sorgu** (neyi arıyorum?), bir **anahtar** (ben neyim?) ve bir **değer** (ne taşıyorum?). Sorgu ile anahtarlar eşleştirilir; uyum ne kadar yüksekse o kelimenin değeri o kadar baskın olur.

Üstelik bu işlem tek bir kez değil, paralel birçok "dikkat başlığında" (multi-head attention) aynı anda yapılır. Bir başlık dilbilgisel ilişkilere, bir diğeri konu bütünlüğüne, bir başkası zamansal sıraya odaklanabilir. Aşağıdaki sözde-kod (pseudocode) tek bir dikkat hesabının özünü gösterir:

```python
def attention(query, key, value):
    # 1) Her sorguyu tüm anahtarlarla eşleştir -> benzerlik skorları
    scores = query @ key.transpose()        # iç çarpım
    scores = scores / sqrt(key.dim)          # ölçekleme (stabilite)

    # 2) Skorları olasılığa çevir (toplamı 1)
    weights = softmax(scores)                # hangi kelimeye ne kadar bak

    # 3) Değerleri bu ağırlıklarla harmanla
    return weights @ value                   # bağlamla zenginleşmiş çıktı
```

Dikkat mekanizmasının devrimsel yanı, kelimeleri tek tek sırayla değil, hepsini aynı anda ele alabilmesidir. Bu paralellik, modern modellerin neden bu kadar büyük ve hızlı eğitilebildiğinin temel sebebidir.

## 4\. Katmanlar: kavrayışı derinleştirmek

Tek bir dikkat hesabı tek başına yeterli değildir. Transformer, bu dikkat bloklarını üst üste **katmanlar (layers)** halinde yığar. Her katman, bir önceki katmanın çıktısını alıp biraz daha rafine eder.

Bunu bir fabrika montaj hattı gibi düşünün:

-   **İlk katmanlar** daha yüzeysel örüntüleri yakalar: kelime türleri, basit ilişkiler.
-   **Orta katmanlar** cümle yapısını, özne-yüklem ilişkilerini, bağlamı kavramaya başlar.
-   **Üst katmanlar** daha soyut anlamları işler: niyet, ton, mantıksal akış.

Her dikkat katmanının ardından küçük bir **ileri-besleme ağı (feed-forward)** gelir; bu, dikkatten gelen bilgiyi her token için ayrı ayrı işleyip dönüştürür. Ayrıca **artık bağlantılar (residual connections)** ve **normalleştirme (normalization)** adı verilen teknikler, bilginin derin katmanlar boyunca bozulmadan akmasını sağlar. Modern büyük modellerde bu katmanlardan onlarca, hatta yüzlerce vardır; "derin öğrenme" tabirindeki "derin" tam da budur.

## 5\. Çıktı: olasılıklardan cümleye

Tüm katmanlardan geçen metin, en sonunda bir olasılık dağılımına dönüşür: sözlükteki her olası token için bir yüzde. Örneğin "Bugün hava çok…" girdisine model şöyle bir liste üretebilir: güzel %32, sıcak %21, soğuk %14, … Model bu listeden bir token seçer, metnin sonuna ekler ve döngü baştan başlar.

Seçim her zaman en yüksek olasılıklı kelime olmak zorunda değildir. **Sıcaklık (temperature)** adı verilen bir ayar, modelin ne kadar "yaratıcı" ya da "temkinli" davranacağını belirler. Düşük sıcaklık daha tahmin edilebilir, yüksek sıcaklık daha çeşitli ve sürprizli çıktılar verir.

<div class="callout"><strong>İpucu:</strong> Aynı soruya aynı modelden farklı cevaplar almanızın sebebi genelde budur. Tutarlılık istiyorsanız sıcaklığı düşürün; beyin fırtınası istiyorsanız yükseltin.</div>

## 6\. Güçlü yanları ve sınırları

Bu mimari muazzam yeteneklidir, ama sihir değildir. En bilinen zaafı, modelin bazen **kendinden emin bir biçimde yanlış cevap uydurabilmesidir** (buna "halüsinasyon" denir). Sebebi açık: model "bir sonraki kelimeyi" tahmin eder; "doğruyu söylemek" diye programlanmış bir hedefi yoktur. Akıcı ve ikna edici bir cümle, doğru bir cümle olmak zorunda değildir.

İşte bu yüzden hassas alanlarda (hukuk, sağlık, finans) modeli tek başına kullanmak risklidir. Çözüm, modeli gerçek belgelere demirlemektir; bu yaklaşıma RAG denir ve halüsinasyonu ciddi ölçüde azaltır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>LLM'ler özünde "bir sonraki kelimeyi tahmin et" oyununu devasa ölçekte oynar; metni kelime kelime, otoregresif olarak üretir.</li><li>Metin önce token'lara, sonra anlam haritasındaki vektörlere (embedding) çevrilir.</li><li>Dikkat (attention) mekanizması, her kelimeyi işlerken bağlamdaki en alakalı kelimelere ağırlık verir; Transformer'ın kalbi budur.</li><li>Katmanlar üst üste yığılarak yüzeysel örüntülerden soyut anlama doğru kavrayışı derinleştirir.</li><li>Çıktı bir olasılık dağılımıdır; sıcaklık ayarı yaratıcılık ile tutarlılık dengesini belirler.</li><li>Akıcılık doğruluk garantisi değildir; halüsinasyon riskine karşı modeli gerçek verilere demirlemek gerekir.</li></ul></div>

<div class="faq"><details><summary>LLM cümleyi gerçekten "anlıyor" mu?</summary><p>"Anlama" tartışmalı bir kelime. Model, dildeki istatistiksel örüntüleri olağanüstü iyi öğrenir ve bağlamı dikkat mekanizmasıyla yakalar. Ancak bir insan gibi bilinçli bir kavrayışı yoktur; yaptığı şey, milyarlarca örnekten süzdüğü ilişkilerle en olası devamı üretmektir.</p></details><details><summary>Neden bazen yanlış ama emin görünen cevaplar veriyor?</summary><p>Çünkü modelin hedefi doğruluk değil, olası kelime dizisidir. Eğitildiği verilerde sık görülen, "kulağa doğru gelen" bir kalıbı üretebilir; bu kalıp gerçekte yanlış olsa bile. Buna halüsinasyon denir ve gerçek kaynaklara dayanan yöntemlerle azaltılır.</p></details><details><summary>Transformer ile "derin öğrenme" arasındaki bağ nedir?</summary><p>Transformer, derin öğrenmenin bir mimarisidir. "Derin" ifadesi, üst üste yığılan çok sayıda katmandan gelir. Transformer'ın yeniliği, bu katmanlarda kelimeleri sırayla değil paralel olarak işleyen dikkat mekanizmasını kullanmasıdır; bu da büyük ölçekte verimli eğitimi mümkün kılar.</p></details></div>

---

Özetle: bir LLM, bir sonraki kelimeyi tahmin etmeyi öğrenmiş devasa bir modeldir. Token'lar, gömmeler, dikkat ve katmanlardan oluşan bu zarif mimari, basit bir oyunu insanı şaşırtan bir yeteneğe dönüştürür. Doğru kullanıldığında muazzamdır; ama isabet için gerçek verilere bağlanmaya ihtiyaç duyar. Türkçe odaklı modellerin ve onları gerçek belgelere demirleyen sistemlerin nasıl kurulduğunu merak ediyorsanız, [HatsonTech](/posts/hatsontech-nedir/)'in çalışmalarına göz atabilirsiniz.
