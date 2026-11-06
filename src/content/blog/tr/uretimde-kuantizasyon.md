---
title: "Üretimde Kuantizasyon: FP8, NVFP4 ve Türkçe'de Kalite Kaybı"
description: "FP8, NVFP4, AWQ ve GPTQ arasında nasıl seçilir? Donanım uyumluluk matrisi, vLLM ile sunum ve düşük bitli kuantizasyonun Türkçe metinde ölçülmeyen kalite bedeli."
publishDate: "2026-08-13T23:57:00+03:00"
lang: tr
category: "Verimlilik"
tags: ["Verimlilik", "Yapay Zeka"]
translation: "quantization-in-production"
heroImage:
  src: "../../../assets/blog/covers/uretimde-kuantizasyon.jpg"
  alt: "Üretimde Kuantizasyon: FP8, NVFP4 ve Türkçe'de Kalite Kaybı"
---

Kuantizasyon (quantization) hakkındaki Türkçe içeriğin neredeyse tamamı dizüstü bilgisayarda GGUF çalıştırmakla ilgili. Oysa bir ürün sunucusunda soru başka: hangi biçim _hangi donanımda_ gerçekten hızlanıyor, kalite nerede kaybediliyor ve o kaybı Türkçe metinde nasıl ölçersiniz? Bu yazı sunum tarafına — vLLM, FP8, NVFP4 ve AWQ'ya — odaklanıyor ve kimsenin ölçmediği bir noktayı öne alıyor: düşük bitli kuantizasyon Türkçe'de İngilizce'dekinden farklı davranır.

## Kuantizasyon neyi ucuzlatır?

Kuantizasyon, model ağırlıklarını (ve bazen aktivasyonları) daha az bitle temsil etmektir: 16 bitlik bir ağırlığı 8 veya 4 bite indirirsiniz. İki somut kazancı vardır ve bunlar birbirinden bağımsızdır.

-   **Bellek:** ağırlıklar doğrudan küçülür. 16 bitten 8 bite inmek ağırlık ayak izini kabaca yarıya, 4 bite inmek dörtte bire indirir. Bu, modelin daha küçük bir GPU'ya sığması ya da aynı GPU'da KV önbelleğe daha çok yer kalması demektir — ki bu ikincisi çoğu zaman daha değerlidir, çünkü eşzamanlı istek sayısını belirler.
-   **Hız:** kod çözme aşaması bellek bant genişliği sınırlı olduğundan, daha az bit okumak doğrudan daha hızlı üretim demektir.

> Kuantizasyon spekülatif kod çözmeden farklı olarak kayıplı bir tekniktir — soru "kalite düşer mi" değil, "nerede ve ne kadar düşer".

## W4A16 mı W8A8 mi: gösterim şeması aslında ne söyler?

Karışıklığın çoğu bu gösterimi okumamaktan çıkıyor. `W` ağırlık (weight), `A` aktivasyon (activation) bit genişliğidir.

-   **W4A16:** ağırlıklar 4 bit, aktivasyonlar 16 bit. Ağırlıklar hesaptan önce açılır. Bellekten büyük kazanç sağlar; asıl faydası _düşük eşzamanlılıkta_ ve bellek sıkışıklığındadır. AWQ ve GPTQ tipik olarak buraya oturur.
-   **W8A8:** hem ağırlık hem aktivasyon 8 bit. Hesaplama gerçekten 8 bitte yapılabildiği için, donanım desteği varsa _yüksek eşzamanlılıkta_ ve toplu işlerde verimi artırır. FP8 ve INT8 W8A8 bu sınıftır.

Pratik karar kuralı: darboğazınız **belleğe sığmaksa** W4A16, darboğazınız **yüksek trafikte verimse** W8A8. Bu ikisini karıştırmak, "kuantize ettim ama hızlanmadı" sonucunun en sık sebebi — 4 bit ağırlıkları doygun bir toplu işte açmak, kazandırdığından fazlasını ek hesaba harcayabilir.

