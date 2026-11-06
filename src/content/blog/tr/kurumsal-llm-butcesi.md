---
title: "Kurumsal LLM Bütçesi: Token Vergisi, Kur Riski ve TL Cinsinden Gerçek Maliyet"
description: "Türkçe metnin token maliyetini ölçtük, üstüne kur riskini ve önbellek ekonomisini koyduk: API mi kendi sunucun mu sorusunun TL cinsinden çalışan cevabı."
publishDate: "2026-08-13T23:42:00+03:00"
lang: tr
category: "Maliyet"
tags: ["Maliyet", "Yapay Zeka"]
translation: "enterprise-llm-budgeting"
heroImage:
  src: "../../../assets/blog/bimg-20.jpg"
  alt: "Kurumsal LLM Bütçesi: Token Vergisi, Kur Riski ve TL Cinsinden Gerçek Maliyet"
---

Yapay zekâ bütçesi hazırlarken karşılaşacağınız ilk sorun, elinizdeki bütün referansların İngilizce metin ve dolar üzerinden kurulmuş olması. Türkçe metin aynı içerik için daha fazla token tüketir, fatura dolarla gelir, geliriniz TL'dir ve gerçek maliyet birimi "milyon token" değil "başarılı görev"tir. Bu yazıda bu dört değişkeni tek bir çalışan modelde birleştiriyorum — sayıları uydurmadan, ölçerek.

## Yanlış birim: milyon token değil, başarılı görev

Sağlayıcılar fiyatı milyon token başına verir, bu yüzden herkes bütçeyi milyon token üzerinden kurar. Sorun şu: aynı işi iki model çok farklı token sayısıyla bitirir ve bazıları hiç bitiremez. Ucuz model üç kez deneyip başarısız olursa, pahalı modelden pahalıya gelmiştir.

> Bütçenin doğru birimi **başarılı görev başına maliyet**tir; milyon token bir girdi kalemidir, bir sonuç ölçüsü değil.

Bu artık ölçülen bir eksen. Artificial Analysis'in 15 Haziran 2026 tarihli Intelligence Index v4.1 çalışmasında görev başına maliyet, kabaca karşılaştırılabilir zekâ seviyelerinde **seksen katı aşan** bir yelpazeye yayılıyor: Claude Fable 5 için 3,25 dolar, Opus 4.8 (max) için 1,78 dolar, GPT-5.5 (xhigh) için 0,99 dolar ve DeepSeek V4 Pro (max) için 0,04 dolar. Yönlendirme (routing) mimarisinin bütün ekonomik gerekçesi bu tablodadır: her işi en pahalı modele göndermek bir mühendislik kararı değil, bir bütçe kazasıdır.

## Token vergisi: ölçülmüş hâli

Türkçe metnin daha fazla token tükettiği herkesin bildiği ama kimsenin ölçmediği bir iddia. Paralel bir metin çiftinde `o200k_base` tokenleştiricisiyle ölçtüğüm sonuç:

| Ölçüm | Türkçe / İngilizce |
| --- | --- |
| Aynı içerik için token sayısı | 80 / 54 → yaklaşık **1,48 kat** |
| Token başına karakter | 3,58 / 5,83 |

```text
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

def olc(metin: str) -> dict:
    n = len(enc.encode(metin))
    return {"token": n, "karakter_basina": round(len(metin) / n, 2)}

# Kendi korpusunuzdan 20-30 gercek ornek gecirin;
# blogdan oran kopyalamak butcenizi yaniltir.
```

Bu oranın bütçedeki karşılığı doğrudan: **Türkçe ağırlıklı bir iş yükünde girdi maliyetiniz, aynı işin İngilizce hâline göre yaklaşık yarı yarıya daha yüksektir** ve bu fark bağlam penceresine, ön dolum süresine ve dolayısıyla gecikmeye de yansır. Türkçe'nin neden bu şekilde tokenleştiğinin dilbilimsel açıklaması ayrı bir konu; [Türkçe tokenizasyonun teknik nedenleri](https://halideyilmaz.com/posts/tokenizasyon-turkce/) için bu yazıyı okuyun — burada işimiz, o oranı bütçeye çevirmek.

<div class="callout"><strong>İpucu:</strong> Oranı tek bir cümlede değil, kendi üretim günlüklerinizden çekeceğiniz 200 gerçek istekte ölçün ve <em>istek tipine göre</em> ayırın. Sistem talimatı çoğu zaman İngilizce, kullanıcı içeriği Türkçedir; ikisinin oranı farklıdır ve toplam maliyeti belirleyen karışımdır.</div>

## Önbellek ekonomisi: cache ne zaman kâra geçer?

