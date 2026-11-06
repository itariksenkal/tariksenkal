---
title: "Ajan Koşum Mimarisi: Üretici-Değerlendirici Deseni ve Bağlam Kaygısı"
description: "Uzun süreli ajanlar neden yarım bırakır? Bağlam kaygısı, sıfırlamanın sıkıştırmayı yenmesi, üretici-değerlendirici ayrımı ve dosya üzerinden haberleşme."
publishDate: "2026-08-13T23:44:00+03:00"
lang: tr
category: "Mimari"
tags: ["Mimari", "Yapay Zeka"]
translation: "agent-harness-design"
heroImage:
  src: "../../../assets/blog/covers/ajan-kosum-mimarisi.jpg"
  alt: "Ajan Koşum Mimarisi: Üretici-Değerlendirici Deseni ve Bağlam Kaygısı"
---

Uzun süren bir ajan görevinde en tuhaf davranış şudur: ajan işi bitirmez, ama bitirmiş gibi yapar. Özet yazar, "tamamlandı" der ve durur — oysa yapılacak iş vardır. Bunun bir adı var artık ve nedeni de biliniyor. Bu yazı, tek bir ajan döngüsünün etrafına kurulan _koşum_ (harness) katmanını anlatıyor: hangi parçaların gerçekten fark yarattığını, hangilerinin maliyeti yirmi kat artırıp karşılığını verdiğini.

## Koşum nedir, ajandan farkı ne?

**Ajan**, model artı araçlar artı bir döngüdür. **Koşum**, o döngünün etrafına kurulan ve işin bittiğinden emin olmayı sağlayan yapıdır: görev bölme, ara çıktıların saklanması, ayrı bir değerlendirme adımı, yeniden deneme ve bağlam yönetimi.

> Ajan işi yapar; koşum işin gerçekten yapıldığını garantiye alır.

Farkın büyüklüğü ölçüldü. Anthropic'in 24 Mart 2026 tarihli koşum tasarımı çalışmasında aynı retro oyun görevi, yalın ajanla **20 dakika ve 9 dolar**, tam koşum altında **6 saat ve 200 dolar** sürdü. Aynı ekibin bir dijital ses iş istasyonu (DAW) inşası ise 3 saat 50 dakika ve 124,70 dolar tuttu. Yani koşum ucuz değil — ama üretime uygun çıktıyı veren oydu.

Bu tabloyu doğru okumanın yolu, koşumu bir "hızlandırma" değil bir _kalite sigortası_ olarak görmek. Yirmi kat maliyet, ancak çıktının doğru olmasının yirmi kat değerli olduğu işlerde mantıklıdır.

## Bağlam kaygısı: pencere doldukça acele etmek

**Bağlam kaygısı** (context anxiety), modelin bağlam penceresi dolmaya başladıkça işi erken toparlama eğilimidir. Anthropic bunu Claude Sonnet 4.5'te adlandırdı: model, kalan alanın azaldığını fark ettikçe işi bitirmeye çalışır, kalan adımları atlar ve "tamamlandı" der.

Bu, bir prompt sorunu değil bir mimari sorunudur ve iki pratik sonucu var. Birincisi: **pencerenin ne kadarının dolduğunu ajana hissettirmeyin.** Kalan token sayısını bağlama yazmak, kaygıyı tetikleyen en doğrudan yoldur. İkincisi: uzun görevi tek bir pencereye sığdırmaya çalışmak yerine, bölün.

<div class="callout"><strong>İpucu:</strong> Ajan "özetle ve bitir" moduna geçtiğinde bunu tespit etmek kolaydır: son iki turda yeni araç çağrısı yok ve çıktı özet dili kullanıyor. Bu deseni bir sonlanma sinyali değil, bir <em>uyarı</em> olarak işleyin — koşum bu noktada yeni bir oturum açmalı, görevi kabul etmemeli.</div>

## Sıfırlama, sıkıştırmayı neden yener?

Bağlam dolduğunda iki seçenek vardır: _sıkıştırma_ (compaction — geçmişi özetleyip devam etmek) veya _sıfırlama_ (yeni bir oturum açıp yalnızca gereken durumu taşımak). Sezgi sıkıştırmadan yana; ölçüm sıfırlamadan yana çıktı.

