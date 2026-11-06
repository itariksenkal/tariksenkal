---
title: "Bilgisayar Kullanan Ajanlar: Demo ile Üretim Arasındaki 60 Puanlık Uçurum"
description: "Bilgisayar kullanan ajan nedir, nasıl çalışır? OSWorld 2.0'ın açığa çıkardığı %83,5–%20,6 uçurumu, eylem döngüsü, Türkçe arayüz tuzakları ve güvenlik modeli."
publishDate: "2026-08-13T23:37:00+03:00"
lang: tr
category: "Ajanlar"
tags: ["Ajanlar", "Yapay Zeka"]
translation: "computer-use-agents"
heroImage:
  src: "../../../assets/blog/covers/bilgisayar-kullanan-ajanlar.jpg"
  alt: "Bilgisayar Kullanan Ajanlar: Demo ile Üretim Arasındaki 60 Puanlık Uçurum"
---

Bir demo videoda ajan tarayıcıyı açıyor, formu dolduruyor, dosyayı indiriyor ve hepsi kırk saniye sürüyor. Aynı ajanı gerçek bir iş akışına koyduğunuzda üç yüz adım sonra kayboluyor. Bu, kötü bir mühendislik hatası değil; ölçülmüş ve yayınlanmış bir kalıp. 2026'da yayımlanan iki kıyaslama sonucu arasındaki uçurum, bilgisayar kullanan ajanlar hakkında bilmeniz gereken en yararlı tek çerçeveyi veriyor. Bu yazıda o uçurumu, ajanın gerçek döngüsünü, Türkçe arayüzlerde bozulan şeyleri ve ne zaman ajan yerine düz otomasyon kullanmanız gerektiğini anlatıyorum.

## İki sayı: %83,5 ve %20,6

**Bilgisayar kullanan ajan** (computer use), bir modelin ekran görüntüsüne bakıp fare ve klavye eylemleri üreterek bilgisayarı bir insan gibi kullanmasıdır. OpenAI'nin kendi Türkçe yerelleştirmesi de bu ifadeyi kullanıyor; alanın Türkçesi budur.

Bu alandaki referans kıyaslama OSWorld. Birinci sürümünün doğrulanmış hâli (OSWorld-Verified) bugün pratikte doyuma ulaşmış durumda: en iyi sonuç **%83,5**. İnsan temel çizgisi ise aynı sette **%72,36**. Yani manşet okumak isteyen biri rahatlıkla "ajanlar insanı geçti" diyebilir.

OSWorld 2.0 (arXiv:2606.29537, 28 Haziran 2026) tam olarak bunu test etmek için yapıldı: 108 uzun ufuklu iş akışı, medyan insan tamamlama süresi yaklaşık 1,6 saat, görev başına ortalama **318 araç çağrısı**. Aynı sınıftaki en iyi model, 500 adımlık bütçeyle görevlerin yalnızca **%20,6**'sını tamamlıyor (kısmi puan %54,8).

> Aradaki 60 puanlık fark bir model kusuru değil; kısa görevle uzun görev arasındaki farkın ta kendisi.

Pratik sonuç şu: bir ajanın tek uygulamada, üç-beş adımda bittiğini gösteren bir demo, o ajanın üç yüz adımlık bir süreci yürütebileceğine dair hiçbir kanıt sunmaz. Satın alma kararınızı verirken sorulacak doğru soru "hangi kıyaslamada kaç aldı" değil, "kaç adımlık bütçeyle ölçülmüş" sorusudur.

## Döngü: algıla → yer belirle → uygula → doğrula

Her bilgisayar kullanan ajan aynı dört adımlı döngüyü çevirir. Kavramsal olarak:

```text
while not tamamlandi and adim < adim_butcesi:
    goruntu   = ekran_goruntusu_al()          # 1. algıla
    plan      = model(goruntu, hedef, gecmis) # 2. yer belirle + karar ver
    sonuc     = uygula(plan.eylem)            # 3. uygula (tıkla/yaz/kaydır)
    tamamlandi = dogrula(plan, ekran_goruntusu_al())  # 4. doğrula
    adim += 1
```

Bu döngünün maliyeti çoğu ekibi şaşırtıyor. Her adım en az bir ekran görüntüsü demektir; ekran görüntüsü görsel token demektir; 318 adımlık bir görev, aynı ekranın onlarca kez bağlama girmesi demektir. Bu yüzden ciddi uygulamalarda üç şey standarttır: eski ekran görüntülerini bağlamdan düşürmek, ekranı tam çözünürlükte değil küçültülmüş göndermek ve _adım bütçesi_ koymak.

