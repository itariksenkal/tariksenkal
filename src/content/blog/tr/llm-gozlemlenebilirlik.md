---
title: "LLM Gözlemlenebilirliği: İzleme, Loglama ve Değerlendirme Döngülerine Pratik Bir Bakış"
description: "LLM tabanlı ürünlerde gözlemlenebilirliği ele alıyoruz: izleme (tracing), loglama, değerlendirme döngüleri ile üretimde kaliteyi koruma ve regresyonları erken yakalama."
publishDate: "2026-08-09T23:17:00+03:00"
lang: tr
category: "Gözlemlenebilirlik"
tags: ["Gözlemlenebilirlik", "Yapay Zeka"]
translation: "llm-observability"
heroImage:
  src: "../../../assets/blog/covers/llm-gozlemlenebilirlik.jpg"
  alt: "LLM Gözlemlenebilirliği: İzleme, Loglama ve Değerlendirme Döngülerine Pratik Bir Bakış"
---

Bir restoran mutfağını düşünün. Yemekler güzel görünüyor, müşteriler sipariş veriyor, ama mutfakta ne olup bittiğini görmüyorsanız bir gün neden herkesin tabağını yarım bıraktığını anlayamazsınız. LLM tabanlı bir ürün de tam olarak böyledir: model bir kutu, içeride dönen şeyler ise çoğu zaman karanlıkta kalır. Gözlemlenebilirlik (observability), o mutfağın camını açmaktır. Bu yazıda izlemeyi (tracing), loglamayı, değerlendirme döngülerini ve üretimde kaliteyi koruyup regresyonları yakalamayı sezgisel bir dille konuşacağız.

## Gözlemlenebilirlik neden klasik yazılımdan farklı?

Geleneksel yazılımda bir fonksiyon aynı girdiye genelde aynı çıktıyı verir. Hata olursa bir _stack trace_ görür, satırı bulur, düzeltirsiniz. LLM'lerde ise işler daha kaygandır: aynı soruya bugün farklı, yarın bambaşka bir cevap gelebilir. "Çöküyor mu, çökmüyor mu" sorusunun yerini "iyi mi, kötü mü" sorusu alır. Bu da ölçmesi zor, çünkü "iyi" özneldir.

İşte bu yüzden LLM gözlemlenebilirliği üç katmanı birlikte ister: **ne oldu** (izleme), **nasıl oldu** (loglama) ve **iyi miydi** (değerlendirme). Biri eksikse, ya körsünüz ya da gördüğünüzü yorumlayamazsınız.

> Klasik izleme size "sistem ayakta mı?" der. LLM gözlemlenebilirliği ise "sistem ayakta, peki söyledikleri doğru ve yararlı mı?" diye sorar. İkincisi çok daha zor, ama asıl önemli olan da odur.

## İzleme (tracing): isteğin yolculuğu

Bir kullanıcı sorusu, modele varana kadar çoğu zaman tek bir adım değildir. Önce belge getirilir (retrieval), sonra istem (prompt) kurulur, belki bir araç çağrılır, model yanıt üretir, ardından bir doğrulama adımı çalışır. İzleme, bu zincirin her halkasını uçtan uca kaydetmektir; tıpkı bir kargonun deposundan kapınıza kadar her duraktan geçtiği gibi.

İyi bir iz (trace) şu soruları yanıtlar: Hangi belgeler getirildi? Modele tam olarak hangi istem gitti? Hangi araç ne kadar sürede çalıştı? Token tüketimi nerede patladı? Gecikme (latency) hangi adımdan kaynaklandı? Bir cevap kötü çıktığında, suçun retrieval'da mı yoksa modelin kendisinde mi olduğunu ancak iz sayesinde ayırt edebilirsiniz.

-   **Span:** Zincirin tek bir adımı (örneğin "belge getirme" ya da "model çağrısı"). Başlangıç, bitiş ve girdi/çıktı bilgisi taşır.
-   **Trace:** Bir kullanıcı isteğine ait tüm span'lerin oluşturduğu ağaç. İsteğin tam hikâyesidir.
-   **Metadata:** Model adı, sürüm, sıcaklık (temperature), kullanıcı kimliği gibi bağlam etiketleri. Sonradan filtreleme için altın değerindedir.

<div class="callout"><strong>İpucu:</strong> Her trace'e bir sürüm etiketi (örneğin istem sürümü ve model adı) ekleyin. Bir gün kalite düştüğünde "hangi değişiklikten sonra?" sorusunun cevabı bu etiketlerde saklıdır.</div>

