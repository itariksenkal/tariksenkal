---
title: "Türkçe Dil Modelleri 2026: Doğrulanmış Bir Manzara (ve Uydurulmuş Olanlar)"
description: "Türkçe açık kaynak LLM manzarası, her iddia için Hugging Face bağlantısıyla: Cosmos, Kumru, Trendyol, Kanarya, BİLGE. Var olmayan modelleri nasıl ayırt edersiniz?"
publishDate: "2026-08-13T23:39:00+03:00"
lang: tr
category: "Ekosistem"
tags: ["Ekosistem", "Yapay Zeka"]
translation: "turkish-language-models-2026"
heroImage:
  src: "../../../assets/blog/bimg-03.jpg"
  alt: "Türkçe Dil Modelleri 2026: Doğrulanmış Bir Manzara (ve Uydurulmuş Olanlar)"
---

Türkçe "açık kaynak LLM" araması yaptığınızda karşınıza çıkan ilk sonuçların bir kısmı var olmayan modelleri listeliyor. Uydurulmuş depo adları, uydurulmuş kıyaslama puanları ve model lisansı diye sunulan bir ABD ihracat mevzuatı. Bu yazı, bunun tam tersini yapıyor: her model adı gerçek bir Hugging Face deposuna bağlı, her sayının nereden geldiği yazılı ve doğrulayamadığım hiçbir şey burada yok. Sonunda da kendi listenizi 20 saniyede doğrulayabileceğiniz bir betik var.

## Önce uyarı: var olmayan modeller

Türkçe arama sonuçlarında bugün üst sıralarda yer alan bir liste sayfası şu model adlarını içeriyor: `KanarYa-Mistral-7B-tr`, `Kumru AI-7.4B`, `Cosmos-Llama-1-70B`, `TÜBİTAK BİLGEM-13B`, `bilgem-tr-llm-70b` ve "ITAR/EAR Custom License" altında yayımlandığı söylenen `t3-ai-defence-7b`.

> Bu depoların hiçbiri yok — ve ITAR/EAR bir model lisansı değil, ABD ihracat kontrol mevzuatıdır.

Bunu okurken bana da güvenmeyin. Doğrulaması otuz saniye sürüyor ve bu betik çalışır:

```python
from huggingface_hub import HfApi
from huggingface_hub.utils import RepositoryNotFoundError

api = HfApi()
adaylar = [
    # iddia edilen, doğrulanamayan depolar
    "asafaya/KanarYa-Mistral-7B-tr",
    "vngrs-ai/Kumru-AI-7.4B",
    "ytu-ce-cosmos/Cosmos-Llama-1-70B",
    # gerçekten var olanlar
    "asafaya/kanarya-2b",
    "vngrs-ai/Kumru-2B",
    "ytu-ce-cosmos/Turkish-Llama-8b-v0.1",
]

for repo in adaylar:
    try:
        bilgi = api.model_info(repo)
        print("VAR  ", repo, "| lisans:", bilgi.card_data.get("license"))
    except RepositoryNotFoundError:
        print("YOK  ", repo)
```

Bir model listesini okurken uygulayacağınız kural basit: **depo adı ve lisans verilmemişse, o satır bir iddiadır, bir bilgi değil.** Türkçe yapay zekâ ekosisteminin en büyük sorunu model azlığı değil; doğrulanabilir bilgi azlığı.

## Doğrulanmış manzara: kim ne yayımlıyor?

Aşağıdaki tablodaki her satır, yazım sırasında Hugging Face üzerinden doğrulanmıştır.

| Kurum | Doğrulanmış modeller |
| --- | --- |
| **Cosmos** — Yıldız Teknik Üniversitesi Bilgisayar Mühendisliği (İTÜ değil) | `Turkish-Llama-8b-v0.1` (Llama-3-8B üzerine, 30 GB Türkçe veri), `Turkish-Gemma-9b-v0.1` (Gemma-2-9B üzerine), ModernBERT-TR ailesi: `-base`, `-embed`, `-reranker`, `-guardrail` (~0,1B) |
| **VNGRS** | `Kumru-2B` ve `Kumru-2B-Base`; VBART ailesi (Small → XLarge) ve özetleme/başlık üretme türevleri |
| **Trendyol** | `Trendyol-LLM-8B-T1`, `Trendyol-LLM-Asure-12B` (Gemma 3-12B üzerine, çok modlu), `Trendyol-Cybersecurity-LLM-v2-70B-Q4_K_M` |
| **Kanarya** — Ali Safaya | Yalnızca `kanarya-750m` ve `kanarya-2b`. Mart 2024'ten beri güncellenmedi; 7B sürümü yok |
| **BERTurk** — dbmdz | Gerçek ve yaygın kullanılıyor, ancak **Bavyera Eyalet Kütüphanesi** tarafından yayımlandı — Türkiye kaynaklı değil |
| **Turkcell** | `Turkcell-LLM-7b-v1` var, ama Nisan 2024'ten beri güncellenmedi — pratikte atıl |

