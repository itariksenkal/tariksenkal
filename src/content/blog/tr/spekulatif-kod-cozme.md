---
title: "Spekülatif Kod Çözme: Aynı Modelden Nasıl Daha Hızlı Token Alınır?"
description: "Taslak model, EAGLE, MTP, n-gram ve suffix decoding. Kabul oranı neden tek gerçek metrik, vLLM'de nasıl yapılandırılır ve spekülasyonun işe yaramadığı durumlar."
publishDate: "2026-08-13T23:58:00+03:00"
lang: tr
category: "Altyapı"
tags: ["Altyapı", "Yapay Zeka"]
translation: "speculative-decoding"
heroImage:
  src: "../../../assets/blog/covers/spekulatif-kod-cozme.jpg"
  alt: "Spekülatif Kod Çözme: Aynı Modelden Nasıl Daha Hızlı Token Alınır?"
---

Bir dil modelinin token üretimi doğası gereği sıralıdır: her token bir öncekini bekler ve her adımda milyarlarca ağırlık bellekten okunur. Spekülatif kod çözme (speculative decoding) bu darboğazı, çıktının kendisini değiştirmeden aşmayı hedefler — ucuz bir tahminci birkaç token'ı önden önerir, asıl model hepsini tek geçişte doğrular. 2026'da yöntem menüsü "taslak model"in çok ötesine geçti. Bu yazı yöntemleri, tek gerçek metrik olan kabul oranını ve —Türkçe kaynaklarda hiç yazılmayan— işe yaramadığı durumları anlatıyor.

## Neden yavaş: bellek bant genişliği darboğazı

Kod çözme (decode) aşamasında tek bir token üretmek için modelin _bütün_ ağırlıklarının HBM'den okunması gerekir. Yapılan aritmetik işlem miktarı ise küçüktür. Yani bu aşama hesaplama sınırlı değil, **bellek bant genişliği sınırlıdır** — GPU'nuzun tensör çekirdekleri boşta beklerken bellek yolu tıkanır.

> Tek token için de on token için de ağırlıkları bir kez okursunuz; spekülatif kod çözmenin tüm kazancı bu asimetriden gelir.

Buradan çıkan fikir şu: eğer sonraki birkaç token'ı ucuz bir yöntemle tahmin edebilirsek, asıl modele "bunlar doğru mu?" diye _tek bir geçişte_ sorabiliriz. Doğrulama, üretimle aynı ağırlık okumasını kullanır ama birden çok pozisyonu aynı anda değerlendirir. Kabul edilen her fazladan token bedavaya yakındır.

## Temel döngü: öner, doğrula, kabul et

1.  **Öneri:** bir taslak kaynağı (küçük model, ek bir başlık ya da basit bir arama) sonraki _k_ token'ı önerir.
2.  **Doğrulama:** hedef model bu _k_ pozisyonu tek ileri geçişte puanlar.
3.  **Kabul:** öneriler baştan başlayarak sırayla karşılaştırılır; ilk uyuşmazlığa kadar olanlar kabul edilir, uyuşmayan noktada hedef modelin kendi token'ı yazılır ve gerisi atılır.

Kritik nokta şu: doğrulama adımı, kabul kuralı doğru kurulduğunda çıktı dağılımını **değiştirmez**. Yani spekülatif kod çözme bir yaklaşıklama değildir; kalite kaybı olmadan gecikme düşürür. Bu, onu kuantizasyon gibi gerçekten ödünleşimli tekniklerden ayırır.

```python
# Kabul dongusunun ozu (aciklama amacli, gercek uygulama toplu calisir)
def spekulatif_adim(hedef, taslak, baglam, k=4):
    onerilen = taslak.uret(baglam, k)                 # k tokenlik ucuz tahmin
    hedef_dagilimlari = hedef.puanla(baglam, onerilen) # TEK ileri gecis

    kabul = []
    for i, tok in enumerate(onerilen):
        if hedef.kabul_eder(hedef_dagilimlari[i], tok):
            kabul.append(tok)
        else:
            kabul.append(hedef.ornekle(hedef_dagilimlari[i]))  # duzeltme
            return baglam + kabul                              # gerisi atilir
    # hepsi kabul edildiyse bir bonus token bedava gelir
    kabul.append(hedef.ornekle(hedef_dagilimlari[k]))
    return baglam + kabul
```

Bu döngüde adım başına kazanç, kabul edilen token sayısıdır. Hepsi reddedilirse tek token ilerlersiniz — üstelik taslak üretiminin maliyetini de ödemiş olarak. Sistemin ekonomisi tamamen buna bağlıdır.

## 2026'nın yöntem menüsü

vLLM bugün tek bir yöntem değil, bir aile sunuyor. Seçim, "hangisi en hızlı" değil "hangisi _sizin_ modelinize ve trafiğinize uyuyor" sorusudur:

