---
title: "Düşünme Bütçesinden Çaba Seviyesine: Akıl Yürütmenin Faturası"
description: "Akıl yürüten modellerde gizli düşünme tokenları için ödersiniz. Çaba seviyeleri, görev bütçeleri, önbellek tuzağı ve daha fazla düşünmenin zarar verdiği durumlar."
publishDate: "2026-08-13T23:47:00+03:00"
lang: tr
category: "Maliyet"
tags: ["Maliyet", "Yapay Zeka"]
translation: "reasoning-token-economics"
heroImage:
  src: "../../../assets/blog/covers/akil-yurutme-token-maliyeti.jpg"
  alt: "Düşünme Bütçesinden Çaba Seviyesine: Akıl Yürütmenin Faturası"
---

Akıl yürüten bir modele soru sorduğunuzda faturanın büyük kısmı görmediğiniz metinden gelir. Model düşünür, o düşünme token üretir ve o tokenlar ücretlendirilir. Türkçe kaynaklarda bu neredeyse hiç açıklanmıyor. Üstelik 2026'da bu maliyeti kontrol ettiğiniz kadran değişti: elle düşünme bütçesi verme dönemi kapandı, yerine çaba seviyeleri geldi ve yeni bir ilkel olarak görev bütçeleri eklendi.

## Görünmeyen kalem: düşünme tokenları

Klasik bir model çağrısında maliyet iki kalemdir: girdi ve çıktı. Akıl yürüten bir modelde üçüncü bir kalem devreye girer — modelin cevaba varmadan önce ürettiği ara metin. Kullanıcı bunu görmez; siz ödersiniz.

> Akıl yürüten modellerde maliyeti belirleyen şey sorunun uzunluğu değil, modelin ne kadar düşündüğüdür.

Bunun bütçedeki karşılığı, aynı prompt'un çalıştırmadan çalıştırmaya farklı tutması. Sabit fiyatlı bir hesap kurmak imkânsız hâle gelir; onun yerine **görev başına maliyet** ölçmeniz gerekir. Yayımlanmış ölçümlerde bu eksendeki fark çarpıcı: karşılaştırılabilir zekâ seviyelerinde görev başına maliyet 0,04 dolardan 3,25 dolara kadar uzanıyor.

## Bütçeden çabaya: kadran değişti

Uzun süre kontrol kadranı elle verilen bir düşünme bütçesiydi: `thinking: {"type": "enabled", "budget_tokens": N}`. Bu yaklaşımın bilinen kısıtları vardı — `budget_tokens` en az 1.024 olmalı ve `max_tokens`'tan küçük kalmalıydı.

Bu arayüz 4.6 kuşağı modellerde kullanımdan kaldırıldı ve **4.7 ve sonrasında 400 hatası döner**. Yerine geçen kurgu iki parçalı:

```json
{
  "model": "…",
  "thinking": { "type": "adaptive" },
  "output_config": { "effort": "medium" }
}
```

`effort` beş seviyeye sahip: `low`, `medium`, `high`, `xhigh`, `max`. Varsayılan `high` ve kullanmak için beta başlığı gerekmiyor. Gemini aynı fikri `thinking_level` olarak sunuyor; OpenAI'nin `reasoning_effort` parametresi de uyumluluk katmanı üzerinden aynı eksene oturuyor. Yani bu artık tek bir sağlayıcının özelliği değil, sektörün ortak kadranı.

## Çaba yalnızca düşünmeyi değil, araç çağrısını da yönetir

Bu, çoğu ekibin kaçırdığı ve en pahalıya patlayan ayrıntı. `effort`, _bütün tokenları_ yönetir — araç çağrıları dâhil. Yani çabayı düşürdüğünüzde model yalnızca daha kısa düşünmez, **daha az araç çağırır**.

Ajan iş yüklerinde bunun sonucu doğrudan davranışsaldır: düşük çaba, daha az araştırma, daha az doğrulama ve daha yüzeysel bir sonuç demektir. Dokümantasyonun kendi ifadesiyle çaba, katı bir token bütçesi değil _davranışsal bir sinyaldir_.

<div class="callout"><strong>İpucu:</strong> Çabayı bir kalite kadranı gibi kullanın, bir maliyet kısıcı gibi değil. Maliyeti kısmak istiyorsanız önce modeli değiştirin (yönlendirme), sonra bağlamı küçültün, en son çabayı düşürün. Sıralamayı tersine çevirmek, ucuzlatırken sessizce kaliteyi düşürür.</div>

## Görev bütçeleri: yeni bir ilkel

2026 ortasında gelen **görev bütçesi** (task budget), tek bir istek yerine _tüm ajansal döngü_ için verilen tavsiye niteliğinde bir token bütçesidir ve modele görünür bir geri sayım sunar. Beta başlığıyla kullanılır ve asgari değeri **20.000 token**'dır.

İki davranışsal özelliği bilinmezse yanlış kullanılır. Birincisi: **katı bir tavan değil, bir ipucudur** — model bütçeyi aştığında istek kesilmez, model kendini ona göre ayarlar. İkincisi ve daha önemlisi: **yetersiz bir bütçe reddetme benzeri davranış üretir**. Model, bitiremeyeceği bir işe başlamak yerine kapsamı daraltır veya işi yapmaz. Yani 20 bin token'lık bir bütçeyle otuz dosyalık bir yeniden düzenleme istemek, ucuz bir sonuç değil, yapılmamış bir iş verir.

