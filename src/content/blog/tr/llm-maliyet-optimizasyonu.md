---
title: "LLM Maliyet Optimizasyonu: Token, Önbellekleme, Model Seçimi ve RAG ile Faturayı Düşürmek"
description: "LLM faturasını düşürmenin pratik kaldıraçları: token tüketimini azaltma, prompt caching, görevi modele eşleştirme, toplu işleme (batch) ve küçük model + RAG dengesi. Sezgisel analojiler ve örnek kodla, doğru sırayla maliyet optimizasyonu."
publishDate: "2026-08-09T23:19:00+03:00"
lang: tr
category: "Maliyet"
tags: ["Maliyet", "Yapay Zeka"]
translation: "llm-cost-optimization"
heroImage:
  src: "../../../assets/blog/covers/llm-maliyet-optimizasyonu.jpg"
  alt: "LLM Maliyet Optimizasyonu: Token, Önbellekleme, Model Seçimi ve RAG ile Faturayı Düşürmek"
---

Bir dil modeli (LLM) prototipi şaşırtıcı derecede ucuz görünür: birkaç istek atarsınız, fatura yuvarlama hatası kadardır. Sonra ürün canlıya çıkar, kullanıcı sayısı artar ve bir sabah aylık API faturası bir mühendisin maaşını geçer. İyi haber şu: LLM maliyeti büyük ölçüde mimari bir tercih meselesidir, kader değil. Bu yazıda token tüketimini azaltmaktan önbeklemeye, doğru modeli seçmekten toplu işleme ve “küçük model + RAG” dengesine kadar maliyeti düşürmenin pratik kaldıraçlarını sezgisel analojilerle ele alıyoruz.

## Maliyet aslında nereden geliyor?

LLM faturasını anlamanın ilk adımı, ücretlendirmenin **token** üzerinden yapıldığını kavramaktır. Token, modelin metni işlerken kullandığı küçük parçadır; kabaca bir kelime birkaç token eder. Önemli olan nokta: girdi (input) ve çıktı (output) token’ları ayrı ayrı fiyatlandırılır ve çıktı genellikle çok daha pahalıdır.

Sayılarla somutlaştıralım. Yazının yazıldığı dönemde örnek bir fiyat tablosu şöyledir:

-   **Büyük, en yetenekli model:** 1 milyon girdi token’ı için 5 dolar, 1 milyon çıktı token’ı için 25 dolar.
-   **Dengeli orta model:** 1 milyon girdi için 3 dolar, 1 milyon çıktı için 15 dolar.
-   **Küçük, hızlı model:** 1 milyon girdi için 1 dolar, 1 milyon çıktı için 5 dolar.

> İki desen hemen göze çarpar: çıktı token’ı girdiden yaklaşık beş kat pahalıdır ve modeller arasında girdi maliyeti beş katına kadar değişir. Optimizasyonun büyük kısmı bu iki gerçeğin etrafında döner.

Bir taksi yolculuğu gibi düşünün: girdi token’ları yola çıkış ücreti, çıktı token’ları ise kilometre başına ücrettir. Aynı varış noktasına gitmenin pahalı ve ucuz yolları vardır; mesele rotayı akıllıca seçmektir.

## Token tüketimini azaltmak

En doğrudan kaldıraç, her isteğe giren ve çıkan token sayısını azaltmaktır. Burada birkaç pratik alışkanlık ciddi tasarruf sağlar:

-   **İstemi yalınlaştırın:** Gereksiz nezaket cümleleri, tekrar eden talimatlar ve şişkin örnekler her istekte para yakar. Talimatı kısa ve net tutun.
-   **Çıktıyı sınırlayın:** Sınıflandırma gibi görevlerde modelden uzun açıklama değil, tek kelime isteyin. `max_tokens` değerini görevin gerçek ihtiyacına göre ayarlayın.
-   **Bağlamı budayın:** Uzun sohbet geçmişlerinde her şeyi tekrar göndermek yerine eski turları özetleyin ya da konuya ilgisiz kısımları çıkarın.
-   **Tahmin etmeyin, ölçün:** Bir isteği göndermeden önce token sayımı yapan uçları kullanın. OpenAI’nin `tiktoken` kütüphanesi gibi araçlar başka modeller için yanıltıcı sayım verebilir; kullandığınız modelin kendi token sayacını tercih edin.