<div class="callout"><strong>İpucu:</strong> Adım bütçesini bir güvenlik önlemi gibi düşünün, bir performans ayarı gibi değil. Bütçesiz bir ajan başarısız olduğunda durmaz — aynı üç ekran arasında sonsuza kadar gidip gelir ve faturayı siz ödersiniz. Bütçeye ek olarak "son N adımda ekran değişmediyse dur" kuralı, döngü kilitlenmelerinin çoğunu yakalar.</div>

## Piksel mi, erişilebilirlik ağacı mı?

**Yer belirleme** (grounding), "kaydet düğmesi" gibi bir niyeti ekrandaki bir koordinata çevirme işidir ve ajanların en kırılgan parçasıdır. İki yaklaşım var:

-   **Piksel tabanlı:** Model yalnızca ekran görüntüsüne bakar ve `(x, y)` üretir. Her uygulamada çalışır — oyun, uzak masaüstü, tuval tabanlı arayüz, hepsi. Karşılığında çözünürlük, ölçekleme (DPI) ve tema değişimlerine karşı kırılgandır.
-   **Erişilebilirlik ağacı / DOM tabanlı:** Model, arayüzün yapısal temsilini okur ve öğeyi kimliğiyle seçer. Çok daha kararlıdır ve doğrulanabilir; ama yalnızca bu ağacı düzgün yayınlayan uygulamalarda çalışır.

Üretimde işe yarayan yaklaşım genellikle melez: mümkün olduğunda yapısal seçici, olmadığında piksel. Kritik nokta _doğrulama_: eylemden sonra beklenen değişikliğin gerçekleştiğini ayrı bir kontrolle teyit edin. "Tıkladım" ile "tıklama işe yaradı" arasındaki farkı ölçmeyen bir ajan, hatasını üç yüz adım boyunca taşır.

## Türkçe arayüzlerde neler bozulur?

Bu, Türkçe içeriklerde neredeyse hiç yazılmamış bir konu ve gerçek bir hata kaynağı. En büyüğü **İ/ı sorunu**: ajanın gördüğü ekran metnini beklenen metinle karşılaştırırken standart `lower()` kullanırsanız Türkçe'de yanlış sonuç alırsınız. Bu davranış Python'da doğrudan doğrulanabilir:

```text
>>> "I".lower()          # Türkçe'de 'ı' olmalıydı
'i'
>>> "İ".lower()          # tek karakter değil, iki karakter döner
'i̇'                # 'i' + U+0307 (birleşen üstteki nokta)
>>> len("İ".lower())
2
>>> "ISTANBUL".lower()   # 'ıstanbul' değil
'istanbul'
```

Yani "İPTAL" yazan bir düğmeyi `metin.lower() == "iptal"` ile aramak, görünmez bir birleşen karakter yüzünden başarısız olur. Doğrusu, karşılaştırmadan önce Türkçe'ye özgü bir katlama uygulamak ve sonucu Unicode olarak normalleştirmektir:

```python
import unicodedata

def tr_katla(s: str) -> str:
    """Turkce arayuz metnini guvenli sekilde kucult ve normallestir."""
    s = s.replace("I", "ı").replace("İ", "i")   # I->ı, İ->i
    s = s.lower()
    return unicodedata.normalize("NFC", s)

assert tr_katla("İPTAL")    == "iptal"
assert tr_katla("ISTANBUL") == "ıstanbul"
```

Aynı ailede iki tuzak daha var. Birincisi **klavye düzeni**: Türkçe Q ve Türkçe F düzenlerinde noktalama tuşları farklı yerdedir, bu yüzden ajanın metin yazma eylemi ham tuş kodları yerine metin girişi (type/insert) üzerinden gitmelidir. İkincisi **tarih ve sayı biçimi**: ekranda `13.08.2026` ve `1.250,75` görürsünüz; bunları İngilizce varsayımıyla ayrıştıran bir doğrulama adımı sessizce yanlış sonuç üretir.

Son olarak bir sınır kuralı: **e-Devlet, bankacılık ve resmî başvuru akışlarını piksel tabanlı bir ajana otomatikleştirmeyin.** Bu akışlar geri alınamaz, kimliğe bağlı ve çoğu zaman sözleşmeyle yasaklı. Bir ajanın yanlış düğmeye tıkladığında "geri al" tuşu yoktur.

## Güvenlik: çözülmemiş sorun

