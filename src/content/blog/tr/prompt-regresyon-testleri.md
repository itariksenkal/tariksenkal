---
title: "Prompt Regresyon Testleri: Değerlendirmeyi CI'a Sokmak"
description: "Altın veri setini üretim günlüklerinden çıkarma, promptfoo ile CI kapısı kurma, LLM hakemi kalibre etme ve Türkçe metinde eşleştirmeyi bozan tuzaklar."
publishDate: "2026-08-13T23:48:00+03:00"
lang: tr
category: "Ölçme"
tags: ["Ölçme", "Yapay Zeka"]
translation: "prompt-regression-testing"
heroImage:
  src: "../../../assets/blog/covers/prompt-regresyon-testleri.jpg"
  alt: "Prompt Regresyon Testleri: Değerlendirmeyi CI'a Sokmak"
---

Prompt'u değiştirdiniz, üç örnekte denediniz, iyi göründü, dağıttınız. Bir hafta sonra destek ekibi başka bir senaryonun bozulduğunu söylüyor. Bu döngüyü kıran şey daha iyi prompt yazmak değil; değerlendirmeyi bir _build adımı_ hâline getirmek. Bu yazı, ölçütlerin ne olduğunu değil, ölçümün nerede çalıştığını anlatıyor: altın veri seti, CI kapısı, hakem kalibrasyonu ve Türkçe metinde sessizce yanlış sonuç üreten tuzaklar.

## Altın veri setini nereden çıkarırsınız?

En sık yapılan hata, test setini masa başında uydurmaktır. Uydurulmuş sorular, gerçek kullanıcıların sorduğu sorulara benzemez ve testiniz geçerken üretim bozulur. Doğru kaynak üretim günlükleridir.

> Altın veri seti yazılmaz, üretimden çıkarılır.

Pratik yöntem: son otuz günün günlüklerinden rastgele 200 istek örnekleyin, bunları elle kümeleyin ve her kümeden 3-5 temsilci seçin. Sonuç genellikle 50-150 örneklik bir set olur ve bu yeterlidir. Buna ek olarak iki küme daha ekleyin: **geçmiş hatalar** (her düzeltilen hata bir test olur — regresyon setinin gerçek değeri budur) ve **kenar durumlar** (boş girdi, çok uzun girdi, karışık dilli girdi, saldırı denemesi).

## Üç katmanlı test piramidi

Her örneği bir LLM hakemine sormak pahalı ve gereksizdir. Ucuzdan pahalıya doğru üç katman kurun; her katman bir öncekini geçenleri alır.

| Katman | Ne yapar, ne kadar tutar |
| --- | --- |
| **1\. Deterministik** | Şema doğrulama, JSON ayrıştırma, zorunlu alanlar, yasak ifadeler, uzunluk sınırı. Bedava ve milisaniyeler içinde. Hataların şaşırtıcı bir kısmını burada yakalarsınız. |
| **2\. Referanslı** | Beklenen cevabın bilindiği durumlar: sınıflandırma etiketi, çıkarılan alan, hesaplanan sayı. Ucuz ve kesin. |
| **3\. Hakemli** | Serbest metin kalitesi. Pahalı, yavaş ve kalibrasyon gerektirir — yalnızca ilk ikisinin cevaplayamadığı sorulara saklayın. |

Bu piramidin faydası maliyet değil hız: birinci katman her commit'te, ikincisi her pull request'te, üçüncüsü gecelik çalışabilir.

## promptfoo ile çalışan bir CI kapısı