## Donanım matrisi: seçimi donanımınız yapar

vLLM'in desteklediği yöntem listesi geniş: FP8 (LLM Compressor, NVIDIA Model Optimizer), NVFP4/MXFP4 (Marlin üzerinden), AWQ, GPTQ (GPTQModel + Marlin), INT8 W8A8, INT4 W4A8 ve W4A16, bitsandbytes, TorchAO, Intel Neural Compressor ve AMD Quark. Ancak bu liste donanımdan bağımsız değil:

-   **NVIDIA:** en geniş destek. Turing (SM 7.5) ve sonrası neredeyse tüm yöntemleri kapsar.
-   **AMD:** belirgin biçimde dar — GGUF, llm-compressor FP8 ve GPTQ ile sınırlı.
-   **CPU:** yalnızca llm-compressor INT8 W8A8 ve W4A8.

Bu yüzden yöntem seçimi bir tercih meselesi değil, çoğu zaman bir kısıt meselesidir. AMD üzerinde AWQ arayan bir ekip, seçmediği için değil seçemediği için başka yere gider.

<div class="callout"><strong>İpucu:</strong> vLLM dokümantasyonu bu yöntemler arasında <strong>bilinçli olarak</strong> doğruluk veya verim karşılaştırması yayımlamıyor. Bu bir eksiklik değil, dürüst bir duruş: sonuç modele, göreve ve donanıma göre değişiyor. İnternette gördüğünüz sıralamaları kendi kurulumunuza taşımayın — aşağıdaki gibi kendi kıyaslamanızı kurun.</div>

## NVFP4 ve 2026'nın doğruluk kurtarma cephesi

2026'nın asıl hikâyesi **NVFP4**: blok ölçekli 4 bitlik bir kayan nokta biçimi. Düşük bitli kuantizasyonun uzun süredir bilinen sorunu, ağırlık dağılımındaki uç değerlerin (outlier) kaba bir 4 bitlik ızgaraya sığmamasıydı; blok ölçekleme bunu küçük gruplara ayrı ölçek vererek yumuşatıyor. Etrafındaki araştırma da doğruluğu geri kazanmaya odaklanmış durumda:

-   **ScaleSweep** (30 Mayıs 2026), ağırlık, aktivasyon, KV önbellek ve sorgunun uçtan uca kuantize edildiği bir kurulumda tam hassasiyetli performansın **%93'ünden fazlasını** koruduğunu bildiriyor. — _arXiv:2606.07618_
-   **SharQ** (25 Haziran 2026), NVFP4 ile FP16 arasındaki doğruluk farkının **%43–63**'ünü _eğitim gerektirmeden_ geri kazanıyor; RTX 5090 üzerinde FP16'ya kıyasla **2,2–2,4×** gecikme azalması ve FP8'e kıyasla **1,2–1,4×** verim artışı ölçüyor. — _arXiv:2606.26587_

Bu iki çalışmanın ortak mesajı, 4 bitin artık "ucuz ama riskli" kategorisinden çıkmakta olduğu. Ama dikkat edilmesi gereken ayrıntı şu: SharQ'nun geri kazandığı şey _farkın bir kısmı_. Yani NVFP4 ile FP16 arasında hâlâ ölçülebilir bir fark var ve bu farkın sizin göreviniz için önemli olup olmadığını yalnızca siz bilebilirsiniz.

## Kalite kaybı Türkçe'de nerede ortaya çıkar?

Burası Türkçe kaynaklarda hiç konuşulmayan kısım. Kuantizasyon kaybı homojen dağılmaz; modelin _en az emin olduğu_ yerlerde yoğunlaşır. Ve çok dilli bir modelde bu yerler İngilizce dışındaki dillerdir.