-   **EAGLE:** güçlü, genel amaçlı seçenek. En büyük kazancı _düşük QPS_'te verir — GPU zaten doluysa spekülasyona ayıracak boş kapasite azalır.
-   **MTP (multi-token prediction):** hedef model bunu doğal olarak destekliyorsa en iyi seçenek; ayrı bir taslak model taşımanız gerekmez.
-   **Taslak model:** klasik yaklaşım. Aynı tokenizer'ı paylaşan küçük bir model gerektirir ve ek VRAM tüketir.
-   **PARD:** paralel taslak üretimi; taslak gecikmesini düşürmeye odaklanır.
-   **MLP Speculator:** hafif bir öngörü başlığı.
-   **n-gram:** model kullanmaz, bağlamdaki tekrarları yakalar. Çok hafiftir ama kazancı mütevazıdır.
-   **Suffix decoding:** dinamik derinlik seçer ve ek bir model gerektirmez.
-   **Özel öneri modülü:** kendi tahmincinizi takabileceğiniz kaçış kapısı.

n-gram ve suffix decoding'in ortak avantajı ek model olmamasıdır: VRAM maliyeti yok, dağıtım karmaşıklığı yok. Yapılandırılmış çıktı, kod tamamlama, uzun belgeden alıntılama gibi **bağlamdaki metnin tekrar ettiği** işlerde şaşırtıcı derecede iyi çalışırlar. Türkçe RAG yanıtları da bu sınıfa girer: model kaynak paragraflardan sık sık birebir alıntı yapar ve n-gram tam bunu yakalar.

<div class="callout"><strong>İpucu:</strong> Ek model gerektirmeyen yöntemlerle başlayın. n-gram veya suffix decoding'i açmak bir yapılandırma satırıdır; EAGLE ya da taslak model eklemek ise bir dağıtım, bir VRAM bütçesi ve bir sürüm uyumluluğu sorunudur. Ölçüp kazanç yeterliyse orada durun.</div>

## Kabul oranı: tek gerçek metrik

Spekülatif kod çözmenin sabit bir hızlanma çarpanı **yoktur**. vLLM dokümantasyonu bilinçli olarak bir sayı yayımlamaz; gerçek kazancın model ailesine, trafik desenine, donanıma ve örnekleme ayarlarına bağlı olduğunu açıkça söyler. Bu yüzden internette gördüğünüz "3 kat hızlanma" tarzı iddiaları kendi kurulumunuza taşımayın.

Ölçmeniz gereken şey **kabul oranı**: önerilen token'ların yüzde kaçının kabul edildiği. Basit bir model kurmak, kazancın nereden geldiğini net gösterir:

```python
def beklenen_hizlanma(kabul_orani, k, taslak_maliyeti):
    """kabul_orani  : onerilen tokenin kabul edilme olasiligi (0-1)
       k            : adim basina onerilen token sayisi
       taslak_maliyeti: taslak adiminin hedef adima orani (orn. 0.15)
       Donus: spekulasyonsuz duruma gore hizlanma (1.0 = kazanc yok)"""
    a = kabul_orani
    # adim basina beklenen kabul edilen token sayisi (+1 bonus token)
    if a == 1.0:
        beklenen_token = k + 1
    else:
        beklenen_token = (1 - a ** (k + 1)) / (1 - a)
    adim_maliyeti = 1.0 + taslak_maliyeti      # dogrulama + taslak
    return beklenen_token / adim_maliyeti

for a in (0.9, 0.7, 0.5, 0.3):
    print(a, round(beklenen_hizlanma(a, k=4, taslak_maliyeti=0.15), 2))

# 0.9 -> 3.56    yuksek kabul: buyuk kazanc
# 0.7 -> 2.41
# 0.5 -> 1.68
# 0.3 -> 1.24    dusuk kabul: kazanc taslak maliyetine yaklasir
```

Model iki şeyi gösteriyor. Birincisi, kabul oranı düştükçe kazanç hızla erir. İkincisi ve daha az bilineni: _k_'yı büyütmek her zaman iyi değildir — düşük kabul oranında uzun öneriler zaten reddedilecek token'lar için taslak maliyeti ödetir. Düşük kabulde `k`'yı küçültmek, büyütmekten daha çok kazandırır.

## vLLM'de yapılandırma

Yapılandırma tek bir bayrakla, JSON olarak verilir:

```text
# n-gram: ek model yok, en ucuz baslangic
vllm serve MODEL_ADI \
  --speculative-config '{"method": "ngram", "num_speculative_tokens": 4}'

# Taslak model: ayni tokenizer'i paylasan kucuk bir model
vllm serve BUYUK_MODEL \
  --speculative-config '{"method": "draft", "model": "KUCUK_MODEL", "num_speculative_tokens": 4}'

# EAGLE
vllm serve MODEL_ADI \
  --speculative-config '{"method": "eagle", "model": "EAGLE_BASLIK", "num_speculative_tokens": 4}'
```

Üretime almadan önce bilinmesi gereken bir kısıt var: vLLM **0.15.0 ve öncesinde spekülatif kod çözme boru hattı paralelliği (pipeline parallelism) ile uyumlu değildir.** Tek düğüme sığmayan ve bu yüzden boru hattı paralelliğiyle bölünmüş bir modelde spekülasyon planlıyorsanız, sürümü önce doğrulayın.