## Loglama: neyi, ne kadar kaydetmeli?

Loglama, izlemenin daha ham ve esnek kuzenidir. İzleme yapılandırılmış bir ağaçken, log genelde "şu anda şunu yaptım" diyen serbest kayıtlardır. LLM dünyasında en kıymetli loglar şunları içerir: gönderilen tam istem, modelin ham yanıtı, kullanılan token sayıları, gecikme, hata mesajları ve varsa kullanıcı geri bildirimi (beğendi/beğenmedi).

Ama burada iki tuzak var. Birincisi **gizlilik**: istemler ve yanıtlar kişisel veya hassas veri içerebilir. Kaydetmeden önce maskeleyin, anonimleştirin veya saklama süresini kısaltın. İkincisi **gürültü**: her şeyi kaydederseniz, önemli olanı bulmak samanlıkta iğne aramaya döner. Hangi alanların gerçekten gerektiğine baştan karar verin.

> İyi log, gelecekteki kendinize yazdığınız bir mektuptur. Üç ay sonra bir şikâyet geldiğinde, o anki istemi ve yanıtı yeniden üretebiliyorsanız doğru loglamışsınız demektir.

## Değerlendirme döngüleri (eval loops)

İzleme ve loglama "ne oldu"yu anlatır; değerlendirme ise "iyi miydi"yi ölçer. Bir değerlendirme döngüsü, modelin çıktısını bir kalite ölçütüne karşı sınamak ve bunu düzenli olarak tekrarlamaktır. Üç yaygın yaklaşım vardır:

1.  **Referanslı değerlendirme:** Beklenen bir "altın cevap" varsa, modelin çıktısını onunla karşılaştırırsınız. Sınıflandırma veya çıkarım gibi net cevaplı görevler için idealdir.
2.  **Model-jüri (LLM-as-judge):** Açık uçlu yanıtlarda tek bir doğru cevap olmadığında, bir başka modeli "hakem" olarak kullanıp çıktıyı belirli kriterlere göre puanlatırsınız. Hızlı ve ölçeklenebilir, ama jürinin de yanlılığı olabileceğini unutmayın.
3.  **İnsan değerlendirmesi:** En güvenilir, ama en pahalı yöntem. Genelde örneklem üzerinde, model-jüriyi kalibre etmek için kullanılır.

Buradaki anahtar kelime _döngü_. Değerlendirme tek seferlik bir sınav değildir; her istem değişikliğinde, her model güncellemesinde aynı test setini yeniden çalıştırırsınız. Buna sabit bir test seti (golden set) kurmak, yazılımdaki regresyon testlerinin LLM karşılığıdır.

<div class="callout"><strong>İpucu:</strong> Küçük başlayın. 30-50 iyi seçilmiş örnekten oluşan bir altın set, mükemmel olmaya çalışan ama hiç kurulamayan dev bir setten kat kat değerlidir. Seti zamanla, üretimden gelen gerçek hatalarla büyütün.</div>

## Üretimde kalite ve regresyon takibi

Laboratuvarda iyi çalışan bir model, üretimde gerçek ve dağınık girdilerle karşılaşınca farklı davranabilir. Üretimde kalite takibi, sürekli bir nabız ölçümüdür. Şu sinyallere bakarsınız: kullanıcı geri bildirimleri, model-jüri puanlarının zaman içindeki seyri, gecikme ve maliyet eğrileri, "boş/alakasız cevap" oranları ve güvenlik filtrelerinin tetiklenme sıklığı.

**Regresyon**, daha önce çalışan bir şeyin bir değişiklikten sonra bozulmasıdır. LLM'lerde bu sinsi olabilir, çünkü değişiklik sizden gelmemiş olabilir: sağlayıcı modeli sessizce güncelleyebilir, bir istem ince ayarı beklenmedik yan etki yapabilir ya da kullanıcıların soru biçimi zamanla kayabilir (data drift). Bu yüzden altın setinizi düzenli aralıklarla otomatik çalıştırın ve puan bir eşiğin altına düşerse uyarı kurun.

-   **Çevrimdışı eval:** Yayına almadan önce, sabit test setiyle. "Bu değişiklik bir şey bozdu mu?" sorusunu yanıtlar.
-   **Çevrimiçi izleme:** Canlıda, gerçek trafikle. "Şu an gerçekte ne oluyor?" sorusunu yanıtlar.
-   **Geri besleme:** Üretimde yakalanan kötü örnekleri altın sete ekleyip döngüyü kapatın.

