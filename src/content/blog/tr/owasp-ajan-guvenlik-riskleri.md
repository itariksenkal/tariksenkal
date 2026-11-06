---
title: "OWASP Ajan Güvenliği İlk 10: ASI01'den ASI10'a Somut Karşılıklar"
description: "OWASP Agentic Top 10 (2026) listesinin her maddesini bir risk tanımı değil, uygulanabilir bir kontrole çeviriyoruz: yapılandırma, politika ve test karşılıkları."
publishDate: "2026-08-13T23:40:00+03:00"
lang: tr
category: "Güvenlik"
tags: ["Güvenlik", "Yapay Zeka"]
translation: "owasp-agentic-top-10"
heroImage:
  src: "../../../assets/blog/bimg-09.jpg"
  alt: "OWASP Ajan Güvenliği İlk 10: ASI01'den ASI10'a Somut Karşılıklar"
---

Ajan güvenliği üzerine Türkçe yazılanların neredeyse tamamı aynı şeyi yapıyor: riskleri listeliyor. Liste faydalı, ama bir listeyi okuyup kapattığınızda sisteminizde hiçbir şey değişmiyor. Bu yazı listeyi tekrar etmiyor; OWASP'ın 2026 ajan risk çerçevesindeki her maddeyi _bugün yazabileceğiniz bir kontrole_ çeviriyor. Her madde için tek bir soru soruyorum: bu riski hangi yapılandırma, hangi politika ve hangi test kapatır?

## İki çerçeve, sekiz ay arayla

2026, yapay zekâ güvenliğinde çerçevelerin yerine oturduğu yıl oldu. **OWASP Top 10 for Agentic Applications 2026** 9 Aralık 2025'te yayımlandı ve ajanlara özel on riski tanımladı. Sekiz ay sonra, 3 Ağustos 2026'da **OWASP GenAI LLM Top 10 2026** geldi — ve bu, gerçek olay verisinin ağırlık taşıdığı ilk baskı oldu (yaklaşık %25 olay verisi, %75 uzman uzlaşısı).

LLM listesindeki doğrulanmış hareketler ajan mühendisliği açısından anlamlı: Prompt Injection birinci sırada kaldı, Hassas Bilgi İfşası ikinci sırada kaldı, **Excessive Agency (aşırı yetki) üçüncülüğe yükseldi**, Unbounded Consumption dört basamak çıktı, çıktı işleme 5.'likten 10.'luğa düştü ve **System Prompt Leakage, Hidden Context Exposure adını aldı**. Prompt injection artık görüntü ve sese gizlenmiş çapraz-kipli saldırıları da kapsıyor.

> Yükselen her madde ajan kaynaklı: yetki, tüketim ve bağlam. Düşen madde ise klasik uygulama güvenliği olan çıktı işleme.

OWASP'ın çerçeveyi özetleyen cümlesi, bu yazının da tezi: kandırılamayan bir model kurmaya çalışmayı bırakın; modelin etrafındaki sistemi, model kandırıldığında — ki kandırılacak — önemli hiçbir şey kırılmayacak biçimde kurun.

## ASI01–ASI03: hedef, araç ve kimlik

-   **ASI01 — Agent Goal Hijack (ajan hedefinin ele geçirilmesi).** Kontrol: sistem talimatını ve kullanıcı hedefini her turda _yeniden_ enjekte edin ve araçtan dönen içeriği asla talimat kanalına koymayın. Test: hedefi değiştirmeye çalışan bir yük ile ajanı çalıştırıp, son turdaki hedefin ilk turdakiyle aynı olduğunu doğrulayan bir regresyon testi.
-   **ASI02 — Tool Misuse & Exploitation (araç kötüye kullanımı).** Kontrol: her araç için beyaz liste + parametre şeması + hız sınırı. Aracın kendisi de girdisini doğrulamalı; "model doğru parametre üretir" bir güvenlik varsayımı değildir. Test: şemaya uymayan çağrıların araç katmanında reddedildiğini gösteren birim testleri.
-   **ASI03 — Identity & Privilege Abuse (kimlik ve yetki istismarı).** Kontrol: ajan kendi kimliğiyle değil, _eylemi tetikleyen kullanıcının_ yetkisiyle çalışmalı. Kısa ömürlü, kapsamı daraltılmış token kullanın; ajanın servis hesabına geniş yetki vermeyin. Test: bir kullanıcının erişemeyeceği kaydı ajan üzerinden istediğinizde reddedildiğini gösteren bir entegrasyon testi.