Bu tablonun en çarpıcı yanı, çoğu listede görmediğiniz şey: **Türkçe'ye özel yayımlanmış, 12B'nin üzerinde, açık ağırlıklı bir model yok.** Ekosistemin gerçek ağırlık merkezi 2B–12B aralığında ve encoder tarafında (BERT/ModernBERT türevleri) şaşırtıcı derecede güçlü.

Bunun bir de doğrudan sonucu var: Türkçe için büyük bir modele ihtiyacınız varsa, seçenek Türkçe'ye özel bir model değil, Türkçe'yi iyi bilen çok dilli bir modeldir. Bu kategoride en temiz lisanslı seçenek `utter-project/EuroLLM-22B-Instruct-2512` — 22,6 milyar parametre, **Apache-2.0**, ve desteklediği 35 dil arasında Türkçe açıkça yer alıyor.

## Lisanslar: "açık" ne demek, ne demek değil?

"Açık kaynak" etiketi Türkçe listelerde en çok yanlış kullanılan şey. Doğrulanmış durum şöyle:

-   `Turkish-Llama-8b-v0.1` **Llama 3 lisansı** altında. Apache değil; kullanım kısıtları ve atıf yükümlülükleri var.
-   `Turkish-Gemma-9b-v0.1` ve `Trendyol-LLM-Asure-12B` **Gemma lisansı** altında. Bunlar da Apache-2.0 değil — Türkçe listelerde en sık yapılan hata bu ikisini "Apache" diye etiketlemek.
-   `EuroLLM-22B-Instruct-2512` gerçekten **Apache-2.0**.

<div class="callout"><strong>İpucu:</strong> Ticari bir üründe kullanacaksanız lisansı model kartından değil, deponun <code>README</code> üst verisindeki <code>license</code> alanından okuyun ve o tarihteki hâlini kayıt altına alın. Model kartı metni ile üst veri zaman zaman uyuşmaz; hukuk ekibiniz üst veriyi ister.</div>

## BİLGE ve T3: devlet ve vakıf tarafı

**BİLGE**, TÜBİTAK BİLGEM tarafından geliştirilen ulusal dil modeli. Doğrulanabilir olanlar: 1 trilyon token üzerinde eğitildiği, kültürel çeviri değerlendirmesinde 50 üzerinden 44,44 puan aldığı ve resmî bir tanıtım sitesinin bulunduğu. Doğrulanamayan iki şey var ve bunları söylemek dürüstlüğün gereği: **parametre sayısı çelişkili** — farklı haber kaynakları 1,9B–122B arası bir aile ile 37B arasında ayrışıyor — ve **hiçbir kaynak BİLGE'nin açık ağırlıklı olduğunu doğrulamıyor.** Dolayısıyla BİLGE'yi "Türkiye'nin açık kaynak modeli" diye anmak şu an için yanlış olur.

**T3 AI**, T3 Vakfı ve Baykar iş birliğiyle geliştirilen ve TEKNOFEST'te tanıtılan model; beta sürümü erişime açıldı. Savunma sanayiine özel, ihracat kontrollü bir varyantına dair dolaşan iddiaların hiçbir birincil kaynağı yok.

## Kıyaslama gerçeği: Türkçe'ye özel model her zaman kazanmıyor

