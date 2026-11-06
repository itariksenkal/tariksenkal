---
title: "llms.txt İşe Yarıyor mu? Verilerin Söylediği ve v2'nin Getirdikleri"
description: "137.210 alan adı üzerinde yapılan sunucu günlüğü çalışması llms.txt'nin okunmadığını gösteriyor. Google da kullanmadığını söylüyor. Peki v2 neyi değiştirdi?"
publishDate: "2026-08-13T23:50:00+03:00"
lang: tr
category: "Ürün"
tags: ["Ürün", "Yapay Zeka"]
translation: "does-llms-txt-work"
heroImage:
  src: "../../../assets/blog/covers/llms-txt-ise-yariyor-mu.jpg"
  alt: "llms.txt İşe Yarıyor mu? Verilerin Söylediği ve v2'nin Getirdikleri"
---

Sitenizin köküne bir `llms.txt` koydunuz. Yapay zekâ motorlarının sitenizi daha iyi anlaması gerekiyordu. Peki gerçekten okuyorlar mı? Bu sorunun artık veriye dayalı bir cevabı var ve cevap rahatsız edici. Bu yazı, hem kanıtı hem de Ağustos 2026'da yayımlanan v2'nin neyi değiştirdiğini anlatıyor — ve sonunda, atıf almanızı gerçekten neyin sağladığına dair ölçülmüş bulguya geliyor. Bu siteyi yazan kişi olarak şunu belirteyim: `llms.txt` burada da yayımlanıyor. Yazı, kendi uygulamamı da sorgulayan bir yazıdır.

## llms.txt nedir?

`llms.txt`, sitenin kökünde duran ve dil modellerine sitenin en önemli sayfalarını markdown biçiminde tanıtan bir dosyadır. Fikir Eylül 2024'te Jeremy Howard tarafından ortaya atıldı ve mantığı sağlam: HTML gürültülüdür, bir model için temiz bir içindekiler tablosu daha kullanışlıdır.

> Fikir mantıklı; sorun, hiçbir tarayıcının onu istememesi.

## Sunucu günlükleri ne diyor?

Bu tartışmanın çözümü fikirle değil, sunucu günlükleriyle geldi. Ahrefs'in 15 Haziran 2026'da yayımladığı çalışma (Mayıs 2026 verisi, **137.210 alan adı**) şunları buldu:

-   Alan adlarının **%28'i** bir `llms.txt` yayımlıyor — yani benimseme gerçekten yaygın.
-   Ama bu dosyaların **%97'si hiç trafik almamış.**
-   Getirilen %3'lük kısımda isteklerin **%96'sı bot**, ve yalnızca **%19,5'i** adı bilinen yapay zekâ araçlarından geliyor.
-   En çarpıcı bulgu: **var olmayan `llms.txt` dosyaları için sıfır istek geldi.** Yani hiçbir sistem proaktif olarak bu dosyayı aramıyor.

Son madde tartışmayı bitiriyor. Bir dosyayı arayan yoksa, o dosyanın içeriğini iyileştirmenin bir etkisi olamaz.

## Google resmî olarak ne diyor?

Google'ın konumu kayıt altında. John Mueller'ın 6 Temmuz 2026'da aktarılan ifadesi net: Google `llms.txt` veya `llms-author.txt` kullanmıyor ve bunları kullandığını doğrulayan başka bir tarayıcı ya da dil modeli de bilinmiyor.

Google'ın yapay zekâ özellikleri dokümantasyonu da bunu destekliyor: `llms.txt`'den hiç bahsetmiyor. Adı geçen kontroller yalnızca `robots.txt`, `nosnippet` / `data-nosnippet` / `max-snippet` ve `noindex`. Aynı belge, "GEO" beklentisine de doğrudan cevap veriyor: AI Overviews veya AI Mode'da görünmek için ek bir gereklilik ya da özel bir optimizasyon yok.

