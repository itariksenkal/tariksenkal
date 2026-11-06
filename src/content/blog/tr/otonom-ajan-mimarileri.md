---
title: "Otonom Ajan Mimarileri: Planla-Uygula, Ajan Filoları ve Maliyet Gerçeği"
description: "Ajanlar tek bir döngüden ibaret değildir. ReAct, planla-uygula, denetçi-işçi desenleri, heterojen model kullanımı ve ajan filolarında maliyeti kontrol etmenin yolları."
publishDate: "2026-08-09T23:34:00+03:00"
lang: tr
category: "Ajanlar"
tags: ["Ajanlar", "Yapay Zeka"]
translation: "autonomous-agent-architectures"
heroImage:
  src: "../../../assets/blog/bimg-12.jpg"
  alt: "Otonom Ajan Mimarileri: Planla-Uygula, Ajan Filoları ve Maliyet Gerçeği"
---

Bir ajanı ilk kez kurmak kolaydır: modele araç verirsiniz, döngüye sokarsınız, iş görür. Onu güvenilir, ucuz ve öngörülebilir hâle getirmek ise mimari bir problemdir. Ölçekte binlerce çağrı yapan sistemlerde **hangi işi hangi modelin yaptığı**, kalitenin ve faturanın tamamını belirler.

## Üç temel desen

-   **ReAct döngüsü:** Düşün, araç çağır, gözlemle, tekrarla. Basit ve esnektir; ama her adımda tüm bağlamı taşıdığı için uzun görevlerde pahalılaşır ve sapabilir.
-   **Planla-uygula:** Önce güçlü bir model tüm planı çıkarır, sonra adımlar ucuz modellerle yürütülür.
-   **Denetçi-işçi:** Bir koordinatör görevleri uzmanlaşmış alt ajanlara dağıtır ve sonuçları birleştirir.

## Planla-uygula neden ucuz

ReAct'te her adım en güçlü modele gider ve her adımda bağlam büyür. Planla-uygula bunu ayırır: pahalı akıl yürütme bir kez yapılır, tekrarlayan iş ucuz modele düşer. Frontier modeli her şey için kullanmaya kıyasla maliyette büyük düşüş sağlayabilir; sektörde yüzde doksana varan azalmalar rapor ediliyor.

<div class="callout"><strong>Takas:</strong> Plan baştan yapıldığı için, ortamda beklenmedik bir değişiklik olduğunda plan geçersizleşebilir. Bu yüzden pratik sistemler yeniden planlama tetikleyicisi barındırır.</div>

## Denetçi-işçi

Görev doğal olarak paralelleşiyorsa bu desen güçlüdür: her alt ajan dar bir işe odaklanır, kendi bağlamını taşır ve denetçiye yalnızca özet döner. Bağlam izolasyonu, ajan sistemlerinde en değerli özelliklerden biridir; bir alt görevin gürültüsü diğerlerini kirletmez.

Bedeli koordinasyon karmaşıklığıdır. Alt ajanlar çelişkili sonuç döndürdüğünde kararı kimin vereceği açıkça tanımlanmalıdır.

## Heterojen model kullanımı

| Katman | Model | İş |
| --- | --- | --- |
| Planlama | Güçlü, pahalı | Strateji, belirsizlik çözümü |
| Yürütme | Orta seviye | Standart adımlar, araç çağırma |
| Yüksek frekans | Küçük model | Sınıflandırma, çıkarım, biçimlendirme |

Tek model kullanmak basit ama pahalıdır. Katmanlı yaklaşımda asıl mühendislik işi, hangi adımın hangi katmana ait olduğuna karar vermek ve bunu ölçmektir.

## Döngüyü durdurmak

Otonom sistemlerin en yaygın üretim arızası sonsuz döngüdür: ajan aynı aracı tekrar tekrar çağırır, ilerleme olmaz, maliyet birikir. Her ajanın şu üç sınırı olmalıdır: maksimum adım sayısı, maksimum token bütçesi ve ilerleme kontrolü. İlerleme yoksa durmak, denemeye devam etmekten iyidir.

## Sık sorulanlar

<div class="faq"><details><summary>Çok ajanlı sistem her zaman daha mı iyi?</summary><p>Hayır. Görev doğal olarak sıralıysa tek ajan daha basit, ucuz ve hata ayıklanabilir olur. Çok ajanlı mimari gerçekten paralelleşen işlerde kazandırır.</p></details><details><summary>Ajan kararlarını nasıl izlerim?</summary><p>Her adımı; girdi, seçilen araç, çıktı ve token maliyetiyle birlikte kaydedin. İzlenemeyen bir ajan, hata ayıklanamaz.</p></details><details><summary>İnsan onayı nereye konmalı?</summary><p>Geri alınamaz eylemlerden hemen önce: para transferi, e-posta gönderimi, veri silme. Okuma işlemleri onaysız kalabilir.</p></details></div>

---

Ajan mimarisi, model seçiminden çok iş bölümü tasarımıdır. Devamı için [bağlam mühendisliği](/posts/baglam-muhendisligi/) ve [fonksiyon çağırma](/posts/fonksiyon-cagirma/) yazılarına bakabilirsiniz.