<div class="callout"><strong>İpucu:</strong> Önce ölçün. “Sistem istemimiz kaç token?” sorusunun cevabını bilmeden optimizasyona başlamak, karanlıkta tasarruf aramaktır. Tek bir uzun sistem istemi, binlerce isteğe çarpıldığında faturanın en büyük kalemi olabilir.</div>

## Önbellekleme (prompt caching)

Çoğu uygulama her isteğin başında aynı büyük metni gönderir: sabit bir sistem istemi, uzun bir doküman, sabit bir araç listesi. Bu tekrar eden ön ek (prefix) her seferinde yeniden işlenir ve her seferinde tam fiyattan token olarak ödenir. **Prompt caching** tam da bu israfı ortadan kaldırır.

Mantığı kütüphanedeki bir ders çalışma masası gibidir: ortak kitapları her sabah baştan taşımak yerine masada bırakırsınız; ertesi gün sadece o günkü notlarınızı eklersiniz. Önbellek de prefix’i bir kez işleyip saklar; sonraki isteklerde aynı prefix’i çok daha ucuza “okur”.

Ekonomisi çarpıcıdır: önbellekten okuma, normal girdi fiyatının yaklaşık onda biri kadardır. Önbelleğe yazma ise bir kerelik küçük bir prim ister (5 dakikalık önbellek için yaklaşık 1,25 kat). Yani aynı prefix iki istekte bile kullanıldığında masraf çıkmaya başlar.

```text
// Önbellekleme bir ÖN EK (prefix) eşleşmesidir:
// Sıralama her zaman: tools -> system -> messages

İstek 1:  [ büyük sabit sistem istemi  ][ kullanıcı sorusu A ]
          ^---------- ÖNBELLEĞE YAZ ----^   (tam fiyat + ~%25 prim)

İstek 2:  [ büyük sabit sistem istemi  ][ kullanıcı sorusu B ]
          ^---------- ÖNBELLEKTEN OKU --^   (~%10 fiyat)  ✓ tasarruf

// Tek kural: prefix'teki TEK bir bayt değişirse,
// o noktadan sonrası geçersiz olur ve yeniden yazılır.
```

Önbelleğin sessizce bozulmasının en yaygın nedeni, sabit sanılan prefix’in aslında her istekte değişmesidir. Sistem istemine `su an: 14:32` gibi bir zaman damgası veya rastgele bir kimlik koymak, ya da JSON’u anahtarları sıralamadan üretmek, önbelleği her seferinde geçersiz kılar. Çözüm: değişken içerikleri prefix’in _sonuna_ taşıyın ve sabit kısmı bayt bayt aynı tutun.

> Önbellek gerçekten çalışıyor mu? Yanıtın kullanım (usage) verisinde `cache_read_input_tokens` alanına bakın. Tekrarlanan isteklerde bu değer sıfır kalıyorsa, prefix’i her seferinde bozan sessiz bir değişken vardır.

## Doğru modeli seçmek

Maliyet–kalite dengesinin en güçlü kaldıracı model seçimidir, ama buradaki yaygın hata her görev için ya en büyük ya da en küçük modeli kullanmaktır. Doğru yaklaşım **görevi modele eşleştirmektir.**

-   **En büyük model** karmaşık akıl yürütme, çok adımlı ajan görevleri ve hatanın pahalı olduğu durumlar içindir.
-   **Dengeli orta model** çoğu üretim iş yükünün tatlı noktasıdır: iyi bir özetleme, yeniden yazma veya soru-cevap için fazlasıyla yeterlidir.
-   **Küçük, hızlı model** sınıflandırma, etiketleme, basit çıkarım gibi hacimli ve net görevler için idealdir; üstelik gecikmeyi de düşürür.