Prompt caching, Türkçe iş yüklerinde token vergisini büyük ölçüde geri kazandıran tek kaldıraç — çünkü uzun ve sabit sistem talimatları tam olarak önbelleğe uygun parçadır. Fiyatlandırma mantığı şöyle: önbellek **okumaları** temel girdi fiyatının yaklaşık **0,1 katı**, **yazmaları** ise 5 dakikalık TTL'de **1,25 kat**, 1 saatlik TTL'de **2 kat**.

Başabaş noktası buradan çıkar ve şaşırtıcı derecede erkendir:

-   **5 dakikalık TTL:** 1,25 (yazma) + 0,1 (okuma) = 1,35 < 2,0 (iki kez önbelleksiz) → **iki istekte kâra geçer.**
-   **1 saatlik TTL:** 2,0 + 0,2 = 2,2 < 3,0 (üç kez önbelleksiz) → **üç istekte kâra geçer.**

Bütçe modelinde bunu ihmal etmek, sabit ön eki büyük olan sistemlerde maliyeti kolayca iki-üç katı fazla tahmin etmenize yol açar. Tersi de doğru: önbelleğin çalıştığını _varsayıp_ doğrulamamak, bütçeyi olduğundan düşük gösterir. Yanıttaki önbellek okuma ve yazma token sayılarını üretimde ölçün; sıfırsa önbellek çalışmıyordur.

## Kur riski: TL bütçenin görünmeyen kalemi

Hiçbir İngilizce kaynak bunu yazmaz, çünkü onların sorunu değil. Sizin sorununuz: fatura dolar, gelir TL. Yıllık bir bütçeyi sabit kurla planlamak, bütçenin en büyük tek riskini görmezden gelmektir. Model bunu içermeli:

```text
from dataclasses import dataclass

@dataclass
class Fiyat:
    girdi_usd_m: float        # milyon girdi token basina USD
    cikti_usd_m: float        # milyon cikti token basina USD
    cache_okuma_carpani: float = 0.10
    cache_yazma_carpani: float = 1.25   # 5 dk TTL

def aylik_maliyet_tl(fiyat: Fiyat, istek: int, girdi_tok: int, cikti_tok: int,
                     cache_orani: float, kur: float, kur_tamponu: float = 0.15) -> dict:
    """cache_orani: girdinin onbellekten okunan payi (0..1)."""
    m = 1_000_000
    onbellekli   = girdi_tok * cache_orani
    onbelleksiz  = girdi_tok - onbellekli

    girdi_usd = istek * (
        onbelleksiz / m * fiyat.girdi_usd_m
        + onbellekli / m * fiyat.girdi_usd_m * fiyat.cache_okuma_carpani)
    cikti_usd = istek * cikti_tok / m * fiyat.cikti_usd_m
    toplam_usd = girdi_usd + cikti_usd

    return {
        "usd": round(toplam_usd, 2),
        "tl_bugun": round(toplam_usd * kur, 2),
        "tl_tamponlu": round(toplam_usd * kur * (1 + kur_tamponu), 2),  # butceye bunu yazin
    }
```

Üç pratik kural. **Birincisi:** bütçeye bugünkü kuru değil, tamponlu kuru yazın — tamponu kendi finans ekibinizin varsayımından alın, buradaki %15 yalnızca bir yer tutucudur. **İkincisi:** aylık gerçekleşen tüketimi USD olarak takip edin, TL olarak değil; aksi hâlde kur hareketini tüketim artışı sanırsınız. **Üçüncüsü:** kur riskini azaltmanın en etkili yolu finansal değil mimaridir — token tüketimini düşüren her karar (önbellek, yönlendirme, küçük model, kısa çıktı) aynı zamanda kur riskini de düşürür.

## API mi kendi sunucum mu? Başabaş hesabı

Kendi sunucusunu kurma kararı Türkiye'de genellikle veri gizliliği gerekçesiyle gündeme gelir, sonra maliyetle gerekçelendirilmeye çalışılır. İkisini karıştırmayın: gizlilik bir gerekliliktir, maliyet bir hesaptır ve hesap çoğu zaman API'den yanadır.

Dürüst bir TCO şu kalemleri içermeli — ve ilk üç kalem dışındakiler neredeyse her zaman unutulur:

1.  **GPU** — satın alma amortismanı veya saatlik kiralama.
2.  **Barındırma** — elektrik, soğutma, ağ; ya da bulut örneği ücreti.
3.  **Boşta kalma** — en kritik kalem. API'de kullanmadığınızda ödemezsiniz; kendi sunucunuzda GPU gece boyunca da faturalanır. Günde 8 saat yoğunluk demek, kapasitenin üçte ikisinin boşa gitmesi demektir.
4.  **Mühendislik** — kurulum, sürüm yükseltme, kuantizasyon, nöbet. Bu genellikle donanımdan pahalıdır.
5.  **Kalite farkı** — açık ağırlıklı modelin görev başarısı düşükse, ek deneme maliyetini de yazın.