Bilgisayar kullanan bir ajan tanım gereği _güvenilmeyen içeriğe bakıp eylem üretir_. Bu, dolaylı prompt injection için ideal zemindir: sayfadaki gizli bir metin ajana talimat gibi görünür ve ajan onu uygular. OpenAI Aralık 2025'te bunun "muhtemelen hiçbir zaman tam olarak çözülemeyeceğini" açıkça belirtti; Brave, Perplexity Comet üzerinde gizli sayfa öğeleriyle dolaylı enjeksiyonu gösterdi.

Bunun doğru okunuşu "ajan kullanmayın" değil, "ajanın yapabileceklerini daraltın". Üretimde işe yarayan sınırlar şunlar: ajanı ayrı bir sanal makinede veya kapsayıcıda çalıştırın; çıkış trafiğini yalnızca gereken alan adlarına izin veren bir listeyle kısıtlayın; oturum çerezlerini ve parola yöneticisini ajanın eriştiği profile koymayın; ve geri alınamaz her eylem için insan onayı isteyin. Ajanın gördüğü hiçbir metin, ajana verilmiş bir talimat değildir.

## Ne zaman ajan, ne zaman Playwright?

En pahalı hata, deterministik bir işi ajana yaptırmaktır. Karar tablosu:

| Durum | Doğru araç |
| --- | --- |
| Aynı sitede, aynı akış, günde binlerce kez | Ajan değil — Playwright/Selenium betiği |
| API'si olan bir sistem | Ajan değil — doğrudan API |
| Arayüzü sık değişen, düşük hacimli iş | Ajan mantıklı |
| Her seferinde farklı, tarif edilemeyen keşif işi | Ajanın asıl alanı |
| Geri alınamaz, kimliğe bağlı işlem | Ajan değil — insan |

Pratikte en sağlam mimari melezdir: ajan _keşfeder_, sonra bulduğu yolu deterministik bir betiğe çevirirsiniz. Ajanı her çalıştırmada yeniden keşfe göndermek, hem en pahalı hem en kırılgan seçenektir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Kısa görevlerde %83,5, 108 uzun ufuklu iş akışında %20,6 — demo ile üretim arasındaki fark budur.</li><li>Adım bütçesi ve "ekran değişmediyse dur" kuralı, sonsuz döngü faturasını engelleyen iki temel önlemdir.</li><li>Türkçe arayüzde <code>lower()</code> kullanmayın; <code>İ</code> iki karaktere dönüşür ve metin eşleştirmenizi sessizce bozar.</li><li>Deterministik ve yüksek hacimli işleri ajana değil betiğe verin; ajanı keşif için kullanın.</li></ul></div>

<div class="faq"><details><summary>Bilgisayar kullanan ajan nedir?</summary><p>Ekran görüntüsüne bakarak fare ve klavye eylemleri üreten, yani bilgisayarı bir insan gibi kullanan yapay zekâ ajanıdır. API'si olmayan veya erişimi kapalı sistemlerde otomasyonu mümkün kılar; karşılığında yavaş, pahalı ve uzun görevlerde kırılgandır.</p></details><details><summary>Ajan mı kullanmalıyım yoksa Playwright mı?</summary><p>Akış sabitse ve hacim yüksekse Playwright her zaman daha ucuz, daha hızlı ve daha güvenilirdir. Ajan, arayüzün sık değiştiği veya işin her seferinde farklı olduğu durumlarda kazanır. En iyi kurgu ikisini birleştirir: ajan yolu keşfeder, betik o yolu tekrarlar.</p></details><details><summary>Tarayıcı ajanları güvenli mi?</summary><p>Varsayılan hâliyle değil. Ajan güvenilmeyen sayfa içeriğine bakıp eylem ürettiği için dolaylı prompt injection'a açıktır ve bu sorunun tam çözümü bulunmuş değil. Sanal makine izolasyonu, çıkış trafiği izin listesi, ajanın profilinde oturum açık bırakmamak ve geri alınamaz eylemlerde insan onayı, riski yönetilebilir seviyeye indirir.</p></details></div>

---

Kısacası bilgisayar kullanan ajanlar gerçek bir yetenek kazandırıyor, ama kısa demo ile uzun iş akışı arasındaki 60 puanlık fark, mimarinizi kurarken temel alacağınız sayıdır. Döngünün genel tasarımı için [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/), ekrandan gelen metnin neden talimat sayılmaması gerektiği için [prompt injection ve güvenlik](/posts/prompt-injection-guvenlik/), ve bu ajanın gerçekten çalışıp çalışmadığını ölçmek için [ajan değerlendirmesi](/posts/ajan-degerlendirmesi/) yazılarına bakabilirsiniz.
