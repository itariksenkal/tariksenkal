---
title: "Önek Önbellekleme Ekonomisi: Cache Ne Zaman Kâra Geçer?"
description: "Prompt caching okuması 0,1x, yazması 1,25x. Başabaş noktası iki istek. Peki önbelleğiniz neden sessizce çalışmıyor? Asgari önek, 20 blok kuralı ve paralel tuzağı."
publishDate: "2026-08-13T23:59:00+03:00"
lang: tr
category: "Maliyet"
tags: ["Maliyet", "Yapay Zeka"]
translation: "prefix-caching-economics"
heroImage:
  src: "../../../assets/blog/covers/onek-onbellekleme-ekonomisi.jpg"
  alt: "Önek Önbellekleme Ekonomisi: Cache Ne Zaman Kâra Geçer?"
---

Prompt caching'i açtınız, faturada bir şey değişmedi. Bu, Türkiye'deki ekiplerde gördüğüm en yaygın sessiz hatalardan biri — çünkü önbellekleme başarısız olduğunda hata vermez, sadece para kazandırmaz. Bu yazı iki şeyi yapıyor: önce önbelleğin ne zaman kâra geçtiğini aritmetikle gösteriyor, sonra sizinkinin neden çalışmadığını maddeleştiriyor. Türkçe kaynaklarda başabaş hesabını yapan bir sayfa yok; asıl eksik olan da bu.

## Önek önbellekleme aslında ne önbelleğe alır?

Bir dil modeli prompt'unuzu işlerken her token için ara temsiller üretir ve bunları dikkat mekanizmasının kullanacağı anahtar-değer çiftleri hâlinde tutar. Buna **KV önbellek** (KV cache) denir. Önek önbelleklemenin fikri basit: prompt'unuzun baştan başlayan sabit kısmı bir önceki istekle birebir aynıysa, o kısım için hesaplamayı tekrar yapmaya gerek yoktur.

> Önbellek eşleşmesi karakter bazlı ve ön ekten başlar — prompt'un başında değişen tek bir boşluk, o noktadan sonrasının tamamını geçersiz kılar.

Buradan çıkan tek kural her şeyi belirler: **sabit içerik başa, değişken içerik sona.** Sistem talimatınız, araç tanımlarınız ve az değişen doküman bağlamınız önde durmalı; kullanıcının o anki sorusu ve zaman damgası sonda. Prompt'un tepesine `Şu anki tarih: 13.08.2026 14:33` yazan bir satır koymak, teknik olarak önbelleklemeyi kapatmakla aynı şeydir.

## Başabaş aritmetiği: iki istek mi, üç istek mi?

Fiyatlandırma üç kalemden oluşur ve oranlar taban girdi fiyatına göre çarpan olarak verilir. Önbellekten **okuma yaklaşık 0,1×**; önbelleğe **yazma 5 dakikalık TTL'de 1,25×** ve **1 saatlik TTL'de 2×**.

Bu üç sayıyı bilince başabaş noktası hesap işine dönüşür. Aynı öneki _N_ kez kullanacaksanız, önbelleksiz maliyet `N × 1,0`; önbellekli maliyet `yazma + (N-1) × 0,1`.

```text
5 dakikalik TTL (yazma 1,25x)
  N=1 :  1,25          vs  1,00   -> zarar
  N=2 :  1,25 + 0,10 = 1,35  vs  2,00   -> kar
  N=5 :  1,25 + 0,40 = 1,65  vs  5,00   -> 3,0x tasarruf

1 saatlik TTL (yazma 2,00x)
  N=2 :  2,00 + 0,10 = 2,10  vs  2,00   -> hala zarar
  N=3 :  2,00 + 0,20 = 2,20  vs  3,00   -> kar
```

Yani **5 dakikalık TTL'de ikinci istekte, 1 saatlik TTL'de üçüncü istekte** kâra geçersiniz. Pratik sonuç şu: uzun TTL'yi otomatikman "daha iyi" saymayın. Öneki TTL süresi içinde en az üç kez kullanmayacaksanız, uzun TTL yazma primini geri kazandırmaz.

Ölçmek için tahmin yürütmeye gerek yok; API yanıtı kalemleri ayrı ayrı raporlar. Gerçek etkin çarpanınızı doğrudan hesaplayabilirsiniz:

```python
def etkin_carpan(kullanim, ttl="5m"):
    """Bir yanitin kullanim bloguna gore efektif girdi carpanini dondurur.
    1,0 = onbelleksiz taban maliyet. Kucukse tasarruf var."""
    yazma_carpani = 1.25 if ttl == "5m" else 2.0
    taze   = kullanim["input_tokens"]                  # onbelleklenmemis
    yazma  = kullanim["cache_creation_input_tokens"]   # bu istekte yazilan
    okuma  = kullanim["cache_read_input_tokens"]       # onbellekten gelen
    toplam = taze + yazma + okuma
    if toplam == 0:
        return 0.0
    agirlikli = taze * 1.0 + yazma * yazma_carpani + okuma * 0.1
    return agirlikli / toplam

# Ornek: 20.000 tokenlik sabit onek, 400 tokenlik soru
sicak = {"input_tokens": 400, "cache_creation_input_tokens": 0,
         "cache_read_input_tokens": 20000}
print(round(etkin_carpan(sicak), 3))   # 0.118  -> ~8,5x ucuz
```