<div class="callout"><strong>İpucu:</strong> Yapay zekâ tarayıcılarını yönetmek istiyorsanız kullanacağınız araç <code>llms.txt</code> değil <code>robots.txt</code>'dir — çünkü ilki okunmuyor, ikincisi okunuyor. Erişim politikanızı gerçekten uygulanan yere yazın.</div>

## Buna rağmen v2 çıktı: ne değişti?

İlginç olan şu: kanıtlar bu yöndeyken **llms.txt v2, Ağustos 2026'da yayımlandı** — v1'den iki yıl sonra, yine Jeremy Howard tarafından. Ve v2'nin getirdikleri, tam olarak "kimse aramıyor" sorununu hedefliyor:

-   **Keşfedilebilirlik için bağlantı ilişkileri.** Artık sayfadan dosyaya işaret edebiliyorsunuz: `rel="alternate" type="text/markdown"` ve `rel="describedby"`, hem `<link>` öğesi hem HTTP başlığı olarak. Yani dosyanın varlığını tahmin etmek yerine ilan ediyorsunuz.
-   **Esnek markdown URL biçimleri:** uzantıyı ekleyerek de (`/sayfa.md`) değiştirerek de (`/sayfa.html` → `/sayfa.md`) yayımlayabiliyorsunuz.
-   **Yol tabanlı kapsam:** bir dosya kendi yolunun altındaki sayfaları kapsıyor ve en özel dosya kazanıyor. Böylece sitenin yalnızca bir bölümünü yayımlayanlar da katılabiliyor.
-   **`llms_txt2ctx` genişletme aracı kaldırıldı** — ve onunla birlikte `Optional` bölümünün mekanik anlamı da.

Yani v2, standardın ana zayıflığını doğru teşhis etmiş. Bu teşhisin işe yarayıp yaramayacağını ise yine sunucu günlükleri söyleyecek, blog yazıları değil.

## Peki atıfları gerçekte ne artırıyor?

Asıl faydalı soru bu ve cevabı ölçülmüş. "What Gets Cited" çalışması (arXiv:2605.25517, 25 Mayıs 2026) **6 dil modelinde 252.000 deneme** yaptı; 18 içerik faktörünü ikili olarak değiştirdi, marka adlarını gizledi ve sıralamayı dengeledi. Bulgular:

-   **Konuyla ilgililik ve liste içindeki konum baskın.** Diğer her şey bunların yanında küçük kalıyor.
-   **Açık fiyat verisi ve güncel tarih damgaları atıf olasılığını tutarlı biçimde artırıyor.** Bu, uygulanabilir ve ucuz bir bulgu.
-   **Yalnızca biçimlendirmeye dokunan değişikliklerin etkisi neredeyse yok.**

Buna iki bağımsız korelasyon bulgusu eşlik ediyor. Ahrefs'in 26 Mayıs 2025'te 75.000 marka üzerinde yaptığı çalışmada, yapay zekâ görünürlüğüyle en güçlü ilişki **markadan bahsedilme**de (r=0,664), en zayıfı ise geri bağlantılarda (0,218). Ve aynı ekibin 11 Ağustos 2025 tarihli çalışması (15.000 istem), yapay zekâ tarafından atıf verilen URL'lerin yalnızca **%12'sinin** aynı sorgu için Google'ın ilk onunda yer aldığını gösteriyor. Her ikisi de **2025** verisidir; öyle etiketleyin.

Tıklama tarafındaki tablo ise ayrı bir gerçeklik: Ahrefs'in 300.000 anahtar kelimelik çalışması (4 Şubat 2026 güncellemesi), AI Overview varlığının ilk sıradaki sayfa için tıklama oranını **%58** düşürdüğünü buluyor — Nisan 2025'teki ölçümde bu %34,5'ti. Pew'in Mart 2025 verisi de aynı yöne bakıyor: yapay zekâ özeti görünen aramalarda kullanıcılar geleneksel bir sonuca **%8** oranında tıklıyor, özet yokken **%15**.

## Dengeli sonuç: ne yapmalı?