Türkçe LLM tartışmasının en çok gözden kaçan bulgusu bu. Koç Üniversitesi KUIS AI ekibinin **Cetvel** çalışması (arXiv:2508.16431, EACL 2026'ya kabul edildi) 23 görev ve 70B'ye kadar 33 açık ağırlıklı modeli değerlendirdi ve şunu buldu: _Türkçe'ye özel talimat ayarlı modeller, çok dilli veya genel amaçlı modellere göre genellikle daha zayıf performans gösteriyor — dile özel olarak hazırlanmış olmalarına rağmen._ Llama 3 ve Mistral, birçok görevde Türkçe'ye özel modelleri geçti.

Bu, "Türkçe model gereksiz" demek değil. Şunu söylüyor: **dil etiketi bir performans garantisi değildir.** Türkçe'ye sürekli ön eğitim yapılmış bir 9B model, aynı boyuttaki çok dilli bir modelden Türkçe'de daha iyi olabilir; ama 70B'lik güçlü bir çok dilli modelden daha iyi olacağının garantisi yoktur.

Kıyaslama tarafında bakılacak yerler: **TurkBench** (arXiv:2601.07020, 8.151 örnek, 21 alt görev, EACL 2026 SIGTURK), daha eski referans olarak **TR-MMLU** (arXiv:2501.00593) ve canlı sıralamalar için `yerel.ai/leaderboard` ile Hugging Face üzerindeki `alibayram` TR-MMLU tablosu. Model kartlarının kendi bildirdiği puanları da kullanabilirsiniz — örneğin `Turkish-Gemma-9b-v0.1` kartı Türkçe kıyaslamalarda 63,31 ortalama bildiriyor — ama bunlar _üreticinin kendi ölçümüdür_, bağımsız değildir; öyle etiketleyin.

## Model seçimi: pratik bir karar akışı

1.  **Görev bir sınıflandırma, etiketleme veya arama işi mi?** Büyük bir üretken modele gerek yok. ModernBERT-TR ailesi (~0,1B) bu işlerde hem çok daha hızlı hem çok daha ucuz.
2.  **Anlamsal arama mı yapıyorsunuz?** Türkçe için ayrı bir embedding modeli seçin ve sorgu ile belgeleri aynı modelle kodlayın.
3.  **Üretken bir işse ve veri kurum dışına çıkamıyorsa**, 8B–12B aralığındaki Türkçe sürekli-ön-eğitimli modeller makul bir başlangıç; lisansı önceden okuyun.
4.  **Kalite tavanı gerekiyorsa**, Türkçe'ye özel model aramayı bırakın; güçlü çok dilli bir modeli kendi görev setinizde ölçün.
5.  **Her durumda:** kararı kıyaslama tablosuyla değil, kendi verinizden çıkardığınız 50–200 örneklik bir değerlendirme setiyle verin. Genel liderlik tabloları sizin işinizi ölçmüyor.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Türkçe SERP'te üst sıralarda dolaşan bazı model adları hiç var olmadı; depo adı ve lisans verilmeyen her satır bir iddiadır.</li><li>Doğrulanmış manzara 2B–12B aralığında yoğunlaşıyor; Türkçe'ye özel, 12B üstü açık ağırlıklı bir model yok.</li><li>Cosmos ve Trendyol modelleri Llama 3 / Gemma lisansı altında — Apache-2.0 değil. EuroLLM-22B gerçekten Apache-2.0 ve Türkçe destekliyor.</li><li>Cetvel çalışması, Türkçe'ye özel talimat ayarlı modellerin çok dilli modellerin gerisinde kalabildiğini gösteriyor: dil etiketi performans garantisi değil.</li></ul></div>

<div class="faq"><details><summary>Türkçe için en iyi açık kaynak LLM hangisi?</summary><p>Tek bir cevabı yok ve olduğunu iddia eden listelere şüpheyle bakın. Sınıflandırma ve arama işlerinde ModernBERT-TR ailesi; kurum içi üretken işlerde 8B–12B Türkçe sürekli-ön-eğitimli modeller; kalite tavanı gerektiğinde güçlü bir çok dilli model. Kararı kendi değerlendirme setinizde verin.</p></details><details><summary>Kumru mu Trendyol LLM mi?</summary><p>Farklı ölçeklerdeler, bu yüzden doğrudan rakip değiller. Doğrulanmış hâlleriyle Kumru 2B seviyesinde, Trendyol'un yayımladığı modeller 8B ve 12B seviyesinde. Küçük ve hızlı bir taban arıyorsanız Kumru, daha yüksek kapasite gerekiyorsa Trendyol tarafı — ama Trendyol modellerinin Gemma lisansı altında olduğunu ticari kullanımdan önce okuyun.</p></details><details><summary>BİLGE açık kaynak mı?</summary><p>Bunu doğrulayan bir birincil kaynak yok. BİLGE'nin 1 trilyon token üzerinde eğitildiği ve kültürel çeviri değerlendirmesinde 44,44/50 aldığı bildirildi; parametre sayısı ise kaynaklar arasında çelişkili. Açık ağırlıklı olduğuna dair bir doğrulama bulunmadığı için öyle anılmamalı.</p></details></div>

---

Türkçe yapay zekâ ekosisteminin ihtiyacı daha çok liste değil, doğrulanabilir liste. Açık ağırlıklı modellerin genel manzarası için [açık kaynak LLM'ler](/posts/acik-kaynak-llm/), bir modeli kendi verinizde ölçmenin yöntemi için [LLM değerlendirme](/posts/llm-degerlendirme/), ve neden çoğu Türkçe iş için küçük bir modelin yettiği konusunda [küçük dil modelleri](/posts/kucuk-dil-modelleri/) yazılarına bakabilirsiniz.