Ölçüm tarafında doğru yöntem, toplam süreye bakmak değil **ITL**'i (token'lar arası gecikme) ve kabul oranını birlikte izlemektir. Spekülasyon ilk token süresini (TTFT) iyileştirmez — o aşama zaten hesaplama sınırlıdır. İyileştirdiği şey, ilk token'dan sonraki akış hızıdır.

## İşe yaramadığı yerler

En dürüst bölüm bu, çünkü spekülasyon bir "aç ve unut" ayarı değil.

-   **Yüksek QPS / doygun GPU:** continuous batching zaten bant genişliğini doldurmuşsa spekülasyonun kullanacağı boş kapasite yoktur. Kazanç erir, hatta negatife dönebilir. En büyük fayda düşük ve orta trafikte, gecikmeye duyarlı tekil isteklerdedir.
-   **Toplu iş (batch) verimi hedefiyse:** spekülasyon gecikme optimizasyonudur, verim optimizasyonu değil. Gecelik toplu işlerde ölçtüğünüz metrik zaten yanlış metriktir.
-   **Yüksek sıcaklık ve çeşitlilik:** örnekleme ayarları çıktıyı ne kadar çeşitlendirirse, taslağın hedefi bilmesi o kadar zorlaşır ve kabul oranı düşer.
-   **Yaratıcı ve serbest metin:** tahmin edilebilirliğin düşük olduğu her yerde kabul oranı düşer. Buna karşılık kod, JSON, şablonlu yanıt ve alıntı ağırlıklı RAG çıktıları en verimli alandır.
-   **Taslak/hedef uyumsuzluğu:** taslak modelin tokenizer'ı ve dil kapsamı hedefle örtüşmüyorsa kabul oranı çöker. Türkçe için pratik uyarı: ağırlıklı olarak İngilizce veriyle eğitilmiş küçük bir taslak model, Türkçe üretimde İngilizce'dekinden belirgin biçimde düşük kabul oranı verir. Kabul oranını mutlaka _Türkçe_ istek örnekleminizde ölçün; İngilizce ölçüp Türkçe'ye taşımayın.

Karar kuralı basit: önce n-gram'ı açın, kabul oranını kendi trafiğinizde ölçün, kazanç anlamlıysa daha ağır yöntemlere geçin. Ölçmeden EAGLE dağıtmak, çoğu ekipte VRAM'in karşılıksız harcanmasıyla sonuçlanıyor.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Kod çözme bellek bant genişliği sınırlıdır; spekülasyon boştaki hesaplama kapasitesini token'a çevirir.</li><li>Doğru kurulduğunda çıktı dağılımını değiştirmez — kalite ödünü olmayan nadir bir optimizasyondur.</li><li>Sabit bir hızlanma çarpanı yoktur; ölçülecek tek metrik kendi trafiğinizdeki kabul oranıdır.</li><li>Yüksek QPS'te, yüksek sıcaklıkta ve serbest metinde kazanç erir; kod, JSON ve alıntılı RAG'de en yüksektir.</li></ul></div>

<div class="faq"><details><summary>Speculative decoding nedir, kaliteyi düşürür mü?</summary><p>Küçük ve ucuz bir tahmincinin sonraki birkaç token'ı önerdiği, asıl modelin ise hepsini tek geçişte doğruladığı bir çıkarım hızlandırma tekniğidir. Kabul kuralı doğru uygulandığında çıktı dağılımı değişmez, yani kalite kaybı olmaz — bu yönüyle kuantizasyondan farklıdır. Kabul edilmeyen öneriler atılır ve o adımda hedef modelin kendi token'ı yazılır.</p></details><details><summary>Kaç kat hızlanma beklemeliyim?</summary><p>Dürüst cevap: bilinemez, ölçülür. vLLM dokümantasyonu bilinçli olarak bir çarpan yayımlamaz çünkü gerçek kazanç model ailesine, trafik desenine, donanıma ve örnekleme ayarlarına bağlıdır. Kabul oranınızı ölçün; 0,9 kabulle dört token öneride kazanç büyük, 0,3 kabulle kayda değmez.</p></details><details><summary>Hangi yöntemle başlamalıyım?</summary><p>Ek model gerektirmeyen n-gram veya suffix decoding ile — bunlar tek bir yapılandırma satırıdır, VRAM maliyeti yoktur ve tekrarlı metinde iyi çalışırlar. Kazanç yetersizse, hedef modeliniz MTP'yi doğal destekliyorsa MTP'ye, desteklemiyorsa EAGLE'a geçin. Taslak model klasik ama en pahalı seçenektir çünkü tokenizer uyumu ve ek VRAM gerektirir.</p></details></div>

---

Spekülasyon, aynı ağırlıklardan daha hızlı token almanın en temiz yolu; ama tek başına bir altyapı stratejisi değil. Taslak modelin nereden geleceği için [küçük dil modelleri](/posts/kucuk-dil-modelleri/), gecikme dışındaki kaldıraçlar için [LLM maliyet optimizasyonu](/posts/llm-maliyet-optimizasyonu/), ve bu ölçümleri kalıcı hâle getirmek için [MLOps ve üretime alma](/posts/mlops-uretim/) yazılarına bakabilirsiniz.