<div class="callout"><strong>İpucu:</strong> Bu fonksiyonu üretimde bir metrik olarak yayınlayın. Önbellek isabet oranını değil <em>etkin çarpanı</em> izleyin — isabet oranı %90 görünürken kısa öneklerde çarpan 1,0'ın üstünde kalabilir. Faturayı belirleyen çarpandır.</div>

## Sessiz başarısızlık: asgari önek uzunluğu

Şimdi asıl mesele. Önbelleğe alınabilir bir öneğin bir **asgari token uzunluğu** vardır ve bu değer modele göre değişir. Daha kötüsü, tek yönlü de ilerlemez: en yeni modellerde **512 token**, bir önceki kuşakta **1.024 token**, ancak bazı ara kuşak modellerde **4.096 token**'dır.

Bu eşiğin altında kalırsanız istek başarısız olmaz. Hata dönmez, uyarı çıkmaz. Sadece `cache_creation_input_tokens` alanı `0` gelir ve siz aylarca önbelleğin çalıştığını sanırsınız. "Prompt caching'i açtık ama fatura değişmedi" şikâyetlerinin çoğunun kaynağı budur — model değiştirilmiş, önek eşiğin altında kalmıştır.

Çözüm, önbelleği açmak değil, açık olduğunu _doğrulamak_. Bunu bir kereye mahsus elle bakmak yerine dağıtım kapısına koyun:

```python
MIN_ONEK = {           # modele gore asgari onbelleklenebilir onek
    "yeni-kusak":  512,
    "onceki":     1024,
    "ara-kusak":  4096,
}

def onbellek_dogrula(yanit, model_sinifi, beklenen_onek_token):
    esik = MIN_ONEK[model_sinifi]
    k = yanit["usage"]
    yazildi = k.get("cache_creation_input_tokens", 0)
    okundu  = k.get("cache_read_input_tokens", 0)

    if beklenen_onek_token < esik:
        raise ValueError(
            f"Onek {beklenen_onek_token} token; {model_sinifi} icin asgari {esik}. "
            "Onbellek SESSIZCE devre disi. Onegi buyutun veya modeli degistirin.")

    if yazildi == 0 and okundu == 0:
        raise ValueError(
            "cache_creation ve cache_read ikisi de 0 — onbellek hic devreye girmedi. "
            "cache_control isaretini ve onek kararliligini kontrol edin.")
    return True
```

Bu kontrolü ilk isteğin ardından bir kez çalıştırmak yeterli. Sessiz başarısızlığı sesli hâle getirdiğiniz an sorun ortadan kalkar.

## Yirmi blok kuralı ve ajan döngüleri

Bir istekte en fazla **dört önbellek kesme noktası** (breakpoint) tanımlayabilirsiniz. Sistem bir kesme noktasından geriye doğru eşleşme ararken **en fazla 20 içerik bloğu** geri gider.

Bu, klasik bir sohbet uygulamasında hiç sorun çıkarmaz. Ajan döngülerinde ise doğrudan ısırır: her araç çağrısı ve her araç sonucu ayrı bir içerik bloğudur. Tek bir turda on araç çağıran bir ajan, yirmi bloğu bir çırpıda tüketir. Kesme noktanız geriye bakarken önceki öneğe ulaşamaz ve isabet sessizce kaybolur — üstelik tam da önbelleğin en çok işe yarayacağı yerde, yani uzun ajan koşularında.

-   **Kesme noktasını sona taşıyın:** öneğin başına değil, biriken geçmişin _en son_ kararlı noktasına koyun; böylece 20 bloğun geriye yürüyeceği mesafe kısalır.
-   **Araç sonuçlarını birleştirin:** beş küçük sonucu tek bir blokta toplamak, blok sayacını beşte bir yavaşlatır.
-   **Blok sayısını ölçün:** tur başına eklenen blok sayısı bir metrik olsun; 20'ye yaklaştığında önbellek zaten kaybolmuştur.

## Paralel istek tuzağı

Bu, ölçmeden asla fark edilmeyen bir davranış. Aynı öneke sahip **N isteği aynı anda gönderirseniz, hepsi tam fiyat öder.** Sebebi mantıklı: ilk isteğin önbelleği yazması bitmeden diğerleri yola çıkar, dolayısıyla okuyacakları bir şey yoktur.

Elli belgeyi aynı sistem talimatıyla sınıflandıran bir toplu işte bu, tasarrufun tamamının buharlaşması demektir. Doğru kalıp _ısıtma turu_: bir istek gönderin, ilk token gelene kadar bekleyin, sonra kalanları paralel açın.

