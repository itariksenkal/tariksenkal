---
title: "Model Yönlendirme ve Kademeleme: Her İşe Aynı Modeli Vermeyin"
description: "Yönlendirme, her isteği maliyeti ve yeteneği uygun modele göndermektir. Kademeli mimari, güven eşiği, kaçış yolu ve gerçek maliyet-kalite ölçümü."
publishDate: "2026-08-09T23:32:00+03:00"
lang: tr
category: "Mimari"
tags: ["Mimari", "Yapay Zeka"]
translation: "model-routing-cascades"
heroImage:
  src: "../../../assets/blog/covers/model-yonlendirme-kademeleme.jpg"
  alt: "Model Yönlendirme ve Kademeleme: Her İşe Aynı Modeli Vermeyin"
---

Çoğu yapay zeka ürünü tek bir modelle başlar ve öyle kalır. Trafik büyüdüğünde fatura da büyür, çünkü basit bir niyet tespiti ile karmaşık bir analiz aynı pahalı modele gitmektedir. **Yönlendirme** bu israfı ortadan kaldırır: her isteği, onu yapabilecek en ucuz modele gönderir.

## Yönlendirme ve kademeleme

İki farklı desen vardır. **Yönlendirme**, isteği görmeden önce sınıflandırıp doğrudan uygun modele gönderir; tek çağrı yapılır. **Kademeleme** ise önce ucuz modeli dener, sonuç yeterince iyi değilse pahalı modele yükseltir; bazen iki çağrı yapılır.

Yönlendirme daha ucuzdur ama sınıflandırma hatası doğrudan kaliteye yansır. Kademeleme daha güvenlidir ama en kötü durumda toplam maliyeti artırır.

## Kararı neye göre vermeli

-   **Görev tipi:** Özetleme, çıkarım ve biçimlendirme küçük modele; çok adımlı analiz büyüğe.
-   **Girdi uzunluğu ve karmaşıklığı:** Kısa ve tekil sorular genellikle küçük modelle çözülür.
-   **Riski:** Hatanın maliyeti yüksekse, tasarruf etmeyin.
-   **Gecikme bütçesi:** Kullanıcı bekliyorsa hız, kaliteden önce gelebilir.

<div class="callout"><strong>Basit başlayın:</strong> İlk yönlendirici bir LLM olmak zorunda değildir. Kural tabanlı bir sınıflandırıcı ya da küçük bir eğitilmiş model, çoğu trafiği doğru dağıtır ve neredeyse hiç maliyeti yoktur.</div>

## Güven eşiği ve kaçış yolu

Kademeli mimaride kritik soru şudur: ucuz modelin cevabının yeterli olduğunu nasıl anlarsınız? Pratik sinyaller şunlardır: modelin kendi belirttiği belirsizlik, çıktının şemaya uyup uymaması, getirilen kanıtla tutarlılık ve basit bir doğrulayıcı modelin onayı.

Her kademeli sistemin açık bir _kaçış yolu_ olmalıdır: eşiğin altında kalındığında ne olacağı baştan tanımlanmalı, belirsiz bırakılmamalıdır.

## Ölçmeden yönlendirme olmaz

| Ölçüt | Neden |
| --- | --- |
| Kademe başına doğruluk | Küçük model gerçekten yetiyor mu |
| Yükseltme oranı | Tasarruf gerçek mi |
| Uçtan uca gecikme | İki çağrı kullanıcıyı bekletiyor mu |
| İstek başına maliyet | Asıl hedef |

Yükseltme oranı yüzde altmışa çıkmışsa kademeleme işe yaramıyordur: hem ucuz hem pahalı çağrı yapılıyor, tasarruf yerine ek maliyet doğuyordur.

## Yaygın hatalar

En sık görülen üç hata: yönlendiriciyi asla yeniden değerlendirmemek, kademeleri aynı prompt ile çalıştırmak (küçük model farklı bir talimatla daha iyi olur) ve kalite düşüşünü izlememek. Maliyet düşüşü hemen görünür, kalite düşüşü haftalar sonra fark edilir.

## Sık sorulanlar

<div class="faq"><details><summary>Yönlendirici de bir maliyet değil mi?</summary><p>Evet ama küçüktür. Kural tabanlı ya da küçük modelli yönlendiricinin maliyeti, kazandırdığının yanında ihmal edilebilir.</p></details><details><summary>Önbellekleme ile birlikte kullanılır mı?</summary><p>Kesinlikle. Yönlendirmeden önce önbelleğe bakmak en ucuz adımdır; tekrar eden istekler hiç modele gitmez.</p></details><details><summary>Kaç kademe olmalı?</summary><p>Genellikle iki yeterlidir. Üç kademe, karmaşıklığı ve hata ayıklama yükünü kazançtan hızlı artırır.</p></details></div>

---

Yönlendirme, kaliteden ödün vermeden ölçeklenmenin en doğrudan yoludur ve çoğu ekibin en geç kaldığı optimizasyondur. Devamı için [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/) ve [küçük dil modelleri](/posts/kucuk-dil-modelleri/) yazılarına bakabilirsiniz.