## ASI04–ASI06: tedarik zinciri, kod yürütme, bellek

-   **ASI04 — Agentic Supply Chain (tedarik zinciri).** Kontrol: araç sunucularını ve eklentileri sürüm sabitleyin; araç tanımlarının özetini (hash) kayıt altına alın ve değiştiğinde dağıtımı durdurun. Bu, sonradan kötücül hâle gelen bir bağımlılığın en ucuz savunmasıdır.
-   **ASI05 — Unexpected Code Execution (beklenmeyen kod yürütme).** Kontrol: model ürettiği kodu yalnızca ağı kapalı, dosya sistemi salt-okunur, süre ve bellek sınırlı bir kapsayıcıda çalıştırsın. Kabuk erişimi varsayılan olmamalı; açıksa komut izin listesiyle açılmalı.
-   **ASI06 — Memory & Context Poisoning (bellek ve bağlam zehirlenmesi).** Kontrol: belleğe yazılan her kaydın kaynağını (provenance) saklayın ve güvenilmeyen kaynaktan gelen içeriği "gerçek" olarak değil "alıntı" olarak işaretleyin. Belleğe yazma işlemini de bir araç sayın: yani izin, şema ve denetim kaydı gerektirsin.

<div class="callout"><strong>İpucu:</strong> Bellek zehirlenmesinin en sinsi tarafı gecikmeli olmasıdır — saldırı bugün yazılır, üç hafta sonra tetiklenir. Bu yüzden bellek kayıtlarına yazılma zamanı, kaynak ve yazan oturum kimliği eklemek, olay sonrası incelemenin tek şansıdır.</div>

## ASI07–ASI10: iletişim, zincirleme hata, güven ve korsan ajanlar

-   **ASI07 — Insecure Inter-Agent Communication.** Kontrol: ajanlar arası mesajları kimlik doğrulamalı bir kanaldan geçirin ve her mesajın hangi ajandan geldiğini imzalayın. Bir ajanın diğerine gönderdiği metin, alan ajan için hâlâ _güvenilmeyen girdidir_.
-   **ASI08 — Cascading Failures (zincirleme hatalar).** Kontrol: devre kesici (circuit breaker), adım bütçesi ve alt-ajan sayısı üst sınırı. Bir alt-ajanın hatası üst ajanı yeniden denemeye sokuyorsa, üstel geri çekilme ve toplam bütçe olmadan sistem kendini boğar.
-   **ASI09 — Human-Agent Trust Exploitation.** Kontrol: onay ekranında ajanın _ne yapacağını_ değil, _hangi somut kaydı değiştireceğini_ gösterin. "Dosyaları temizleyeyim mi?" kötü bir onay; "şu 14 dosya silinecek" iyi bir onaydır. Onay yorgunluğu bir güvenlik açığıdır.
-   **ASI10 — Rogue Agents (korsan ajanlar).** Kontrol: envanter. Hangi ajanların hangi kimliklerle, hangi araçlara erişerek çalıştığını listeleyemiyorsanız, bu maddeyi kapatamazsınız. Zamanlanmış ve arka planda çalışan ajanları da envantere koyun.

## Politikayı koda dökmek

Yukarıdaki kontrollerin çoğu tek bir yerde toplanabilir: aracın çağrılmasından _önce_ çalışan bir izin kapısı. Aşağıdaki desen küçük ama gerçek — ASI02, ASI03 ve ASI09'u aynı anda karşılar:

```text
from dataclasses import dataclass

@dataclass(frozen=True)
class Izin:
    arac: str
    salt_okunur: bool          # yazan araçlar ayrı sınıf
    onay_gerekir: bool         # geri alınamaz eylemler
    azami_cagri: int           # oturum başına hız sınırı

POLITIKA = {
    "belge_ara":   Izin("belge_ara",   True,  False, 40),
    "belge_sil":   Izin("belge_sil",   False, True,   2),
    "eposta_gonder": Izin("eposta_gonder", False, True, 1),
}

class PolitikaHatasi(Exception):
    pass

def cagir(arac: str, argumanlar: dict, ctx) -> dict:
    izin = POLITIKA.get(arac)
    if izin is None:
        raise PolitikaHatasi(f"izin listesinde yok: {arac}")          # ASI02
    if ctx.sayac[arac] >= izin.azami_cagri:
        raise PolitikaHatasi(f"hiz siniri asildi: {arac}")            # ASI08
    if not ctx.kullanici_yetkili(arac, argumanlar):
        raise PolitikaHatasi("kullanici yetkisi yetersiz")            # ASI03
    if izin.onay_gerekir and not ctx.onay_alindi(arac, argumanlar):
        raise PolitikaHatasi("insan onayi bekleniyor")                # ASI09

    ctx.sayac[arac] += 1
    ctx.denetim_kaydi(arac, argumanlar)     # her cagri iz birakir
    return ARACLAR[arac](**argumanlar)
```