## Önbellek tuzağı

Bu, ölçtüğünüzde şaşırtan ve dokümante edilmiş bir davranış: **çaba seviyesini konuşma ortasında değiştirmek, prompt önbelleğinizi geçersiz kılar.** Sebep basit — çaba ve düşünme ayarları prompt'a işlenir, yani ön ek değişir ve önbellek isabet etmez. Aynı şey eski `budget_tokens` için de geçerliydi.

Pratik kural: **çabayı iş yükleri arasında değiştirin, önbelleklenmiş bir oturumun içinde değil.** "Kolay sorularda düşük, zor sorularda yüksek çaba" gibi görünüşte zekice bir optimizasyon, aynı oturum içinde uygulandığında önbellek kazancınızı silip maliyeti artırabilir.

```python
# YANLIS: ayni oturumda cabayi degistirmek onbellegi bozar
for soru in sorular:
    caba = "low" if kolay(soru) else "high"
    yanit = model(oturum, soru, effort=caba)      # her degisimde cache miss

# DOGRU: is yukune gore ayir, oturum icinde sabit tut
kolay_akis = Akis(effort="low")     # siniflandirma, ozetleme
zor_akis   = Akis(effort="high")    # analiz, kod uretimi
for soru in sorular:
    (kolay_akis if kolay(soru) else zor_akis).calistir(soru)
```

## Daha fazla düşünmenin zarar verdiği yer

Sezgi, daha fazla düşünmenin daha iyi cevap verdiğini söyler. 2026'da yayımlanan iki çalışma bu sezgiyi sınırlıyor.

Birincisi (arXiv:2604.10739, 12 Nisan 2026), yüksek bütçelerde marjinal getirinin çöktüğünü ve modellerin _önceden doğru bulmuş oldukları cevapları terk ettiğini_ gösteriyor. Aynı çalışmanın daha kullanışlı bulgusu şu: optimum düşünme uzunluğu zorluğa göre değişiyor, dolayısıyla her soruya aynı bütçeyi vermek kanıtlanabilir biçimde optimalin altında.

İkincisi (arXiv:2606.00376, 29 Mayıs 2026) daha mimari bir sınır çiziyor: durum takibi gerektiren görevlerde araç-entegre akıl yürütme **%76–94** başarı elde ederken, saf düşünce zinciri **%17–42**'de kalıyor. Belirli bir derinlik eşiğinin ötesinde yardımsız doğruluk %50'nin altına düşüyor ve ince ayar bunun 3 puandan azını geri kazanıyor. Yani bu bir eğitim eksikliği değil, mimari bir tavan.

Bu iki bulgunun ortak mühendislik sonucu net: **durum takibi gerektiren işlerde daha çok düşünmeyi değil, araç kullanmayı satın alın.** Sayma, sıralama, tarih hesabı ve çok adımlı durum güncellemesi gibi işlerde bir hesap makinesi aracı, en yüksek çaba seviyesinden hem daha ucuz hem daha doğrudur.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Düşünme tokenları görünmez ama faturalıdır; sabit fiyat yerine görev başına maliyet ölçün.</li><li>Elle düşünme bütçesi kullanımdan kalktı; 4.7 ve sonrasında 400 döner — <code>adaptive</code> + beş seviyeli <code>effort</code> kullanın.</li><li>Çaba araç çağrısı sayısını da değiştirir; düşük çaba daha az araştırma demektir, sadece daha kısa düşünme değil.</li><li>Çabayı oturum içinde değiştirmek prompt önbelleğini geçersiz kılar — iş yükleri arasında ayırın.</li></ul></div>

<div class="faq"><details><summary>Akıl yürüten modellerde düşünme tokenları için ödüyor muyum?</summary><p>Evet. Model cevaba varmadan önce ürettiği ara metin de ücretlendirilir ve kullanıcı arayüzünde görünmez. Bu yüzden aynı prompt farklı çalıştırmalarda farklı tutar ve maliyet planlaması istek başına değil görev başına yapılmalıdır.</p></details><details><summary>Effort seviyesi nedir, hangisini seçmeliyim?</summary><p>Modelin ne kadar çaba harcayacağını belirleyen beş kademeli bir kadrandır: low, medium, high, xhigh, max; varsayılan high. Sınıflandırma ve özetleme gibi dar işlerde low veya medium yeterlidir; analiz, kod üretimi ve çok adımlı ajan görevlerinde high ve üzeri anlamlıdır. Karşılaştırmayı kendi görev setinizde yapın.</p></details><details><summary>Akıl yürüten model ne zaman gereksiz?</summary><p>Görev tek adımlı ve kalıp tanımaya dayanıyorsa — sınıflandırma, çıkarım, biçim dönüştürme — akıl yürütme yalnızca maliyet ve gecikme ekler. Durum takibi gerektiren işlerde ise daha fazla düşünmek yerine araç vermek daha doğru sonuç verir; yayımlanmış ölçümlerde aradaki fark çok büyük.</p></details></div>

---

Akıl yürütmenin ne olduğunu değil, ne tuttuğunu bilmek üretimde daha belirleyici. Test zamanı hesaplamanın ne olduğu için [akıl yürüten modeller](/posts/akil-yuruten-modeller/), diğer maliyet kaldıraçları için [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/), ve her soruyu doğru modele göndermek için [model yönlendirme ve kademeleme](/posts/model-yonlendirme-kademeleme/) yazılarına bakabilirsiniz.
