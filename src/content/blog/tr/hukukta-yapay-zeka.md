---
title: "Hukukta Yapay Zekâ: Neden Kaynak Göstermeyen Sistem İşe Yaramaz"
description: "Hukuk alanında yapay zeka, doğruluğun denetlenebilir olmasını gerektirir. İçtihat araması, kaynağa dayandırma, atıf zorunluluğu, gizlilik ve nihai sorumluluğun neden avukatta kaldığı."
publishDate: "2026-08-09T23:26:00+03:00"
lang: tr
category: "Uygulama"
tags: ["Uygulama", "Yapay Zeka"]
translation: "ai-in-legal-practice"
heroImage:
  src: "../../../assets/blog/covers/hukukta-yapay-zeka.jpg"
  alt: "Hukukta Yapay Zekâ: Neden Kaynak Göstermeyen Sistem İşe Yaramaz"
---

Yapay zekanın en çok tartışıldığı alanlardan biri hukuk — ve iyi bir nedenle. Hukukta cevabın akıcı olması hiçbir şey ifade etmez; _nereden geldiği_ her şeydir. Kaynak gösteremeyen bir sistem, ne kadar ikna edici yazarsa yazsın, hukuki bir araç değildir.

## Asıl problem: doğrulanabilirlik

Bir avukat için yapay zekanın ürettiği metin bir başlangıçtır, bir sonuç değil. Dilekçeye giren her cümlenin arkasında denetlenebilir bir dayanak olmalıdır. Bu yüzden hukukta değerli olan model değil, **modelin cevabını kaynağa bağlayan mimaridir**.

Pratik ölçüt basittir: sistem bir iddiada bulunduğunda, o iddianın hangi karara, hangi maddeye ya da hangi belgeye dayandığını tek tıkla gösterebiliyor mu?

## Neden düz bir LLM yetmez

Genel amaçlı bir dil modeli, eğitim verisinden hatırladığı kalıplarla cevap üretir. Var olmayan bir karar numarası üretmesi teknik olarak şaşırtıcı değildir — model, gerçeği değil olasılığı takip eder. Hukukta bu tür bir hata, yalnızca yanlış değil, mesleki olarak risklidir.

<div class="callout"><strong>Temel kural:</strong> Hukuki bir yapay zeka sistemi, kaynağı olmayan bir iddiayı üretmemelidir. "Bilmiyorum" demek, ikna edici bir uydurmadan kıyaslanamayacak kadar değerlidir.</div>

## Anlam temelli içtihat araması

Klasik arama anahtar kelimeye bakar; hukukçu ise olayın hukuki niteliğini arar. Aynı hukuki durum, farklı kararlarda çok farklı kelimelerle anlatılabilir. [RAG mimarisi](/posts/rag-nedir-nasil-kurulur/) ve anlam temelli getirim tam da burada fark yaratır: sorgu, kelime örtüşmesine değil anlam yakınlığına göre eşleştirilir.

## Türkçe hukuk dilinin zorluğu

Türkçe eklemeli bir dildir ve hukuk dili kendi terminolojisini taşır. İngilizceye göre tasarlanmış genel modeller, [tokenizasyon](/posts/token-ve-embedding/) aşamasında bile verim kaybeder; hukuki terimler parçalanır, anlam dağılır. Alan verisiyle uyarlanmış modeller ve alanına özel embedding'ler bu farkı kapatır.

## Gizlilik ve sorumluluk

| Gereksinim | Neden |
| --- | --- |
| Veri izolasyonu | Dosya içeriği müvekkile aittir |
| Kaynak gösterimi | Denetlenebilirlik |
| İnsan onayı | Nihai sorumluluk avukatta |
| Kayıt ve izlenebilirlik | Hangi çıktı neye dayandı |

Son satır en önemlisidir: yapay zeka bir asistandır, vekil değildir. Muhakeme ve sorumluluk her koşulda avukatta kalır; sistem bunu zayıflatacak biçimde tasarlanmamalıdır.

## Sık sorulanlar

<div class="faq"><details><summary>Yapay zeka avukatın yerini alır mı?</summary><p>Hayır. Araştırma ve taslak süresini kısaltır; hukuki muhakemeyi, strateji seçimini ve sorumluluğu devralmaz.</p></details><details><summary>Uydurma karar riski nasıl azaltılır?</summary><p>Cevabı yalnızca getirilen belgelere dayandırarak, her iddiayı kaynakla eşleştirerek ve kaynak bulunamadığında cevabı reddederek.</p></details><details><summary>Müvekkil verisi modele gider mi?</summary><p>Mimariye bağlıdır. Kurumsal kullanımda veri izolasyonu, saklama süresi ve eğitimde kullanılmama garantisi sözleşmeyle netleştirilmelidir.</p></details></div>

---

Hukukta yapay zekanın değeri hızda değil, _denetlenebilir hızda_dır. Kaynağa bağlı üretim, bu alanda tercih değil zorunluluktur. Devamı için [RAG mimarisi](/posts/rag-nedir-nasil-kurulur/) ve [halüsinasyon azaltma](/posts/llm-halusinasyon-azaltma/) yazılarına bakabilirsiniz.