Bu kapının önemli özelliği, _modelin dışında_ olması. Modele "silme yapma" demek bir öneridir; kapıda `onay_gerekir` kontrolü bir kuraldır. Güvenlik önerilerden değil kurallardan doğar.

## Nereden başlamalı: 30 günlük sıra

1.  **Envanter (ASI10).** Ajanlar, kimlikleri ve araçları tablolayın. Bilmediğiniz ajanı koruyamazsınız.
2.  **İzin listesi ve şema (ASI02).** Yukarıdaki kapıyı kurun, varsayılanı "reddet" yapın.
3.  **Yetki daraltma (ASI03).** Servis hesabındaki geniş yetkileri kullanıcı bağlamına taşıyın.
4.  **İzolasyon (ASI05).** Kod yürütmeyi ağı kapalı bir kapsayıcıya alın.
5.  **Bütçe ve devre kesici (ASI08).** Adım, alt-ajan ve token üst sınırları koyun.
6.  **Denetim kaydı ve bellek kaynak takibi (ASI06).** Her araç çağrısı ve her bellek yazımı iz bıraksın.

Bu altı adım, on maddenin çoğunu pratikte kapatır. Kalanlar — tedarik zinciri sabitleme ve ajanlar arası imzalama — daha sonra gelebilir ama unutulmamalıdır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>OWASP'ın 2026 ajan çerçevesi risk listesi değil, kontrol listesi olarak okunmalı: her maddenin bir yapılandırma karşılığı var.</li><li>LLM Top 10 2026'da yükselen maddeler ajan kaynaklı: aşırı yetki üçüncülüğe, sınırsız tüketim dört basamak yukarı.</li><li>Araç izin kapısı modelin dışında olmalı; modele verilen talimat bir öneri, kapıdaki kontrol bir kuraldır.</li><li>Onay ekranı niyeti değil somut etkiyi göstermeli — onay yorgunluğu ASI09'un ta kendisidir.</li></ul></div>

<div class="faq"><details><summary>OWASP ajan güvenliği listesi nedir?</summary><p>OWASP Top 10 for Agentic Applications, 9 Aralık 2025'te yayımlanan ve ajan tabanlı sistemlere özgü on riski tanımlayan çerçevedir: hedef ele geçirme, araç kötüye kullanımı, kimlik ve yetki istismarı, tedarik zinciri, beklenmeyen kod yürütme, bellek zehirlenmesi, güvensiz ajanlar arası iletişim, zincirleme hatalar, insan-ajan güven istismarı ve korsan ajanlar.</p></details><details><summary>LLM Top 10 ile ajan listesinin farkı nedir?</summary><p>LLM Top 10 model merkezli riskleri kapsar — prompt injection, hassas bilgi ifşası, aşırı yetki gibi. Ajan listesi ise modelin araç kullanan, hafızası olan ve başka ajanlarla konuşan bir sistem hâline gelmesiyle ortaya çıkan riskleri kapsar. İkisi rakip değil, katmanlıdır; prompt injection ajan listesindeki on maddenin altısına dokunur.</p></details><details><summary>Küçük bir ekip bunların hepsini nasıl uygular?</summary><p>Hepsini uygulamayın; sırayla uygulayın. Envanter, araç izin kapısı ve yetki daraltma üç adımda riskin büyük kısmını kapatır ve hiçbiri özel bir ürün gerektirmez. İzolasyon ve bütçeler ikinci dalgada, tedarik zinciri sabitleme üçüncü dalgada gelebilir.</p></details></div>

---

Risk listesini kontrol listesine çevirdiğinizde ajan güvenliği bir korku konusu olmaktan çıkıp sıradan bir mühendislik işine dönüşür. Saldırının temel biçimi için [prompt injection](/posts/prompt-injection-guvenlik/), çıktı katmanındaki savunmalar için [guardrails ve içerik denetimi](/posts/guardrails-icerik-denetimi/), ve bu kontrollerin içine yerleşeceği döngü için [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/) yazılarına bakabilirsiniz.
