---
title: "Bir Yapay Zeka Modelini Üretime Almak (MLOps): Demodan Gerçek Ürüne"
description: "MLOps nedir? Yapay zeka modelini üretime almanın yolu: sürümleme, izleme, gecikme/maliyet, geri bildirim döngüsü ve güvenli dağıtımı sade bir dille anlatıyoruz."
publishDate: "2026-08-09T23:06:00+03:00"
lang: tr
category: "MLOps"
tags: ["MLOps", "Yapay Zeka"]
translation: "mlops-ai-to-production"
heroImage:
  src: "../../../assets/blog/bimg-20.jpg"
  alt: "Bir Yapay Zeka Modelini Üretime Almak (MLOps): Demodan Gerçek Ürüne"
---

Bir yapay zeka modelini bir demoda çalıştırmak ile onu binlerce kişinin her gün kullandığı bir üründe çalıştırmak, ev mutfağında yemek pişirmek ile bir restoran açmak kadar farklıdır. İkisi de "yemek yapmak" gibi görünür; ama biri tek seferlik bir başarı, diğeri her gün, her sipariş için tekrarlanabilir bir sistemdir. İşte bu sistemin adı MLOps.

## Demo ile üretim arasındaki uçurum

Bir demoda her şey kontrolünüzdedir. Girdiyi siz seçersiniz, ortam temizdir, bir hata olursa "bir daha deneyelim" dersiniz. Üretimde ise model gerçek dünyayla karşılaşır: beklenmedik girdiler, ani trafik artışları, gecenin üçünde kimsenin izlemediği bir anda gelen hatalar. Demo bir fotoğraftır; üretim ise canlı bir yayın.

MLOps (Machine Learning Operations), makine öğrenmesi modellerini güvenilir biçimde üretime alma ve orada sağlıklı tutma disiplinidir. Yazılım dünyasındaki DevOps'un fikirlerini alır; ama bir farkı vardır: geleneksel yazılımda kod değişmedikçe davranış da değişmez. Modellerde ise kod hiç değişmese bile, **dünya değiştikçe modelin performansı kayabilir**. Bu yüzden MLOps sadece "yayınlamak" değil, "yayında tutmak" ile de ilgilenir.

> Bir model üretime alındığı an "bitmiş" değildir; tam tersine, o an asıl ömrü başlar.

## Sürümleme: neyi, ne zaman değiştirdiniz?

Bir yemek tarifini düşünün. Tarifin kendisi (kod), malzemeler (veri) ve pişirme süresi (parametreler) değişebilir. Yemek bir gün harika, ertesi gün vasat çıktığında, neyin değiştiğini bilmiyorsanız sorunu asla bulamazsınız. Sürümleme tam olarak bu sorunu çözer.

Geleneksel yazılımda yalnızca kodu sürümleriz. Makine öğrenmesinde ise en az üç şeyi birlikte izlemek gerekir:

-   **Kod:** Eğitim ve çıkarım mantığı (Git ile).
-   **Veri:** Modelin hangi veriyle eğitildiği. Aynı kod, farklı veriyle bambaşka bir model üretir.
-   **Model:** Eğitim sonucu ortaya çıkan ağırlıklar ve bunlara bağlı metrikler.

Bu üçlüyü birlikte etiketlediğinizde, "geçen ayki davranışa geri dönelim" demek tek bir komuta dönüşür. Bir sorun çıktığında suçlamak yerine _karşılaştırabilirsiniz_.

<div class="callout"><strong>İpucu:</strong> Her model sürümünün yanına "model kartı" niteliğinde kısa bir not bırakın: hangi veriyle, hangi tarihte, hangi amaçla eğitildi ve bilinen zayıf yönleri neler. Altı ay sonraki kendiniz size teşekkür edecek.</div>

## İzleme: model sessizce bozulduğunda

Yazılımda hatalar genellikle gürültülüdür: bir şey çöker, bir ekran kırmızıya döner. Modellerde ise en tehlikeli arızalar sessizdir. Model çalışmaya, cevap üretmeye devam eder; ama cevaplar yavaşça kötüleşir. Buna **kayma (drift)** denir.

