---
title: "Küçük Dil Modelleri (SLM): Ne Zaman Büyük Modelden İyidir?"
description: "Küçük dil modelleri yüksek frekanslı, dar kapsamlı işlerde büyük modellerden daha uygun olabilir. Gecikme, maliyet, cihazda çalışma, ince ayar ve gerçekçi sınırlar."
publishDate: "2026-08-09T23:33:00+03:00"
lang: tr
category: "Modeller"
tags: ["Modeller", "Yapay Zeka"]
translation: "small-language-models"
heroImage:
  src: "../../../assets/blog/bimg-13.jpg"
  alt: "Küçük Dil Modelleri (SLM): Ne Zaman Büyük Modelden İyidir?"
---

Yapay zeka tartışması uzun süre tek yönde ilerledi: daha büyük model, daha iyi sonuç. Üretimde çalışan ekipler ise başka bir gerçekle karşılaştı — çoğu görev, en güçlü modeli gerektirmiyor. **Küçük dil modelleri** tam da bu boşlukta, dar ve tekrarlayan işlerde ciddi avantaj sağlıyor.

## Küçük ne demek

Kesin bir sınır yok; pratikte birkaç yüz milyon ile birkaç milyar parametre arasındaki modeller bu başlıkta anılıyor. Önemli olan sayı değil, sonuçları: tek bir GPU'ya, hatta bir dizüstü bilgisayara ya da telefona sığması, milisaniyeler mertebesinde yanıt vermesi ve çağrı başına maliyetinin ihmal edilebilir olması.

## Nerede kazanır

| Görev | Küçük model | Büyük model |
| --- | --- | --- |
| Sınıflandırma, etiketleme | Yeterli ve çok ucuz | Aşırı |
| Bilgi çıkarımı, biçimlendirme | Güçlü | Gereksiz maliyet |
| Yönlendirme, niyet tespiti | İdeal | Gecikme yaratır |
| Çok adımlı akıl yürütme | Zayıf | Gerekli |
| Geniş dünya bilgisi | Sınırlı | Üstün |

Kalıp nettir: girdi dar ve çıktı yapılandırılmışsa küçük model genellikle yeterlidir. Açık uçlu akıl yürütme gerekiyorsa büyük model kaçınılmazdır.

<div class="callout"><strong>Ajanlarda önemi:</strong> Bir ajan yüzlerce küçük karar verir. Bunların büyük çoğunluğu yönlendirme ve biçimlendirmedir. Bu adımları küçük modele almak, kaliteyi düşürmeden faturayı belirgin biçimde küçültür.</div>

## İnce ayar farkı kapatır

Genel kıyaslamalarda küçük modeller geride kalır. Ama dar bir görev için birkaç bin iyi örnekle ince ayar yapıldığında, o görevde büyük bir genel modeli yakalayabilir ve geçebilirler. [LoRA gibi verimli yöntemler](/posts/lora-ince-ayar/) bunu birkaç saatlik bir işe indirdi.

Buradaki asıl kazanç doğruluk değil, _öngörülebilirlik_tir: dar bir modelin nerede yanılacağını kestirmek çok daha kolaydır.

## Cihazda çalışma

Küçük modelin en belirgin üstünlüğü, veriyi hiç göndermeden çalışabilmesidir. Sağlık, hukuk ve kurumsal senaryolarda bu bir performans meselesi değil, bir uygunluk meselesidir. Ayrıca ağ gecikmesi ortadan kalkar ve çevrimdışı çalışma mümkün olur.

## Sınırları

Küçük modeller uzun bağlamda daha çabuk kaybolur, karmaşık talimat zincirlerini takip etmekte zorlanır ve nadir bilgi gerektiren sorularda daha sık uydurur. Bu yüzden pratik mimari genellikle karmadır: küçük model ilk hattı tutar, emin olamadığında büyük modele devreder.

## Sık sorulanlar

<div class="faq"><details><summary>Türkçe için küçük model yeterli mi?</summary><p>Göreve bağlı. Sınıflandırma ve çıkarım işlerinde evet; nüanslı üretim ve akıl yürütmede Türkçe verisi sınırlı küçük modeller zorlanabilir. Alan verisiyle ince ayar farkı kapatır.</p></details><details><summary>Nasıl karar veririm?</summary><p>Gerçek görev setinizde ölçün. Küçük modelin doğruluğu kabul edilebilir eşiğin üstündeyse, maliyet ve gecikme avantajı tartışmasızdır.</p></details><details><summary>Damıtma ile ilişkisi ne?</summary><p>Damıtma, küçük model üretmenin en yaygın yoludur: büyük model öğretmen olur, küçük model onun davranışını öğrenir.</p></details></div>

---

Küçük modeller büyük modellerin yerini almıyor; onların yanına doğru katmanı ekliyor. Devamı için [model damıtma](/posts/model-damitma/) ve [açık kaynak LLM'ler](/posts/acik-kaynak-llm/) yazılarına bakabilirsiniz.