Nedeni tokenizasyonda. Türkçe, İngilizce'ye kıyasla kelime başına belirgin biçimde daha fazla token'a bölünür; sondan eklemeli yapı nedeniyle tek bir kelime birden çok parçaya ayrılır. Bunun iki sonucu var:

1.  **Daha uzun token zinciri, daha çok birikimli hata:** aynı cümleyi üretmek daha fazla adım gerektirir ve kuantizasyon gürültüsü her adımda yeniden devreye girer.
2.  **Daha seyrek görülmüş parçalar:** Türkçe alt-kelime parçaları eğitim verisinde İngilizce'dekilerden daha az geçer; bu embedding'lerin dağılımı daha az keskindir ve kaba bir ızgaraya yuvarlandığında ayırt edicilik daha çabuk kaybolur.

Pratikte bu, İngilizce ölçümde "ihmal edilebilir" görünen bir kaybın Türkçe'de morfolojik hatalar, ek düşmesi, özel isim bozulması ve JSON şema ihlali olarak görünmesi demektir. Somut ve tekrarlanan bir gözlem: 4 bite inen bir modelde Türkçe çıktı, İngilizce çıktıya kıyasla daha erken bozulur — ve İngilizce kıyaslamalar bunu size _hiç_ göstermez.

Bu yüzden kural nettir: **kuantizasyon kararını İngilizce kıyaslamayla vermeyin.** Ölçümü kendi Türkçe üretim trafiğinizde yapın.

## Kendi kıyaslamanızı kurun

Doğru kıyaslama karmaşık değil; sadece _kendi_ verinizle yapılması gerekiyor. Sunucuyu kaldırmak tek satır:

```text
# FP8 (W8A8) — yuksek eszamanlilikta verim icin
vllm serve MODEL_ADI --quantization fp8

# AWQ (W4A16) — bellek sikisikligi ve dusuk eszamanlilik icin
vllm serve MODEL_ADI_AWQ --quantization awq
```

Ardından aynı istekleri iki uç noktaya gönderip _kalite farkını_ ölçün. Aşağıdaki iskelet, doğruluğu ve biçim geçerliliğini birlikte kontrol ediyor — çünkü kuantizasyon kaybı çoğu zaman önce yapılandırılmış çıktıda görünür:

```python
import json, requests

def uret(uc_nokta, model, prompt, max_tokens=400):
    y = requests.post(
        f"{uc_nokta}/v1/chat/completions",
        json={"model": model,
              "messages": [{"role": "user", "content": prompt}],
              "temperature": 0,          # karsilastirma icin belirlenimci olmali
              "max_tokens": max_tokens},
        timeout=120)
    y.raise_for_status()
    return y.json()["choices"][0]["message"]["content"]

def json_gecerli(metin):
    try:
        json.loads(metin)
        return True
    except (json.JSONDecodeError, TypeError):
        return False

def karsilastir(taban_uc, kuant_uc, model, ornekler, dogru_mu):
    """ornekler: Turkce prompt listesi — KENDI trafiginizden
       dogru_mu: (prompt, cikti) -> bool  gorev basari olcutunuz"""
    sonuc = {"taban_dogru": 0, "kuant_dogru": 0,
             "taban_json": 0, "kuant_json": 0, "n": len(ornekler)}
    for p in ornekler:
        t = uret(taban_uc, model, p)
        k = uret(kuant_uc, model, p)
        sonuc["taban_dogru"] += dogru_mu(p, t)
        sonuc["kuant_dogru"] += dogru_mu(p, k)
        sonuc["taban_json"]  += json_gecerli(t)
        sonuc["kuant_json"]  += json_gecerli(k)
    n = sonuc["n"]
    print(f"dogruluk  taban={sonuc['taban_dogru']/n:.1%}  "
          f"kuant={sonuc['kuant_dogru']/n:.1%}")
    print(f"json      taban={sonuc['taban_json']/n:.1%}  "
          f"kuant={sonuc['kuant_json']/n:.1%}")
    return sonuc
```