İki tür kaymayı izlemek gerekir. **Veri kayması**, modele gelen girdilerin zamanla değişmesidir: kullanıcılar yeni bir dil, yeni bir konu, yeni bir yazım tarzı getirir. **Kavram kayması** ise dünyanın kurallarının değişmesidir; örneğin yeni bir yasa çıkar ve "doğru cevap" artık eskisi değildir.

İyi bir izleme sistemi şu sinyalleri sürekli toplar:

-   Teknik sağlık: gecikme, hata oranı, zaman aşımları.
-   Girdi profili: gelen verinin istatistikleri eğitim verisinden ne kadar saptı?
-   Çıktı kalitesi: kullanıcı geri bildirimleri, düzeltme oranları, örneklem üzerinden insan denetimi.

<div class="callout"><strong>İpucu:</strong> "Model %95 doğru" cümlesi tek başına anlamsızdır. Doğruluğu zaman içinde ve segment bazında (dil, kullanıcı tipi, konu) izleyin; ortalama bir metrik, belirli bir grupta yaşanan çöküşü gizleyebilir.</div>

## Gecikme ve maliyet: görünmeyen fatura

Demoda tek bir cevabın iki saniyede gelmesi sorun değildir. Ama binlerce kullanıcı aynı anda istek gönderdiğinde, o iki saniye hem bir bekleme kuyruğuna hem de bir faturaya dönüşür. Üretimde iki kısıt sürekli birbiriyle yarışır: **ne kadar hızlı** ve **ne kadar pahalı**.

Gecikmeyi konuşurken ortalamaya değil, **uç değerlere** bakın. Kullanıcıların çoğu 300 milisaniyede cevap alıyor olabilir; ama en yavaş %1'lik dilim (p99) beş saniye bekliyorsa, en sadık kullanıcılarınız tam da en kötü deneyimi yaşıyor olabilir. Ortalama yalan söyler; yüzdelik dilimler gerçeği anlatır.

Maliyeti ve gecikmeyi birlikte düşürmek için yaygın birkaç kaldıraç vardır:

-   **Önbellekleme:** Sık sorulan ve cevabı değişmeyen sorgular için sonucu saklayın. En ucuz çıkarım, hiç yapılmayan çıkarımdır.
-   **Toplu işleme (batching):** Gelen istekleri kısa pencerelerde gruplayıp tek seferde işlemek, donanımı çok daha verimli kullanır.
-   **Doğru boyutta model:** Her iş için en büyük modeli kullanmak gerekmez. Basit görevleri küçük ve ucuz bir modele yönlendirip yalnızca zor durumları büyük modele bırakmak (yönlendirme/routing) ciddi tasarruf sağlar.

```python
# Basit bir "önbellek + yönlendirme" sözde kodu
def cevapla(soru):
    if onbellek.var(soru):
        return onbellek.getir(soru)        # en ucuz yol: hiç model çağırma

    if basit_mi(soru):
        cevap = kucuk_model(soru)           # ucuz ve hızlı
    else:
        cevap = buyuk_model(soru)           # pahalı ama güçlü

    onbellek.kaydet(soru, cevap, sure="1g")
    kayit_at(soru, cevap, gecikme, maliyet) # izleme için her şeyi logla
    return cevap
```

## Geri bildirim döngüsü: ürünü kendine öğreten sistem

Üretimin en değerli yan ürünü veridir. Her gerçek kullanım, modelin nerede iyi nerede kötü olduğunu gösteren ücretsiz bir ders niteliğindedir; yeter ki onu toplayıp kullanabilesiniz. Geri bildirim döngüsü budur: **kullan → ölç → öğren → iyileştir → tekrar yayınla**.

Geri bildirim her zaman açıkça gelmez. İki türü vardır:

-   **Açık geri bildirim:** Kullanıcının beğen/beğenme, "bu cevap yanlıştı" gibi doğrudan işaretleri.
-   **Örtük geri bildirim:** Kullanıcının cevabı kopyalaması, üzerinde düzeltme yapması veya hemen vazgeçip yeniden sorması gibi davranışsal ipuçları.

Bu sinyaller toplanır, etiketlenir ve bir sonraki eğitim turuna girer. Ama burada altın kural şudur: döngüyü _otomatik pilota_ almayın. Kötü geri bildirimle eğitilen bir model, kendi hatalarını pekiştirerek hızla kötüleşebilir. İnsan denetimi, döngünün güvenlik supabıdır.

