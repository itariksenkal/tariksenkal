---
title: "Bağlam Sıkıştırma mı, Sıfırlama mı? Uzun Ajan Oturumlarında Ne Yapmalı"
description: "Bağlam penceresi dolduğunda ne yapmalı? context editing, clear_tool_uses stratejisi, sunucu tarafı compaction ve bağlam sıfırlama arasında somut bir karar kuralı."
publishDate: "2026-08-13T23:56:00+03:00"
lang: tr
category: "Mimari"
tags: ["Mimari", "Yapay Zeka"]
translation: "context-compaction-and-reset"
heroImage:
  src: "../../../assets/blog/covers/baglam-sikistirma-ve-sifirlama.jpg"
  alt: "Bağlam Sıkıştırma mı, Sıfırlama mı? Uzun Ajan Oturumlarında Ne Yapmalı"
---

Ajanınız kırk araç çağrısı sonra hâlâ çalışıyor, bağlam penceresi %80 dolu ve fatura her turda büyüyor. Elinizde üç seçenek var: eski araç sonuçlarını silmek, konuşmayı özetletmek, ya da her şeyi kapatıp temiz bir oturumla baştan başlamak. Bunların üçü de aynı şey değil ve yanlışını seçmek sadece para değil, doğruluk da kaybettirir. Bu yazıda üçünü API düzeyinde ayırıyor, hangi durumda hangisini seçeceğinizin kuralını veriyorum.

## Üç farklı işlem, üç farklı sonuç

Türkçede üçü de "bağlamı toparlamak" diye anlatılıyor ama teknik olarak farklı yerlerde duruyorlar. Ayrımı net koyalım:

| İşlem | Ne yapar | Ne kaybeder |
| --- | --- | --- |
| **Bağlam düzenleme** (context editing) | Eski araç çağrısı sonuçlarını konuşma geçmişinden _siler_; kalan mesajlar aynen durur | Silinen araç çıktılarının içeriği — model artık onları göremez |
| **Sıkıştırma** (compaction) | Konuşmanın tamamını modele _özetletir_ ve özeti yeni geçmiş olarak koyar | Ayrıntı ve kesinlik; özet, özetleyen modelin yorumudur |
| **Sıfırlama** (context reset) | Oturumu kapatır; yeni oturum yalnızca _sizin yazdığınız_ devir notuyla başlar | Örtük her şey — ajanın "aklında tutup" yazıya dökmediği hiçbir şey taşınmaz |

> Düzenleme yeri açar, sıkıştırma anlamı korumaya çalışır, sıfırlama ise ajana temiz bir zihin verir.

Üçünün _maliyet_ profili de farklı. Düzenleme bedavaya yakındır: yalnızca kısalan istemin token'ını ödersiniz. Sıkıştırma bir ek çıkarım demektir — tüm geçmişi bir kez daha girdi olarak okursunuz. Sıfırlama, devir notunu siz yazdığınız (veya ajana kısa bir görevle yazdırdığınız) için en ucuzudur ama en çok disiplin isteyenidir.

## Bağlam düzenleme: araç sonuçlarını budamak

Bu artık elle yazdığınız bir desen değil, API tarafında adı olan bir ilkel. Claude API'sinde `context_management` alanı altında **stratejiler** tanımlanıyor. En çok kullanılanı `clear_tool_uses_20250919`: bağlam belli bir eşiği aştığında en eski araç çağrısı sonuçlarını temizler.

```text
import anthropic

client = anthropic.Anthropic()

resp = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    betas=["context-management-2025-06-27"],
    tools=[{
        "name": "read_file",
        "description": "Diskteki bir dosyayı okur.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
    }],
    context_management={
        "edits": [{
            "type": "clear_tool_uses_20250919",
            "trigger": {"type": "input_tokens", "value": 60000},
            "keep": {"type": "tool_uses", "value": 5},
            "clear_at_least": {"type": "input_tokens", "value": 10000},
            "exclude_tools": ["read_file"],
            "clear_tool_inputs": False,
        }]
    },
    messages=[{"role": "user", "content": "Depoyu tara ve testleri düzelt."}],
)

print(resp.usage.input_tokens)
```

Alanların anlamı, varsayılanlarıyla birlikte:

-   **`trigger`:** Temizliğin devreye gireceği eşik. Varsayılanı `100000` girdi token'ı. Bu eşiğin altında hiçbir şey silinmez.
-   **`keep`:** En yeni kaç araç çağrısının korunacağı. Varsayılanı **3** araç kullanımı.
-   **`clear_at_least`:** Temizlik yapılacaksa en az bu kadar token kazanılsın; kazanç bu değerin altındaysa hiç uğraşılmaz. Sürekli tekrar eden minik temizlikler prompt önbelleğinizi boşuna geçersiz kılar — bu alan tam olarak onu engeller.
-   **`exclude_tools`:** Sonucu asla silinmeyecek araçların listesi. Ajanın sonraki adımda hâlâ referans vereceği bir dosya okumasını buraya koyun.
-   **`clear_tool_inputs`:** Varsayılan `false`; yani araç _çağrısının parametreleri_ durur, yalnızca _sonucu_ silinir. Bu iyi bir varsayılan: model neyi denediğini hatırlar, sadece çıktının tamamını görmez.

Ne olduğunu tahmin etmeyin, ölçün. Yanıt gövdesi ne yapıldığını raporluyor:

```python
edits = resp.context_management.applied_edits
for e in edits:
    print(e.type, e.cleared_tool_uses, e.cleared_input_tokens)
# clear_tool_uses_20250919 12 41883
```

<div class="callout"><strong>İpucu:</strong> <code>trigger</code> değerini pencere sınırına göre değil, <em>prompt önbelleği</em> davranışınıza göre seçin. Her temizlik, silinen noktadan sonrasının önbellek önekini geçersiz kılar. Eşiği düşük tutup sık temizlemek, kazandığınız token'dan daha fazlasını önbellek ıskası olarak geri ödetebilir.</div>

## Sıkıştırma: özetleyerek devam etmek

Bağlam düzenleme siler, sıkıştırma özetler. İkisi ayrı özellik ve birbirinin yerine geçmez. Sıkıştırma, geçmişi modele okutup yerine kısa bir anlatı koyar; böylece "ne yapmıştık" bilgisi ayrıntıdan arınmış hâlde hayatta kalır. Uygulama tarafında yıllardır elle yazılan desen buydu; artık sunucu tarafında bir ilkel olarak da mevcut (`compact_20260112`).

Kendi döngünüzü yazıyorsanız kritik nokta özetleme isteminin ne sorduğudur. Kötü özet "kullanıcı bir hata bildirdi, ajan dosyaları inceledi" der; iyi özet _karar verilebilir_ bilgiyi taşır:

```text
SIKISTIRMA_ISTEMI = """Aşağıdaki ajan oturumunu, çalışmaya kaldığı yerden
devam edebilecek bir ajanın okuyacağı şekilde özetle.
Şu dört başlığı doldur, başka hiçbir şey yazma:

1. HEDEF — kullanıcı ne istedi (tek cümle, değiştirme).
2. YAPILANLAR — hangi dosyalar değişti, hangi komutlar çalıştı,
   sonuçları ne oldu. Dosya yollarını ve komutları birebir yaz.
3. DOĞRULANMIŞ GERÇEKLER — denenip teyit edilmiş bilgiler
   (sürüm numaraları, şema alanları, hata mesajları). Tahmin yazma.
4. AÇIK SORULAR — henüz çözülmemiş, sıradaki adımı belirleyen sorular.

Kesinlik varsa kısalt ama silme: dosya yolu, komut ve hata mesajı
metinleri özetlenmez, aynen taşınır."""
```

Son cümle önemli. Sıkıştırmanın klasik hatası, ajanın bir sonraki adımda ihtiyaç duyacağı _birebir dizgeleri_ (dosya yolu, tablo adı, hata metni) "gereksiz ayrıntı" sayıp atmasıdır. Sonuçta ajan aynı dosyayı yeniden aramaya çıkar ve sıkıştırmayla kazandığınız token'ı geri harcar.

Sıkıştırmanın bir de sinsi yan etkisi var: özet, bir öncekinin özetinin özeti hâline gelir. Üç dört tur sonra elinizde giderek soyutlaşan, hiçbir somut ayrıntı taşımayan bir metin kalır. Buna karşı basit bir kural: **özetin özetini üretmeyin**. Sıkıştırma girdisi her zaman ham geçmiş olsun, bir önceki özet ise değişmeden en başa sabitlensin.

## Sıfırlama: temiz bir sayfa