```python
import asyncio

async def isit_ve_dagit(istekler, cagir):
    """Once tek istekle onbellegi yaz, sonra kalanini paralel calistir."""
    if not istekler:
        return []
    ilk = await cagir(istekler[0])          # onbellek burada yazilir
    kalan = await asyncio.gather(*(cagir(i) for i in istekler[1:]))
    return [ilk, *kalan]

# YANLIS: hepsi ayni anda -> N x tam fiyat, sifir isabet
# sonuclar = await asyncio.gather(*(cagir(i) for i in istekler))
```

Elli belgelik bir toplu işte bu tek satırlık fark, girdi maliyetini kabaca on kat aşağı çeker. Isıtma turunun eklediği gecikme ise tek bir isteklik.

## Önbelleği bozan şeyleri prompt'un sonuna itin

Önbelleği bozan şeylerin çoğu, kimsenin "içerik" saymadığı ayrıntılardır. Sistem talimatının içine gömülmüş bir oturum kimliği, kullanıcı adı, saat, A/B test bayrağı ya da rastgele sıralanmış bir araç listesi — hepsi öneği her istekte farklı kılar.

-   **Araç tanımlarını sabit sırada tutun:** bir sözlükten üretiyorsanız anahtarlara göre sıralayın; sıra değişimi önbelleği bozar.
-   **Zaman damgalarını sona koyun:** modelin tarihi bilmesi gerekiyorsa bunu kullanıcı mesajının yanında verin, sistem talimatının başında değil.
-   **Kişiselleştirmeyi ayırın:** kullanıcıya özel her şey öneğin dışında kalmalı; aksi hâlde önbellek kullanıcı sayısı kadar parçalanır.
-   **Model sürümünü sabitleyin:** takma adla (alias) çağırmak, sağlayıcı arkada sürüm yükselttiğinde önbelleğinizi sessizce sıfırlar.

Ve bu yazının en pratik kuralı: **önbelleklemeyi bir ayar değil, bir prompt mimarisi kararı olarak görün.** Önbellek dostu bir prompt, önce sabit-sonra değişken sırasıyla _tasarlanır_; sonradan bayrak açarak elde edilmez.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Okuma 0,1×, yazma 5 dk'da 1,25× ve 1 saatte 2× — başabaş sırasıyla ikinci ve üçüncü istektir.</li><li>Asgari önek modele göre 512, 1.024 veya 4.096 token; altında kalırsanız önbellek hatasız ve sessizce çalışmaz.</li><li>Kesme noktası geriye en fazla 20 blok yürür; ajan turları bu bütçeyi araç çağrılarıyla hızla tüketir.</li><li>Aynı önekli paralel istekler hepsi tam fiyat öder — önce bir ısıtma turu gönderin, sonra dağıtın.</li></ul></div>

<div class="faq"><details><summary>Prompt caching maliyeti gerçekten düşürür mü?</summary><p>Aynı öneki tekrar kullandığınız sürece evet, ve etki büyüktür: 20 bin token'lık sabit bir önekte etkin girdi çarpanı 1,0'dan yaklaşık 0,12'ye iner. Ancak tek seferlik isteklerde önbellek yazma primi yüzünden maliyeti <em>artırır</em>. Kural, öneği 5 dakikalık TTL'de en az iki, 1 saatlik TTL'de en az üç kez kullanmaktır.</p></details><details><summary>Önbelleğim neden çalışmıyor, hata da almıyorum?</summary><p>Neredeyse her zaman iki sebepten biri: öneğiniz modelin asgari uzunluğunun altında (512 / 1.024 / 4.096 token, modele göre) ya da önek her istekte değişiyor. İkisi de hata üretmez, sadece <code>cache_creation_input_tokens</code> ve <code>cache_read_input_tokens</code> sıfır kalır. Bu iki alanı bir doğrulama fonksiyonuyla dağıtım kapısına koyun.</p></details><details><summary>KV önbellek ile prompt caching aynı şey mi?</summary><p>Aynı mekanizmanın iki katmanı. KV önbellek, modelin çıkarım sırasında token başına ürettiği anahtar-değer temsillerini tutan alt yapıdır ve tek bir üretim içinde de kullanılır. Prompt caching ise bu temsillerin ortak öneke ait kısmını <em>istekler arasında</em> saklayıp faturaya indirimli yansıtan ürün katmanıdır.</p></details></div>

---

Önbellekleme, doğru kurulduğunda tek bir mimari kararla elde edilen en büyük maliyet kaldıracı. Diğer kaldıraçlar için [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/), prompt'u sabit ve değişken katmanlara ayırmanın yöntemi için [bağlam mühendisliği](/posts/baglam-muhendisligi/), ve bu doğrulamaları dağıtım hattına oturtmak için [MLOps ve üretime alma](/posts/mlops-uretim/) yazılarına bakabilirsiniz.