Pratik bir yöntem **kademeli (cascade) yönlendirmedir**: isteği önce ucuz bir modele verirsiniz; model emin değilse veya görev belirli bir karmaşıklık eşiğini aşıyorsa, daha güçlü modele yükseltirsiniz. Bir hastanenin triyaj sistemi gibi: her hasta doğrudan baş cerraha gitmez; çoğu vaka pratisyen hekimle çözülür, yalnızca gerçekten gerekenler uzmana sevk edilir.

<div class="callout"><strong>İpucu:</strong> Maliyet için modeli kendi başınıza düşürmeyin; bu kullanıcının kararıdır. Bunun yerine bir değerlendirme (eval) seti kurun ve küçük modelin görevde gerçekten yeterli olup olmadığını ölçün. Kalite düşmüyorsa tasarruf bedavadır; düşüyorsa zaten yanlış yerde kısıyorsunuz demektir.</div>

## Toplu işleme (batch)

Her istek anında yanıt gerektirmez. Gecelik rapor üretimi, büyük bir belge kümesini etiketleme, veri zenginleştirme gibi gecikmeye duyarsız işlerde **toplu işleme (batch)** uçları devreye girer.

Mantık kargo gibidir: acil bir paket için kurye çağırırsınız ve prim ödersiniz; ama yüz paketi aynı anda standart kargoya verirseniz birim maliyet ciddi şekilde düşer. Batch ucu da aynı mantıkla çalışır: istekleri toplu gönderir, sonuçları bir süre içinde (genellikle bir saat içinde, en geç 24 saatte) hazır eder ve karşılığında **standart fiyatın yarısını** alır.

En güzel yanı, batch’in diğer optimizasyonlarla birlikte çalışmasıdır: toplu isteklerde de önbellekleme, küçük model seçimi ve token budama aynen geçerlidir. Yani gecikmeyi feda edebildiğiniz her yerde, başka hiçbir şeyi değiştirmeden maliyeti yarıya indirme şansınız vardır.

> Basit kural: Kullanıcı yanıtı ekranda bekliyorsa gerçek zamanlı istek; bir kuyruğa atıp sonucu daha sonra okuyabiliyorsanız batch.

## Küçük model + RAG dengesi

Çoğu ekip “model ne kadar büyükse o kadar iyi” varsayar ve her şeyi en pahalı modele yükler. Oysa pek çok görevde sorunun kaynağı modelin _zekâsı_ değil, doğru _bilgiye_ erişememesidir. İşte burada küçük bir model ile RAG’in (Retrieval-Augmented Generation) birleşimi güçlü bir denge sunar.

Fark şudur: büyük bir modelden bilgiyi _ezberden_ hatırlamasını istemek hem pahalıdır hem de uydurma (halüsinasyon) riski taşır. Bunun yerine ilgili belgeyi bir vektör veritabanından çekip isteme ekler ve küçük modelden yalnızca _bu metne dayanarak_ cevap vermesini isterseniz, görev “bilmek”ten “okuyup özetlemek”e iner. Bu çok daha kolay bir görevdir ve küçük model bunu rahatça başarır.

-   **Maliyet düşer:** Pahalı bir modelin akıl yürütme gücüne her sorguda ihtiyaç kalmaz.
-   **Doğruluk artar:** Cevap gerçek belgelere dayanır; kaynak gösterilebilir, halüsinasyon azalır.
-   **Güncellik kazanılır:** Bilgi modelin dışındadır; yeni belge eklemek için modeli yeniden eğitmek gerekmez.

Tabii bir denge sorusu vardır: RAG kurulumu bir vektör veritabanı, parçalama (chunking) ve gömme (embedding) gerektirir; ayrıca çekilen belgeler her isteğin girdi token sayısını artırır. Yani “küçük model + RAG” genellikle “büyük model, RAG yok” seçeneğinden ucuzdur, ama körlemesine değil; kendi iş yükünüzde ölçerek doğrulamak gerekir.

## Hepsini birleştiren bir karar akışı