Gerekçe zarif: sıkıştırma ajana temiz bir sayfa vermez. Özet, önceki denemelerin izini, terk edilmiş yaklaşımları ve başarısız hipotezleri taşımaya devam eder; model bunları hâlâ bağlamında görür ve etkisi altında kalır. Sıfırlama ise gerçekten yeni bir başlangıçtır — taşınan tek şey, sizin bilinçli olarak seçtiğiniz durumdur.

```python
# Sıkıştırma yerine sıfırlama: taşınacak durumu SİZ seçersiniz
DEVIR_SABLONU = """Görev: {hedef}
Tamamlanan adımlar:
{tamamlanan}
Kalan adımlar:
{kalan}
Bilinen kısıtlar:
{kisitlar}
Not: Önceki denemelerin ayrıntısı bilinçli olarak aktarılmadı."""

def yeni_oturum(durum):
    devir = DEVIR_SABLONU.format(
        hedef=durum.hedef,
        tamamlanan="\n".join(f"- {a}" for a in durum.tamamlanan),
        kalan="\n".join(f"- {a}" for a in durum.kalan),
        kisitlar="\n".join(f"- {k}" for k in durum.kisitlar))
    return Oturum(sistem=SISTEM, ilk_mesaj=devir)   # temiz pencere
```

Buradaki asıl fark, özetin _kim tarafından_ yazıldığıdır. Modelin kendi geçmişini özetlemesi, kendi hatalarını da meşrulaştırır. Devir metnini yapılandırılmış bir durum nesnesinden üretmek, o riski ortadan kaldırır.

## Üretici-değerlendirici ayrımı

Koşumun en yüksek getirili tek parçası bu. Gözlem şu: **ajanlar kendi çıktılarını abartılı biçimde över.** Aynı modele "bu iş iyi mi" diye sorduğunuzda neredeyse her zaman evet der. Ama _bağımsız_ bir değerlendirici ajan tanımlayıp onu ayarlamak — yani neye bakacağını, hangi kanıtı toplayacağını, hangi eşiği kullanacağını yazmak — tamamen çözülebilir bir mühendislik işidir.

Pratik kurgu:

1.  **Üretici** işi yapar ve çıktıyı bir dosyaya yazar.
2.  **Değerlendirici** yalnızca çıktıyı ve başarı ölçütlerini görür — üreticinin akıl yürütmesini değil. Bu ayrım kritiktir; gerekçeyi gören değerlendirici ikna olur.
3.  Değerlendirici _somut_ bir sonuç döner: geçti/kaldı artı düzeltilmesi gereken maddeler.
4.  Üretici düzeltir; döngü en fazla N kez tekrarlanır.

Öznel kalitenin ölçülebilir hâle getirilmesi de aynı yerden çıkar: "arayüz güzel mi" sorusu değerlendirilemez, ama "üç ekran boyutunda taşma var mı, kontrast oranı 4,5:1'i geçiyor mu, boş durum ekranı var mı" sorulabilir. Değerlendiriciye öznel bir yargı değil, bir kontrol listesi verin.

## Sprint sözleşmesi ve dosya üzerinden haberleşme

**Sprint sözleşmesi**, üretici ile değerlendiricinin işe başlamadan önce test edilebilir başarı ölçütlerinde anlaşmasıdır. Bu, sonradan "ben bunu kastetmemiştim" tartışmasını ortadan kaldırır ve değerlendiriciye ölçecek somut bir şey verir. Anthropic'in kendi deneyimi burada ilginç bir düzeltme içeriyor: sprint yapısını sonradan _kaldırdılar_ — yani sözleşme fikri kalıcı, ama etrafındaki tören maliyeti getirisinden fazla olabiliyor. Kendi koşumunuzda da aynı testi yapın: her parçanın ölçülmüş bir katkısı yoksa çıkarın.