Pratik eşik şudur: **yükünüz sürekli ve yüksekse** (GPU'nun gerçek kullanım oranı yüksek), kendi sunucunuz kazanabilir. **Yükünüz değişkense veya düşükse**, API neredeyse her zaman ucuzdur. Melez kurulum çoğu ekip için en iyi cevaptır: yüksek hacimli ve dar kapsamlı işler (sınıflandırma, çıkarım, embedding) kendi sunucunuzda, düşük hacimli ve zor işler API'de.

## Maliyet dağıtımı ve devre kesiciler

Bütçe planlaması, harcamayı görebiliyorsanız işe yarar. İki şey gerekiyor. **Etiketleme:** her isteğe müşteri/ekip/özellik kimliği ekleyin ve maliyeti bu boyutlarda toplayın; bu, iç faturalandırmanın (chargeback) tek yoludur ve sonradan eklenmesi zordur. **Devre kesici:** günlük ve aylık üst sınır koyun, sınırın %80'inde uyarın, %100'ünde bloklayın.

```python
class ButceKesici:
    def __init__(self, gunluk_usd: float):
        self.limit = gunluk_usd
        self.harcanan = 0.0

    def izin_ver(self, tahmini_usd: float) -> bool:
        if self.harcanan + tahmini_usd > self.limit:
            return False                     # istek reddedilir, kuyruga alinir
        return True

    def kaydet(self, gercek_usd: float, etiketler: dict) -> None:
        self.harcanan += gercek_usd
        metrik_yaz("llm_maliyet_usd", gercek_usd, etiketler)  # ekip/musteri/ozellik
```

Bir uyarı: akıl yürüten modellerde çaba (effort) seviyesi yalnızca düşünme uzunluğunu değil _araç çağrısı sayısını da_ değiştirir. Yani maliyet tahmininizi girdi ve çıktı token sayısı üzerinden kuruyorsanız, ajan iş yüklerinde sistematik olarak eksik tahmin edersiniz. Ajan görevlerinde tahmini istek başına değil, _görev başına_ yapın.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Bütçenin birimi başarılı görev başına maliyettir; yayımlanmış ölçümlerde bu eksende seksen katı aşan bir yelpaze var.</li><li>Ölçtüm: Türkçe metin aynı içerik için yaklaşık 1,48 kat token tüketiyor — bütçeyi bu çarpanla kurun, kendi verinizde doğrulayın.</li><li>Önbellek iki (5 dk TTL) veya üç (1 saat TTL) istekte kâra geçer; çalıştığını varsaymayın, yanıttaki önbellek sayaçlarını ölçün.</li><li>Kur riskini bütçeye tamponlu yazın ve tüketimi USD olarak izleyin; token azaltan her mimari karar aynı zamanda kur riskini azaltır.</li></ul></div>

<div class="faq"><details><summary>Türkçe metin gerçekten daha mı pahalı?</summary><p>Evet, çünkü aynı içerik daha fazla token'a bölünüyor. Paralel bir metin çiftinde <code>o200k_base</code> ile ölçtüğüm oran yaklaşık 1,48 kat ve token başına karakter 5,83'ten 3,58'e düşüyor. Oran tokenleştiriciye ve metin türüne göre değişir; kendi korpusunuzda ölçün.</p></details><details><summary>API mi kullanmalıyım yoksa kendi sunucumu mu kurmalıyım?</summary><p>Yük sürekli ve yüksekse kendi sunucunuz kazanabilir; değişken veya düşük yükte API neredeyse her zaman ucuzdur, çünkü boşta kalan GPU'ya ödeme yapmazsınız. Hesaba mühendislik ve nöbet maliyetini de katın — genellikle donanımdan büyüktür. Veri gizliliği bir gerekliliktir ve maliyet hesabından ayrı değerlendirilmelidir.</p></details><details><summary>Yapay zeka bütçesinde kur riskini nasıl yönetirim?</summary><p>Bütçeyi tamponlu kurla planlayın, gerçekleşen tüketimi TL değil USD cinsinden izleyin ki kur hareketini hacim artışıyla karıştırmayın, ve asıl azaltmayı mimariden bekleyin: önbellekleme, model yönlendirme, kısa çıktı ve küçük model kullanımı döviz maruziyetini doğrudan küçültür.</p></details></div>

---

Bütçe, tahmin edilebilir hâle geldiğinde bir engel olmaktan çıkar. Maliyeti düşüren kaldıraçların tamamı için [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/), her işi doğru modele göndermenin mimarisi için [model yönlendirme ve kademeleme](/posts/model-yonlendirme-kademeleme/), ve ucuz tarafın ne kadar iş gördüğünü anlamak için [küçük dil modelleri](/posts/kucuk-dil-modelleri/) yazılarına bakabilirsiniz.