Bu kaldıraçlar rakip değil, katmandır. Olgun bir sistem hepsini bir arada kullanır. Aşağıdaki sözde-kod, çoğu projede maliyeti düşürmenin doğru sırasını yakalar:

```python
def maliyet_optimize_et(istek):
    # 1. İstemi yalınlaştır ve çıktıyı sınırla
    istek = istemi_buda(istek)
    istek.max_tokens = gorevin_gercek_ihtiyaci(istek)

    # 2. Sabit prefix'i önbelleğe al
    if buyuk_sabit_prefix_var(istek):
        istek.cache_control = "ephemeral"

    # 3. Bilgi gerekiyorsa ezberden değil, RAG ile getir
    if harici_bilgi_gerek(istek):
        istek.baglam = vektor_db.getir(istek.soru)
        model = "kucuk-hizli-model"
    else:
        model = gorev_zorluguna_gore_sec(istek)  # kademeli yönlendirme

    # 4. Gecikme önemsizse maliyeti yarıya indir
    if gecikmeye_duyarsiz(istek):
        return batch_kuyruguna_ekle(istek, model)

    return gercek_zamanli_gonder(istek, model)
```

Sıralama önemlidir: önce token israfını kesin (çoğu zaman en hızlı kazanç), sonra tekrar eden prefix’i önbelleğe alın, ardından görevi doğru modele eşleştirin ve nihayet gecikmeye duyarsız işleri batch’e yönlendirin. Her katman bir öncekinin üzerine birikir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Maliyet token üzerinden hesaplanır; çıktı token’ı girdiden çok daha pahalıdır.</li><li>İlk adım her zaman ölçmektir: optimize etmeden önce token sayımı yapın.</li><li>Önbellekleme tekrar eden prefix’i yaklaşık onda bir fiyata indirir; tek bir bayt değişikliği onu bozar.</li><li>Görevi modele eşleştirin; her şeyi en büyük modele yüklemeyin, kademeli yönlendirme kullanın.</li><li>Gecikmeye duyarsız işleri toplu (batch) gönderin: standart fiyatın yarısı.</li><li>Küçük model + RAG çoğu bilgi-yoğun görevde hem ucuz hem doğru bir dengedir.</li></ul></div>

<div class="faq"><details><summary>Maliyeti düşürmek için en kolay ilk adım nedir?</summary><p>Token israfını kesmek. Sistem istemini yalınlaştırmak, gereksiz örnekleri çıkarmak ve <code>max_tokens</code> değerini görevin gerçek ihtiyacına göre ayarlamak çoğu zaman tek satır kod değişmeden ciddi tasarruf sağlar. Hemen ardından tekrar eden prefix için önbelleklemeyi açın.</p></details><details><summary>Önbellekleme çalışmıyor gibi görünüyor, neden?</summary><p>Neredeyse her zaman prefix’i sessizce bozan bir değişken vardır: sistem istemindeki bir zaman damgası, rastgele bir kimlik veya sıralanmamış JSON. Yanıttaki <code>cache_read_input_tokens</code> sıfır kalıyorsa, iki ardışık isteğin prefix’ini bayt düzeyinde karşılaştırın ve değişeni prefix’in sonuna taşıyın.</p></details><details><summary>Maliyet için her zaman en küçük modeli mi seçmeliyim?</summary><p>Hayır. Doğru yöntem görevi modele eşleştirmektir. Küçük model basit, hacimli görevlerde mükemmeldir; ama karmaşık akıl yürütmede kaliteyi düşürüp daha fazla yeniden deneme gerektirerek aslında pahalıya da çıkabilir. Bir eval seti kurun ve küçük modelin o görevde gerçekten yeterli olduğunu ölçün.</p></details></div>

---

LLM maliyet optimizasyonu tek bir hileden ibaret değildir; token budama, önbellekleme, model seçimi, batch ve RAG’in doğru sırayla katmanlanmasıdır. Bu kaldıraçları Türkçe yapay zeka ürünlerinde pratikte nasıl uyguladığımızı merak ediyorsanız [HatsonTech](/posts/hatsontech-nedir/)’in yaklaşımına göz atabilirsiniz.