Üç şeye dikkat edin. `temperature=0` olmadan iki kurulumu karşılaştıramazsınız; örnekler mutlaka gerçek Türkçe trafiğinizden gelmeli; ve JSON geçerlilik oranını doğruluktan ayrı izleyin — biçim bozulması genellikle anlam bozulmasından önce gelen erken uyarıdır.

Kararın kendisi de basitleşir: kabul edilebilir bir kalite eşiği belirleyin (örneğin görev doğruluğunda en fazla 1 puan düşüş), donanımınızın desteklediği yöntemleri sırayla deneyin ve eşiği geçen en agresif olanı seçin. Bu sıralamayı tersine çevirmek — önce en küçük biçimi seçip sonra kaliteye bakmak — üretimde en pahalı hatadır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>W4A16 bellek darboğazı ve düşük eşzamanlılık için, W8A8 yüksek trafikte verim için; ikisini karıştırmak hızlanmama sebebidir.</li><li>Yöntem seçimini çoğu zaman donanım yapar: NVIDIA Turing+ en geniş, AMD dar, CPU yalnızca INT8 W8A8 ve W4A8.</li><li>NVFP4 2026'nın biçimi; SharQ doğruluk farkının %43–63'ünü eğitimsiz geri kazanıyor ama fark tamamen kapanmıyor.</li><li>Kuantizasyon kaybı Türkçe'de daha erken görünür — kararı İngilizce kıyaslamayla değil kendi Türkçe trafiğinizle verin.</li></ul></div>

<div class="faq"><details><summary>FP8 ile NVFP4 arasındaki fark nedir?</summary><p>FP8 8 bitlik, NVFP4 ise blok ölçekli 4 bitlik bir kayan nokta biçimidir. NVFP4 daha çok bellek tasarrufu ve daha yüksek hız sunar; yayımlanmış ölçümlerde FP8'e kıyasla 1,2–1,4× verim artışı bildiriliyor. Karşılığında doğruluk riski daha yüksektir, bu yüzden 2026 araştırmasının önemli bir kısmı NVFP4'ün doğruluk açığını kapatmaya odaklanmış durumda.</p></details><details><summary>AWQ mı GPTQ mi kullanmalıyım?</summary><p>İkisi de tipik olarak W4A16 sınıfındadır ve bellek darboğazı olan senaryolar için uygundur; aralarındaki fark modelden modele değişir. vLLM dokümantasyonu bilinçli olarak bir doğruluk karşılaştırması yayımlamaz, dolayısıyla doğru cevap kendi görev setinizde ölçmektir. Donanımınız kısıt getiriyorsa seçim zaten daralır — örneğin AMD tarafında GPTQ desteklenirken AWQ desteklenmez.</p></details><details><summary>Kuantizasyon Türkçe performansını düşürür mü?</summary><p>Evet, ve İngilizce'dekinden daha erken düşürür. Türkçe kelime başına daha fazla token'a bölündüğü için üretim zinciri uzar ve kuantizasyon gürültüsü daha çok adımda birikir; ayrıca Türkçe alt-kelime parçaları eğitim verisinde daha seyrek geçtiğinden düşük bitli yuvarlamaya karşı daha kırılgandır. Pratik sonuç: İngilizce kıyaslamalarda ihmal edilebilir görünen bir kayıp, Türkçe'de ek hataları ve bozuk JSON olarak ortaya çıkabilir.</p></details></div>

---

Kuantizasyon, aynı modeli daha az donanımla sunmanın yolu; küçültmenin tek yolu değil. Aynı işi daha küçük bir modele öğretmek için [model damıtma](/posts/model-damitma/), hangi boyutun yeteceğine karar vermek için [küçük dil modelleri](/posts/kucuk-dil-modelleri/), ve kendi sunucunuzda çalıştıracağınız modelleri seçmek için [açık kaynak LLM'ler](/posts/acik-kaynak-llm/) yazılarına bakabilirsiniz.