Türkçe kaynaklarda araç adı geçmediği için baştan söyleyeyim: bu alanda kullanılan araçlar **promptfoo**, **RAGAS** (RAG'a özel ölçütler), **DeepEval** ve barındırılan tarafta **LangSmith** ile **Braintrust**. En hızlı başlangıç promptfoo, çünkü bir YAML dosyası ve tek komuttan ibaret.

```text
# promptfooconfig.yaml
prompts:
  - file://prompts/destek-v3.txt
providers:
  - id: anthropic:messages:claude-sonnet-4-5
    config: { temperature: 0 }

defaultTest:
  assert:
    - type: is-json
      value:
        type: object
        required: [niyet, oncelik, ozet]
    - type: not-contains
      value: "bir dil modeli olarak"
    - type: latency
      threshold: 4000

tests:
  - description: fatura itirazi
    vars: { mesaj: "Gecen ay iki kez tahsilat yapilmis, iade istiyorum." }
    assert:
      - type: equals
        value: '{"niyet":"iade_talebi","oncelik":"yuksek"}'
        transform: 'JSON.stringify({niyet: output.niyet, oncelik: output.oncelik})'

  - description: bos girdi
    vars: { mesaj: "" }
    assert:
      - type: javascript
        value: output.niyet === "belirsiz"
```

```bash
# CI adimi: esik altinda kalirsa build kirilir
npx promptfoo@latest eval -c promptfooconfig.yaml \
  --output sonuc.json --fail-on-error
npx promptfoo@latest eval --assert-pass-rate 0.95
```

Kapının pull request'te çalışması, prompt'u koda çevirir. Bir prompt değişikliği artık bir diff'tir, testi vardır ve geçmezse birleşmez.

<div class="callout"><strong>İpucu:</strong> Testleri <code>temperature: 0</code> ile çalıştırın ama üretimde kullandığınız sıcaklıkla da ayrı bir gecelik koşu yapın. Sıfır sıcaklıkta geçen bir sistemin üretimde tutarsız olması, tam olarak ölçmediğiniz yerdedir.</div>

## Hakem kalibrasyonu: güvenilirlik geçerlilik değildir

LLM hakemi kullanacaksanız, 2026'da yayımlanan en kapsamlı güvenilirlik çalışmasını bilmeniz gerekir (arXiv:2606.19544, 17 Haziran 2026): **9 sağlayıcıdan 21 hakem, 118 koşu ve yaklaşık 541.000 tekil yargı**. Bulguları bir hakem kurmadan önce okunmalı:

-   **Kappa düşüşü evrensel.** Ham uyuşma oranı ile şansa göre düzeltilmiş Cohen kappa arasındaki fark MT-Bench üzerinde 33–41 puana kadar çıkıyor. Yani "hakemim %85 uyuşuyor" cümlesi neredeyse hiçbir şey ifade etmiyor.
-   **Sıralamalar kıyaslamaya göre 14 basamağa kadar kayıyor.** Bir hakemin bir sette iyi olması, sizin setinizde iyi olacağı anlamına gelmiyor.
-   **Tutarlılık-yanlılık paradoksu:** üretimde kullanılan iki hakem, test-tekrar test güvenilirliği 0,95'in üzerindeyken aynı anda 0,10'un üzerinde konum yanlılığı gösteriyor. Yani hakem _tutarlı biçimde_ yanlı olabilir.
-   **Ayrıntı sözlülük yanlılığı küçük** (0,011'in altında) — yani en çok korkulan yanlılık aslında en zararsızı.

Pratik karşılığı üç kural. **Bir:** hakeminizi 50-100 insan etiketli örnekle doğrulayın ve ham uyuşma değil kappa raporlayın. **İki:** ikili karşılaştırmalarda A/B sırasını rastgeleleştirin ve her çifti iki yönde de sorun — konum yanlılığını ölçmenin tek yolu bu. **Üç:** hakem prompt'unu da sürümleyin; hakem değiştiğinde geçmiş skorlar karşılaştırılamaz hâle gelir.

Bir uyarı daha: insan etiketleri de altın standart değil. Aynı alandaki bir başka çalışma, insan açıklamalarının kendi içinde belirgin biçimde tutarsız olduğunu ve bunun insan etiketli kıyaslamaları da zayıflattığını gösteriyor. Yani hakemi insana yaklaştırmak bir tavan, bir garanti değil.

## Türkçe'de eşleştirmeyi bozan tuzaklar

Bu bölüm İngilizce kaynaklarda yok ve Türkçe değerlendirmede sessizce yanlış sonuç üretiyor.

-   **Sondan eklemelilik tam eşleşmeyi kırar.** "iade" ile "iadesi" ve "iadesini" farklı dizelerdir. Sınıflandırma etiketlerinde tam eşleşme kullanın, serbest metinde asla.
-   **Aksan kaybı (deasciification).** Kullanıcılar "gecen ay" yazar, referansınız "geçen ay" der. Karşılaştırmadan önce her iki tarafı da aynı normalleştirmeden geçirin.
-   **İ/ı büyük-küçük harf.** Standart `lower()` Türkçe'de yanlıştır; `"İ".lower()` iki karakter döndürür.
-   **Unicode birleştirme.** Aynı görünen iki metin farklı kod noktalarından oluşabilir; `NFC` normalleştirmesi şart.

```python
import unicodedata

TR_ASCII = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")

def normalize_tr(s: str) -> str:
    """Degerlendirmede karsilastirmadan once IKI tarafa da uygulanir."""
    s = unicodedata.normalize("NFC", s)
    s = s.replace("I", "ı").replace("İ", "i").lower()
    s = s.translate(TR_ASCII)                  # aksan farkini yok say
    return " ".join(s.split())                 # bosluklari sadelestir

assert normalize_tr("İADE Talebi")  == normalize_tr("iade  talebi")
assert normalize_tr("Geçen ay")     == normalize_tr("gecen ay")
```

## Kapı nasıl ayarlanır?

Bir CI kapısının işe yaraması, eşiğin doğru ayarlanmasına bağlı. Çok sıkı bir kapı devre dışı bırakılır, çok gevşek bir kapı hiçbir şey yakalamaz.

1.  **Mutlak eşik değil, gerileme eşiği kullanın.** "%95 geçmeli" yerine "ana daldan 2 puandan fazla düşmemeli". Böylece kapı, sistemin bugünkü hâline göre kalibre olur.
2.  **Kritik testleri ayırın.** Güvenlik ve şema testleri tek bir başarısızlıkta bile kırmalı; kalite testleri toplam orana bakmalı.
3.  **Gürültüyü ölçün.** Kapıyı kurmadan önce aynı sürümü beş kez çalıştırın ve doğal dalgalanmayı görün; eşik bu dalgalanmanın üstünde olmalı.
4.  **Maliyeti ve gecikmeyi de kapıya koyun.** Kaliteyi artırırken maliyeti üçe katlayan bir değişiklik, bir gerileme sayılmalı ve tartışılmalı.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Altın veri setini uydurmayın; üretim günlüklerinden örnekleyin ve her düzeltilen hatayı test hâline getirin.</li><li>Üç katman kurun: deterministik kontroller her commit'te, referanslı testler her PR'da, hakemli değerlendirme gecelik.</li><li>Hakeminizi kappa ile doğrulayın ve konum yanlılığını sırayı çevirerek ölçün — ham uyuşma oranı yanıltıcıdır.</li><li>Türkçe metinde tam eşleşme kullanmadan önce NFC, İ/ı ve aksan normalleştirmesini iki tarafa da uygulayın.</li></ul></div>

<div class="faq"><details><summary>Prompt regresyon testi nedir?</summary><p>Bir prompt veya model değişikliğinin daha önce çalışan davranışları bozmadığını otomatik olarak doğrulayan testtir. Yazılımdaki regresyon testiyle aynı mantık: sabit bir örnek kümesi, beklenen sonuçlar ve değişiklik birleşmeden önce çalışan bir kapı.</p></details><details><summary>Altın veri seti nasıl oluşturulur?</summary><p>Üretim günlüklerinden rastgele örnekleyip elle kümeleyerek. Her kümeden birkaç temsilci alın, üzerine geçmişte düzeltilen hataları ve kenar durumları ekleyin. 50-150 örnek çoğu sistem için yeterlidir; büyüklüğü değil temsil gücü belirleyicidir.</p></details><details><summary>LLM hakemi güvenilir mi?</summary><p>Kalibre edilirse kullanılabilir, edilmezse yanıltıcıdır. Yayımlanmış en kapsamlı çalışma, ham uyuşma oranı ile kappa arasında 33-41 puana varan fark, kıyaslamalar arasında 14 basamağa kadar sıralama kayması ve yüksek tutarlılığa rağmen belirgin konum yanlılığı buldu. Hakemi kendi setinizde insan etiketiyle doğrulayın ve kappa raporlayın.</p></details></div>

---

Değerlendirme bir rapor değil bir build adımı hâline geldiğinde, prompt değiştirmek korkutucu olmaktan çıkar. Hangi ölçütlerin ne anlama geldiği için [LLM değerlendirme](/posts/llm-degerlendirme/), ajanların özel ölçme sorunları için [ajan değerlendirmesi](/posts/ajan-degerlendirmesi/), ve bu kapının içine oturacağı dağıtım hattı için [MLOps ve üretime alma](/posts/mlops-uretim/) yazılarına bakabilirsiniz.