## Güvenli dağıtım: korkmadan yayınlamak

Yeni bir model sürümünü tüm kullanıcılara aynı anda açmak, yüzme bilip bilmediğinizi görmek için doğrudan derin suya atlamaya benzer. Güvenli dağıtım, riski küçük ve geri alınabilir adımlara böler.

-   **Gölge (shadow) dağıtım:** Yeni model gerçek trafiği alır ama cevapları kullanıcıya gösterilmez; yalnızca eskisiyle karşılaştırılır. Riski sıfır, bilgisi yüksek.
-   **Kanarya (canary) yayını:** Yeni sürüm önce kullanıcıların küçük bir yüzdesine (örneğin %5) açılır. Metrikler iyiyse oran kademeli artırılır.
-   **A/B testi:** İki sürüm aynı anda yayında tutulur ve hangisinin gerçek metrikleri (kalite, hız, memnuniyet) daha iyiyse o kazanır.

Hepsinin altında yatan tek bir prensip vardır: **hızlı geri alma (rollback)**. Bir şey ters giderse, tek bir hamleyle bir önceki sağlam sürüme dönebilmelisiniz. Cesaretle yayınlamanın sırrı, geri dönüşün kolay olduğunu bilmektir.

> İyi MLOps, "asla hata yapmamak" değildir; hatayı küçük, görünür ve geri alınabilir kılmaktır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Model üretime alındığında işiniz bitmez; asıl bakım o an başlar.</li><li>Kod, veri ve modeli birlikte sürümleyin ki sorun çıktığında karşılaştırabilesiniz.</li><li>En tehlikeli arıza sessiz olandır: kaymayı sürekli izleyin.</li><li>Gecikmede ortalamaya değil, p95/p99 uç değerlerine bakın.</li><li>Önbellek, batching ve doğru boyutta model maliyeti ciddi düşürür.</li><li>Geri bildirim döngüsünü insan denetimi olmadan otomatik pilota almayın.</li><li>Gölge, kanarya ve A/B ile küçük adımlarla, geri alınabilir biçimde yayınlayın.</li></ul></div>

<div class="faq"><details><summary>MLOps ile DevOps aynı şey mi?</summary><p>Aynı felsefeyi paylaşırlar ama aynı değiller. DevOps yazılımı yayınlama ve işletmeyle ilgilenir. MLOps buna iki katman ekler: veri ve modelin de sürümlenmesi, ve kod değişmese bile dünya değiştikçe performansın kayabilmesi. Yani MLOps, sürekli izleme ve yeniden eğitime DevOps'tan daha fazla yaslanır.</p></details><details><summary>Modeli ne sıklıkla yeniden eğitmeliyim?</summary><p>Takvime göre değil, kanıta göre. Sabit bir takvim yerine izleme sinyallerini eşik olarak kullanın: veri kayması belirli bir düzeyi aştığında, kalite metrikleri düştüğünde veya yeterli yeni geri bildirim biriktiğinde yeniden eğitin. Bazı sistemler için bu haftada bir, bazıları için yılda bir anlamına gelebilir.</p></details><details><summary>Küçük bir ekip için tüm bunlar fazla ağır değil mi?</summary><p>Hepsini birden kurmanız gerekmez. En yüksek getirili üçünden başlayın: temel izleme (en azından gecikme ve hata oranı), model/veri sürümleme ve tek tuşla geri alma. Bu üçü olmadan üretim, gözleri kapalı araba kullanmaya benzer; bunlar olunca gerisini zamanla ekleyebilirsiniz.</p></details></div>

---

Özetle MLOps, bir modeli "çalışan bir demo"dan "güvenilir bir ürüne" dönüştüren köprüdür. Sürümleme size hafıza, izleme size gözler, geri bildirim döngüsü size öğrenme, güvenli dağıtım ise cesaret kazandırır. Biz de [HatsonTech](/posts/hatsontech-nedir/) ürünlerinde tam olarak bu disipline yaslanıyoruz: hukuk gibi hata payının düşük olduğu bir alanda, bir cevabın hızlı olması kadar izlenebilir, geri alınabilir ve güvenilir olması da önemlidir.