1.  **`llms.txt` yayımlayın, ama beklentiyi doğru kurun.** Maliyeti neredeyse sıfır, riski yok ve v2'nin bağlantı ilişkileriyle keşfedilebilirlik artabilir. Ama bunu bir trafik kaynağı değil, bir sigorta poliçesi olarak görün.
2.  **v2'nin `<link>` ilanını ekleyin.** Yapılacak tek gerçek iyileştirme bu: dosyanın varlığını sayfadan ilan edin.
3.  **Erişim politikanızı `robots.txt`'ye yazın.** Gerçekten uygulanan yer orası.
4.  **Bütçenizi içerik yapısına harcayın.** Ölçülen bulgu net: açık fiyat verisi, güncel tarih ve konu odaklılık atıf olasılığını artırıyor; biçimlendirme rötuşları artırmıyor.
5.  **Marka bahsi peşinde koşun.** Yapay zekâ görünürlüğüyle en güçlü ilişkiyi geri bağlantı değil, markadan bahsedilme gösteriyor.

Ve bir uyarı: bu alanda dolaşan sayıların önemli bir kısmı doğrulanabilir bir kaynağa dayanmıyor. Bir GEO iddiası duyduğunuzda tek soru yeterli: veri hangi tarihte, kaç örnek üzerinde ve kim tarafından toplandı? Cevabı olmayan iddia, bir görüştür.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>137.210 alan adı üzerinde yapılan çalışmada llms.txt yayımlayanların %97'si bu dosyaya hiç trafik almadı; var olmayan dosyalar için sıfır istek geldi.</li><li>Google, llms.txt kullanmadığını kayıt altına aldı ve AI Overviews için özel bir optimizasyon gerekmediğini belirtti.</li><li>v2 tam da keşfedilebilirlik sorununu hedefliyor: bağlantı ilişkileri, esnek markdown URL'leri ve yol tabanlı kapsam.</li><li>Ölçülen bulgu: açık fiyat verisi ve güncel tarih damgaları atıf olasılığını artırıyor, yalnızca biçimlendirme değişiklikleri artırmıyor.</li></ul></div>

<div class="faq"><details><summary>llms.txt nedir ve gerekli mi?</summary><p>Sitenin kökünde duran, dil modellerine sitenin önemli sayfalarını markdown olarak tanıtan bir dosyadır. Gerekli değil: sunucu günlüğü çalışmaları bu dosyaların büyük çoğunluğunun hiç istenmediğini gösteriyor. Maliyeti çok düşük olduğu için yayımlamak zarar vermez, ama bir trafik kaynağı olarak planlamayın.</p></details><details><summary>Google llms.txt kullanıyor mu?</summary><p>Hayır. Google sözcüsü, Google'ın llms.txt veya llms-author.txt kullanmadığını ve bunları kullandığını doğrulayan başka bir tarayıcı ya da dil modeli bilmediğini belirtti. Google'ın yapay zekâ özellikleri dokümantasyonu da yalnızca robots.txt, nosnippet, max-snippet ve noindex kontrollerinden bahsediyor.</p></details><details><summary>Yapay zekâ motorlarında görünürlük için ne yapmalı?</summary><p>Ölçülmüş bulgulara göre: konuya odaklı ve derin içerik yazın, açık fiyat verisi ve güncel tarih damgaları ekleyin, ve markadan bahsedilmeyi artırın — yapay zekâ görünürlüğüyle en güçlü ilişkiyi geri bağlantı değil marka bahsi gösteriyor. Yalnızca biçimlendirmeye dokunan değişikliklerin ölçülebilir etkisi bulunamadı.</p></details></div>

---

Bu alanda en değerli şey yeni bir taktik değil, hangi taktiğin ölçüldüğünü bilmek. Genel çerçeve için [üretken arama motoru optimizasyonu](/posts/uretken-arama-motoru-optimizasyonu/), yapay zekâ ürünlerinde içerik ve arayüz kararları için [yapay zeka ürün deneyimi](/posts/yapay-zeka-urun-ux/), ve modellerin metni nasıl işlediğini hatırlamak için [LLM nasıl çalışır](/posts/llm-nasil-calisir/) yazılarına bakabilirsiniz.