> Sağlam bir kural: hiçbir istem veya model değişikliğini değerlendirme çalıştırmadan yayına almayın. Bir regresyon testi geçilmeden kod gönderilmediği gibi, bir eval geçilmeden istem de gönderilmemeli.

## Küçük bir izleme örneği

Aşağıda, bir RAG zincirini izlemenin sözde-kod taslağı var. Amaç, her adımı ayrı bir span olarak kaydedip bir cevap kötü çıktığında nerede aksadığını görebilmek:

```text
# Bir kullanıcı isteğini uçtan uca izle
with trace("soru-cevap", user_id=uid, prompt_version="v3") as t:

    with t.span("retrieval") as s:
        docs = retrieve(query)              # belgeleri getir
        s.log(found=len(docs), query=query)

    with t.span("model_call") as s:
        prompt = build_prompt(query, docs)  # istemi kur
        answer = model.generate(prompt)
        s.log(tokens_in=count(prompt),
              tokens_out=count(answer),
              model="model-x")

    with t.span("eval") as s:
        score = judge(query, answer)        # model-jüri puanı
        s.log(score=score)
        if score < 0.6:                     # eşik altıysa
            alert("Düşük kalite cevap", trace_id=t.id)
```

Buradaki kilit nokta son span'deki eşik kontrolü: puan belli bir seviyenin altına düştüğünde otomatik bir uyarı tetikleniyor ve ilgili trace kimliğiyle birlikte saklanıyor. Böylece kötü cevabı sonradan açıp tüm yolculuğunu adım adım inceleyebilirsiniz; suç retrieval'da mı, istemde mi, modelde mi belli olur.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>LLM gözlemlenebilirliği üç katmandır: <strong>izleme</strong> (ne oldu), <strong>loglama</strong> (nasıl oldu) ve <strong>değerlendirme</strong> (iyi miydi).</li><li>İzleme, isteği span'lere bölerek hatanın retrieval'da mı yoksa modelde mi olduğunu ayırt etmenizi sağlar.</li><li>Loglarken gizliliği koruyun ve gürültüye boğulmayın; üç ay sonra olayı yeniden üretebilmek hedeftir.</li><li>Değerlendirme bir <em>döngüdür</em>: küçük bir altın setle başlayın, her değişiklikte yeniden çalıştırın, üretim hatalarıyla büyütün.</li><li>Regresyonlar sessizce gelir; çevrimdışı eval'i yayın öncesi kapıya koyun, çevrimiçi izlemeyle canlıyı sürekli dinleyin.</li></ul></div>

<div class="faq"><details><summary>İzleme (tracing) ile loglama arasındaki fark nedir?</summary><p>Loglama, "şu an şunu yaptım" diyen serbest ve dağınık kayıtlardır. İzleme ise bir isteğin tüm adımlarını birbirine bağlı bir ağaç olarak yapılandırır. İzleme size bütünü ve adımlar arası ilişkiyi, log ise tekil olayların ham ayrıntısını verir; ikisi birlikte en güçlüdür.</p></details><details><summary>Model-jüri (LLM-as-judge) güvenilir mi?</summary><p>Hızlı ve ölçeklenebilir olduğu için çok değerlidir, ama kusursuz değildir; jürinin de yanlılıkları olabilir. En iyi uygulama, model-jüriyi küçük bir insan değerlendirmesiyle kalibre etmek ve onu tek karar mercii değil, bir erken uyarı sistemi olarak görmektir.</p></details><details><summary>Üretimde regresyonu nasıl erkenden yakalarım?</summary><p>Sabit bir altın test setini düzenli aralıklarla otomatik çalıştırın ve puan bir eşiğin altına düştüğünde uyarı kurun. Ayrıca model sağlayıcısının sürüm değişikliklerini ve kullanıcı sorularındaki kaymayı (drift) izleyin; regresyon çoğu zaman sizin değil, ortamın değişmesinden gelir.</p></details></div>

---

Özetle, LLM gözlemlenebilirliği bir lüks değil, üretime alınmış her yapay zeka ürününün temel altyapısıdır. İzleme, loglama ve değerlendirme döngülerini birlikte kurduğunuzda, modelinizi karanlık bir kutu olmaktan çıkarıp güvenle yönetebileceğiniz şeffaf bir sisteme dönüştürürsünüz. Gözlemlenebilir, ölçülebilir ve güvenilir yapay zeka çözümleri kurmayı planlıyorsanız, [HatsonTech](/posts/hatsontech-nedir/) ekibi bu yapıyı sizinle birlikte tasarlamaktan memnuniyet duyar.