**Dosya tabanlı haberleşme** ise ajanlar arası kanalın en sağlam hâli. Ajanlar birbirine mesaj göndermek yerine dosya yazar ve okur. Avantajları somut: çıktı kalıcıdır ve çökme sonrası kaybolmaz, insan tarafından incelenebilir, sürüm kontrolüne girer, ve bağlam penceresine yalnızca gereken parça alınır.

```text
calisma/
  gorev.md            # sprint sozlesmesi: hedef + basari olcutleri
  plan.md             # ureticinin plani
  cikti/              # uretilen dosyalar
  degerlendirme-01.md # degerlendiricinin raporu (gecti/kaldi + maddeler)
  degerlendirme-02.md
  durum.json          # koşumun tuttuğu yapisal durum (devir icin)
```

## Ne zaman koşum kurmaya değmez?

Koşum bir maliyet kalemidir ve her işe değmez. Değmediği durumlar:

-   **Görev tek turda bitiyorsa.** Değerlendirici eklemek yalnızca gecikme ve maliyet ekler.
-   **Başarı ölçütü yazılamıyorsa.** Değerlendiriciye verecek somut bir ölçüt yoksa, değerlendirici de üreticinin kanaatini tekrarlar.
-   **Hata ucuzsa.** Yanlış çıktının maliyeti düşükse, yeniden çalıştırmak koşumdan ucuzdur.
-   **İş insan onayıyla ilerliyorsa.** Zaten bir insan değerlendirici varken ikinci bir model değerlendiriciye gerek yoktur.

Değdiği durum tektir ve nettir: **uzun, çok adımlı, çıktısı doğrulanabilir ve hatası pahalı işler.** Kod üretimi, veri dönüştürme, belge işleme hattı. Bu üç koşulu birlikte sağlamayan bir işte koşum kurmak, mühendislik değil süslemedir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Aynı görev yalın ajanla 20 dakika/9 dolar, tam koşumla 6 saat/200 dolar sürdü — koşum hız değil, kalite sigortasıdır.</li><li>Bağlam kaygısı gerçek: model pencere dolarken işi erken toparlar; kalan token bilgisini bağlama yazmayın.</li><li>Sıfırlama sıkıştırmayı yener çünkü özet, terk edilmiş yaklaşımların izini taşımaya devam eder.</li><li>Değerlendiriciye üreticinin gerekçesini değil, yalnızca çıktıyı ve kontrol listesini verin.</li></ul></div>

<div class="faq"><details><summary>Ajan koşumu nedir?</summary><p>Bir ajan döngüsünün etrafına kurulan ve işin gerçekten bittiğinden emin olmayı sağlayan katman: görev bölme, ara çıktıların dosyaya yazılması, bağımsız bir değerlendirme adımı, yeniden deneme ve bağlam yönetimi. Ajan işi yapar, koşum sonucu garantiye alır.</p></details><details><summary>Bağlam kaygısı nedir ve nasıl engellenir?</summary><p>Modelin bağlam penceresi dolmaya başladıkça işi erken toparlama, adımları atlama ve "tamamlandı" deme eğilimidir. Engellemenin iki yolu var: kalan token bilgisini bağlama koymamak ve uzun görevi tek pencereye sığdırmak yerine oturumlara bölmek.</p></details><details><summary>Sıkıştırma mı sıfırlama mı daha iyi?</summary><p>Uzun koşularda sıfırlama daha iyi sonuç veriyor, çünkü sıkıştırma ajana temiz bir sayfa vermez — özet, başarısız denemelerin izini taşımaya devam eder. Sıfırlamada taşınacak durumu siz seçersiniz; bunu modelin ürettiği bir özetten değil, yapılandırılmış bir durum nesnesinden üretin.</p></details></div>

---

Koşum, ajanı bir demo olmaktan çıkarıp bir üretim bileşenine çeviren katmandır. Döngünün mimari seçenekleri için [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/), değerlendiricinin neyi nasıl ölçeceği için [ajan değerlendirmesi](/posts/ajan-degerlendirmesi/), ve pencereye ne gireceğine karar vermenin disiplini için [bağlam mühendisliği](/posts/baglam-muhendisligi/) yazılarına bakabilirsiniz.
