---
title: "Bağlam Mühendisliği: Prompt Mühendisliğinin Yerini Alan Disiplin"
description: "Bağlam mühendisliği, sınırlı bağlam penceresine her adımda hangi tokenların gireceğine karar verme disiplinidir. Bağlam çürümesi, ortada kaybolma, budama ve özetleme stratejileri."
publishDate: "2026-08-09T23:35:00+03:00"
lang: tr
category: "Mimari"
tags: ["Mimari", "Yapay Zeka"]
translation: "context-engineering"
heroImage:
  src: "../../../assets/blog/bimg-11.jpg"
  alt: "Bağlam Mühendisliği: Prompt Mühendisliğinin Yerini Alan Disiplin"
---

Birkaç yıl önce iyi bir yapay zeka ürünü kurmanın anahtarı doğru cümleyi bulmaktı. Bugün değil. Ajanlar çok adımlı çalışıyor, araç çağırıyor, belge okuyor ve her adımda bağlam penceresi doluyor. Asıl beceri artık akıllı bir talimat yazmak değil, **her adımda pencereye hangi tokenların gireceğine karar vermek** — yani bağlam mühendisliği.

## Prompt'tan bağlama

Tek soruluk bir sohbet için prompt mühendisliği yeterliydi. Bir ajan ise onlarca adım boyunca çalışır: araç çıktıları, ara sonuçlar, hata mesajları ve kullanıcı geçmişi birikir. Otuzuncu adımda modelin gördüğü şey, sizin yazdığınız talimat değil; o güne kadar biriken her şeydir.

Bağlam mühendisliği bu birikimi yönetir. Sorusu nettir: _bu adımda modelin doğru kararı vermesi için gereken en küçük yüksek sinyalli token kümesi nedir?_

## Bağlam çürümesi

Sezgiye aykırı ama tutarlı bir bulgu var: modeller bağlam büyüdükçe ölçülebilir biçimde kötüleşir. Pencere bir milyon token alıyor olsa bile, onu doldurmak performansı artırmaz — genellikle düşürür. Daha fazla bilgi vermek, daha iyi cevap almak anlamına gelmez.

<div class="callout"><strong>Temel ilke:</strong> Bağlam penceresi bir depo değil, bir çalışma masasıdır. Masaya ne kadar çok kâğıt koyarsanız, aradığınızı bulmak o kadar zorlaşır.</div>

## Konum önemlidir

Bilginin nerede durduğu, orada olup olmadığı kadar önemlidir. Modeller bağlamın başındaki ve sonundaki içeriği, ortasındakinden belirgin biçimde daha iyi kullanır — "ortada kaybolma" olarak bilinen etki budur.

Pratik sonuç: kritik talimatı en başa, en ilgili kanıtı en sona koyun. Uzun ve orta önemdeki dolgu metni ortada kalabilir.

## Dört temel strateji

-   **Seçmek:** Her şeyi değil, yalnızca bu adım için gerekli belgeleri getirin. Getirim kalitesi doğrudan bağlam kalitesidir.
-   **Sıkıştırmak:** Uzun araç çıktılarını ve geçmiş adımları özetleyin. Ham log yerine sonucu tutun.
-   **Budamak:** Artık ilgisiz hâle gelmiş ara adımları pencereden çıkarın. Ajan ilerledikçe eski hata mesajları gürültüdür.
-   **Dışarı taşımak:** Uzun durumu pencerede değil, dış bellekte tutun; gerektiğinde geri çağırın.

## Bağlam bütçesi kurmak

| Bölüm | Öneri | Not |
| --- | --- | --- |
| Sistem talimatı | Sabit, kısa | En başta |
| Araç tanımları | Yalnızca gerekli araçlar | Kullanılmayanı çıkarın |
| Getirilen kanıt | Bütçenin çoğu | Sona yakın |
| Konuşma geçmişi | Özetlenmiş | Ham tutmayın |
| Boşluk payı | Yüzde 20-30 | Cevap için yer bırakın |

Bütçeyi ölçün. Hangi bölümün kaç token yediğini bilmeyen bir ekip, gecikme ve maliyet sorunlarını körlemesine kovalar.

## Sık sorulanlar

<div class="faq"><details><summary>Uzun bağlamlı modeller RAG'i gereksiz kılmadı mı?</summary><p>Hayır. Uzun pencere, alakasız içeriği taşımayı ucuzlatmaz; yalnızca mümkün kılar. Getirim hâlâ hem kaliteyi hem maliyeti belirler.</p></details><details><summary>Özetleme bilgi kaybetmiyor mu?</summary><p>Kaybediyor, ve bu bilinçli bir takas. Kritik kimlikleri, sayıları ve kararları yapılandırılmış biçimde saklayıp anlatıyı özetlemek iyi bir orta yoldur.</p></details><details><summary>Nasıl ölçerim?</summary><p>Aynı görev setini farklı bağlam bütçeleriyle çalıştırın. Çoğu ekip, bağlamı kısalttığında doğruluğun arttığını görünce şaşırır.</p></details></div>

---

Bağlam mühendisliği, "modele daha çok şey ver" içgüdüsüne karşı disiplinli bir duruştur. Devamı için [RAG mimarisi](/posts/rag-nedir-nasil-kurulur/) ve [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/) yazılarına bakabilirsiniz.