Anthropic'in uzun süreli uygulamalar için koşum (harness) tasarımı üzerine mühendislik yazısı, sezgiye ters bir bulgu bildiriyor: uzun koşularda **bağlam sıfırlama, sıkıştırmayı geçiyor**. Gerekçesi tek cümlede özetleniyor — sıkıştırma ajana temiz bir sayfa vermiyor. Özetlenmiş bir geçmiş hâlâ bir geçmiştir: içindeki çıkmaz sokaklar, yanlış varsayımlar ve terk edilmiş yaklaşımlar soluklaşmış hâlde de olsa oradadır ve ajanı aynı yollara çekmeye devam eder.

Aynı çalışmadan çıkan ikinci kavram **bağlam kaygısı** (context anxiety): pencere dolmaya yaklaştıkça modelin işi erkenden toparlamaya, "şimdilik bu kadar yeterli" demeye eğilimi. Bu davranış sıkıştırmayla düzelmez, çünkü doluluk hissi geçmişin uzunluğundan gelir. Sıfırlama düzeltir.

Pratikte sıfırlama şuna benzer: ajan bir işi bitirir, sonuçlarını _dosyaya_ yazar, oturum kapatılır ve yeni oturum yalnızca o dosyaları okuyarak başlar. Dosya sistemi burada ajanlar arası iletişim kanalı olur — konuşma geçmişi değil.

```text
oturum-01/  ← kapandı, geçmişi atıldı
  NOTLAR.md       # devir notu (aşağıda)
  sema.sql        # doğrulanmış şema çıktısı
  hatalar.txt     # yeniden üretilebilir hata metinleri

oturum-02/  ← NOTLAR.md + sema.sql okunarak açıldı
```

## Devir teslim notu nasıl yazılır?

Sıfırlamanın tamamı bu nota bağlı. Not eksikse ajan ikinci oturumda ilk oturumun işini tekrar yapar. Not şişkinse sıfırlamanın anlamı kalmaz. İşe yarayan biçim şu üç kısıtı taşır: **sabit başlıklar**, **birebir dizgeler**, **üst sınır**.

1.  **Sabit başlıklar:** Serbest metin yerine şablon kullanın. Ajan her seferinde aynı dört başlığı doldurursa, ikinci oturum nereye bakacağını bilir.
2.  **Birebir dizgeler:** Dosya yolları, komutlar, sürüm numaraları ve hata metinleri kopyalanır, anlatılmaz.
3.  **Üst sınır:** Nota bir token bütçesi koyun (örneğin 1.500). Sınır yoksa not yavaşça yeni bir bağlam penceresine dönüşür.

```text
# DEVİR NOTU — oturum 01

## HEDEF
Fatura PDF ayrıştırıcısındaki KDV toplamı hatasını düzelt.

## DURUM
- Hata `parsers/invoice.py:212` içindeki `round()` çağrısında.
- `pytest tests/test_invoice.py -k vat` → 3 başarısız, 11 başarılı.
- Başarısız testlerin ortak yanı: kuruş kısmı .005 ile biten tutarlar.

## DOĞRULANMIŞ GERÇEKLER
- Proje Python 3.12 kullanıyor; `decimal.Decimal` bağımlılığı zaten var.
- `ROUND_HALF_UP` beklenen davranış (bkz. docs/muhasebe.md, satır 40).

## SIRADAKİ ADIM
`float` aritmetiğini `Decimal` + `ROUND_HALF_UP` ile değiştir,
sonra yalnızca `-k vat` testlerini çalıştır.

## DENENDİ, İŞE YARAMADI
- `round(x, 2)` yerine `math.floor(x*100)/100`: 2 test daha bozuldu.
```

Son başlık en çok atlanan ve en değerli olanıdır. "Denendi, işe yaramadı" listesi olmadan yeni oturum, eski oturumun çıkmaz sokağına aynı hevesle girer.

## Karar kuralı ve ölçüm

Üçü arasında seçim yapmak için işe yarayan sade bir kural:

1.  **Bağlamı şişiren şey araç çıktılarıysa → bağlam düzenleme.** Uzun dosya okumaları, arama sonuçları, HTTP yanıtları. Bunlar hacimlidir ve bir kez kullanıldıktan sonra çoğu zaman ölü yüktür. Önce bunu deneyin; en ucuz ve en az bilgi kaybettiren yol budur.
2.  **Bağlamı şişiren şey konuşmanın kendisiyse ve iş hâlâ aynı işse → sıkıştırma.** Çok turlu bir müzakere, uzun bir hata ayıklama diyaloğu. Süreklilik değerlidir, ayrıntı değil.
3.  **İş bir aşamayı bitirip yeni bir aşamaya geçiyorsa → sıfırlama.** "Araştırma bitti, şimdi yazacağız" ya da "tasarım onaylandı, şimdi uygulanacak". Aşama sınırı, temiz sayfanın doğal yeridir.
4.  **Ajan aynı hatayı üçüncü kez tekrarlıyorsa → sıfırlama, sıkıştırma değil.** Tekrar, geçmişin ajanı zehirlediğinin işaretidir; o geçmişi özetlemek zehri seyreltir, kaldırmaz.

Kuralı seçtikten sonra ölçün. Uzun oturumlarda takip etmeye değer üç sayı var: tur başına **girdi token'ı** (düzenlemenin işe yarayıp yaramadığını gösterir), **önbellek okuma oranı** (temizliğin önbelleği kırıp kırmadığını gösterir) ve **başarılı görev başına maliyet**. Sonuncusu tek gerçek hakemdir: token'ı yarıya indirip görev başarısını da yarıya indiren bir strateji hiçbir şey kazandırmaz.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Düzenleme siler, sıkıştırma özetler, sıfırlama temiz sayfa açar — üçü ayrı işlemdir, birbirinin yerine geçmez.</li><li><code>clear_tool_uses_20250919</code> varsayılanları: eşik 100.000 girdi token'ı, korunan son 3 araç kullanımı; <code>clear_tool_inputs</code> varsayılan olarak kapalıdır.</li><li>Uzun koşularda sıfırlama sıkıştırmayı geçer, çünkü özetlenmiş geçmiş de olsa geçmiş, ajanı eski çıkmazlara çeker.</li><li>Sıfırlamanın kalitesi devir notunun kalitesidir: sabit başlıklar, birebir dizgeler ve bir "denendi, işe yaramadı" listesi.</li></ul></div>

<div class="faq"><details><summary>Bağlam düzenleme ile prompt önbelleği birlikte çalışır mı?</summary><p>Çalışır ama dikkat ister. Her temizlik, silinen noktadan sonraki önbellek önekini geçersiz kılar; yani temizliğin hemen ardından gelen istek büyük olasılıkla önbellek ıskası yapar. <code>clear_at_least</code> alanı bu yüzden var: küçük kazançlar için önbelleği kırmayı engeller. Eşiği yüksek tutup seyrek ve büyük temizlik yapmak, sık ve küçük temizlikten genellikle daha ucuzdur.</p></details><details><summary>Sıkıştırmayı kendim mi yazmalıyım, sunucu tarafını mı kullanmalıyım?</summary><p>Özet biçimi üzerinde kontrol istiyorsanız kendiniz yazın — özellikle dosya yolları ve hata metinleri gibi birebir korunması gereken dizgeler varsa. Genel amaçlı bir sohbet ajanında sunucu tarafı sıkıştırma daha az kod demektir. İkisini birlikte kullanmayın; aynı geçmiş üzerinde iki farklı küçültme mantığı çalıştırmak öngörülemez sonuç verir.</p></details><details><summary>Sıfırlamadan sonra ajan bağlamı gerçekten kaybetmiyor mu?</summary><p>Kaybediyor — ve amaç bu. Taşınan tek şey sizin yazdığınız devir notu ve dosyalardır. Bu yüzden sıfırlama, notu yazacak disipline sahip sistemlerde işe yarar. Notu ajana yazdırıyorsanız, oturumu kapatmadan önce ayrı bir adımda ve sabit bir şablonla yazdırın; işin arasına sıkıştırılan bir "bu arada not al" talimatı düzenli olarak eksik not üretir.</p></details></div>

---

Özetle: bağlam yönetimi bir tercih değil, uzun ajan oturumlarının zorunlu altyapısıdır — ve doğru araç, bağlamı şişiren şeyin ne olduğuna bağlıdır. Pencerenin içine ne koyacağınızı [bağlam mühendisliği](/posts/baglam-muhendisligi/) yazısında, token faturasının nasıl küçüleceğini [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/) yazısında, bu döngüyü çalıştıran mimariyi ise [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/) yazısında bulabilirsiniz.
