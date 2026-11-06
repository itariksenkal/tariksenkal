---
title: "LLM'leri Nasıl Değerlendiririz? Otomatik Ölçütler, LLM-as-Judge ve RAG Sadakati"
description: "LLM değerlendirmesi rehberi: otomatik ölçütler, LLM-as-judge, insan değerlendirmesi, alan-özel test setleri ve RAG için sadakat (faithfulness) ölçümü."
publishDate: "2026-08-09T23:07:00+03:00"
lang: tr
category: "Ölçme"
tags: ["Ölçme", "Yapay Zeka"]
translation: "llm-evaluation"
heroImage:
  src: "../../../assets/blog/covers/llm-degerlendirme.jpg"
  alt: "LLM'leri Nasıl Değerlendiririz? Otomatik Ölçütler, LLM-as-Judge ve RAG Sadakati"
---

Bir dil modelini geliştirmek kolay, ama onun gerçekten "iyi" olup olmadığını anlamak çok daha zor. Çünkü "iyi cevap" çoğu zaman tek bir doğru sayıya indirgenemez. Bu yazıda LLM'leri değerlendirmenin başlıca yollarını, hangisinin ne zaman işe yaradığını ve özellikle RAG sistemlerinde sadakat (faithfulness) ölçümünü sezgisel biçimde ele alıyoruz.

## Neden değerlendirme zor?

Bir matematik sınavını düşünün: cevap ya doğrudur ya yanlış, puanlamak kolaydır. Şimdi bir kompozisyon sınavını düşünün. "İyi" bir kompozisyon nedir? Akıcılık mı, özgünlük mü, konuya sadakat mi? İki öğretmen aynı metne farklı not verebilir. LLM çıktıları çoğunlukla ikinci türdendir: serbest metin, çok sayıda "kabul edilebilir" cevap, ve bağlama göre değişen "doğruluk" tanımı.

Bu yüzden tek bir ölçüt yeterli olmaz. Değerlendirmeyi katmanlı düşünmek gerekir: ucuz ve hızlı otomatik kontrollerden başlayıp, gerektiğinde daha pahalı ama daha güvenilir insan yargısına doğru ilerleyen bir piramit.

> Ölçemediğiniz şeyi iyileştiremezsiniz; ama yanlış ölçtüğünüz şey sizi yanlış yöne iyileştirir.

## Otomatik ölçütler

En ucuz katman, bir referans cevabı ile model çıktısını otomatik karşılaştıran ölçütlerdir. Bunlar hızlıdır, tekrarlanabilir ve insan gerektirmez; ama yüzeyseldirler.

-   **Tam eşleşme / doğruluk (accuracy):** Cevabın bilinen bir etikete birebir uyduğu görevler için idealdir; örneğin çoktan seçmeli sorular, sınıflandırma, çıkarım (extraction). "Cevap A mı?" gibi.
-   **Örtüşme ölçütleri (BLEU, ROUGE):** Çeviri ve özetlemede, üretilen metin ile referans arasındaki kelime/öbek örtüşmesini sayar. Hızlıdır ama anlamı değil yüzeyi ölçer: aynı anlamı farklı kelimelerle söylerseniz düşük puan alabilirsiniz.
-   **Gömme tabanlı benzerlik (örn. BERTScore):** Metinleri anlam vektörlerine çevirip benzerliklerine bakar. Eş anlamlılığı kelime örtüşmesinden daha iyi yakalar.
-   **pass@k (kod için):** Üretilen kod, gerçekten testlerden geçiyor mu? Burada "doğruluk" tartışmasız ölçülebilir; çalışır ya da çalışmaz.

<div class="callout"><strong>İpucu:</strong> Otomatik ölçütleri "duman testi" gibi kullanın. Düşük puan kötüye işarettir; ama yüksek puan tek başına "kaliteli" anlamına gelmez. Bir özet, referansla yüksek örtüşse de yanlış bir iddia içerebilir.</div>

## LLM-as-judge: modeli hakem yapmak

BLEU gibi ölçütler anlamı kaçırınca, akla doğal bir fikir gelir: cevabı başka güçlü bir dil modeline değerlendirtmek. Buna "LLM-as-judge" denir. Hakem modele bir _kriter listesi_ (rubric) ve değerlendirilecek cevap verilir; o da puan veya tercih üretir.

İki yaygın biçim vardır: tek cevaba puan verme (örneğin 1-5 arası), ve iki cevap arasında tercih yaptırma (A mı B mi daha iyi?). İkincisi genelde daha kararlıdır, çünkü "mutlak puan" insanlar için de zordur ama "hangisi daha iyi" sorusu daha tutarlı yanıtlanır.

```text
SİSTEM: Bir cevabı değerlendiren tarafsız bir hakemsin.
Aşağıdaki ölçütleri 1-5 arası puanla ve gerekçe yaz.
- Doğruluk: İddialar olgusal mı?
- İlgililik: Soruyu yanıtlıyor mu?
- Sadakat: Yalnızca verilen bağlama mı dayanıyor?

SORU: {soru}
BAĞLAM: {getirilen_belgeler}
CEVAP: {model_cevabi}

ÇIKTI (JSON):
{"dogruluk": ?, "ilgililik": ?, "sadakat": ?, "gerekce": "..."}
```

Güçlüdür ama tuzakları vardır. Hakem modeller **uzun cevapları** ve **kendine benzeyen üslubu** haksız yere kayırabilir; seçeneklerin sırasına göre önyargı gösterebilir (A'yı sırf önce geldiği için seçmek). Bu yüzden seçenek sırasını rastgeleleştirmek, net bir rubric vermek ve hakem kararlarını ara sıra insanla doğrulamak iyi pratiktir.

## İnsan değerlendirmesi

Altın standart hâlâ insandır. Özellikle üslup, yardımseverlik, güvenlik ve incelikli alan bilgisi gibi konularda insan yargısının yerini hiçbir ölçüt tam dolduramaz. Yaygın yöntemler:

-   **Likert ölçeği:** Değerlendiriciler her cevabı 1-5 gibi bir ölçekte puanlar.
-   **İkili karşılaştırma (A/B):** İki çıktıdan hangisinin daha iyi olduğu sorulur. İnsanlar göreli yargıda mutlak puana göre daha tutarlıdır.
-   **Hata etiketleme:** Değerlendirici cevabın _nerede_ hata yaptığını işaretler (uydurma, eksik bilgi, ton hatası). Bu, yalnızca "kaç puan" değil, "neyi düzeltmeli" sorusuna da yanıt verir.

İnsan değerlendirmesinin zayıf yanı maliyet ve tutarlılıktır. İki değerlendirici arasındaki uyumu (inter-annotator agreement) ölçmek, net yönergeler yazmak ve birden çok kişiye aynı örneği gösterip ortalamasını almak şarttır.

## Alan-özel test setleri

Genel kıyaslama (benchmark) tabloları parlak görünür ama sizin işinizi yansıtmayabilir. Bir model genel bilgi testinde mükemmel olup, sizin sözleşme maddelerinizi veya tıbbi notlarınızı yorumlamada zayıf kalabilir. Çözüm: **kendi alanınıza özel, gerçek örneklerden oluşan bir test seti.**

İyi bir alan-özel set şu özelliklere sahiptir:

1.  **Temsil gücü:** Gerçek kullanıcı sorularının dağılımını yansıtır, sadece kolay örnekleri değil.
2.  **Zor vakalar:** Bilinçli olarak köşe durumları, tuzak sorular ve belirsizlikler içerir.
3.  **Uzman onaylı cevaplar:** Referans cevaplar alanın uzmanı tarafından doğrulanmıştır.
4.  **Kapalı tutma:** Eğitim verisine sızmamış olması için ayrı saklanır.

<div class="callout"><strong>İpucu:</strong> 50-100 iyi seçilmiş, uzmanca etiketlenmiş örnek, on binlerce gürültülü örnekten daha değerlidir. Önce küçük ama temiz bir set kurun, zamanla genişletin.</div>

## RAG için sadakat (faithfulness) ölçümü

RAG (getirip-üreten) sistemlerde ayrı bir soru vardır: model, kendisine verilen belgelere _sadık_ mı kaldı, yoksa kafasından bir şeyler mi uydurdu? Buna sadakat (faithfulness) denir ve doğruluktan farklıdır.

Analojiyle: açık kitap sınavına giren bir öğrenci düşünün. "Doğruluk" cevabın gerçekte doğru olmasıdır. "Sadakat" ise öğrencinin cevabını gerçekten kitaptaki sayfalardan çıkarıp çıkarmadığıdır. Bir öğrenci doğru cevabı şans eseri uydurmuş olabilir (sadık değil ama doğru), ya da kitabı yanlış okuyup sadık kalarak yanlış cevap verebilir.

Sadakati ölçmenin pratik yolu, cevabı tek tek **iddialara (claim)** ayırıp her birinin getirilen bağlamca desteklenip desteklenmediğini kontrol etmektir:

```python
# Sadakat ~ bağlamca desteklenen iddialar / toplam iddia
iddialar = cevabi_iddialara_ayir(cevap)        # 1) cümleleri/savları çıkar
destekli = 0
for iddia in iddialar:
    if baglam_destekliyor_mu(iddia, getirilen_belgeler):  # 2) hakem/NLI kontrolü
        destekli += 1
sadakat = destekli / max(len(iddialar), 1)     # 3) oran = sadakat skoru
```

RAG'de tek bir skor yetmez; iki ekseni birlikte izlemek gerekir:

-   **Sadakat (faithfulness):** Cevap, getirilen belgelerle çelişiyor mu? Uydurma var mı?
-   **Bağlam ilgililiği (context relevance):** Getirilen belgeler soruyla gerçekten ilgili mi? Sadık ama alakasız bir cevap da işe yaramaz.

Açık kaynak araç setleri (örneğin RAGAS gibi yaklaşımlar) bu iddia-temelli sadakat ve ilgililik ölçümlerini büyük ölçüde LLM-as-judge ile otomatikleştirir; ama yine de ara sıra insan denetimiyle kalibre edilmeleri gerekir.

## Pratik bir karma strateji

Tek bir yöntem her şeyi çözmez. İşe yarayan yaklaşım, katmanları birleştiren bir hunidir:

1.  **Geliştirme döngüsünde:** Hızlı otomatik ölçütler ve LLM-as-judge ile her değişikliği anında kontrol edin (ucuz, sürekli).
2.  **Yayın öncesi:** Alan-özel test setinde, sadakat dahil, ayrıntılı koşturma yapın.
3.  **Düzenli aralıklarla:** Küçük ama temsili bir örneklemi insanla değerlendirin ve LLM hakeminizi insan yargısıyla kalibre edin.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Tek bir ölçüt LLM kalitesini ölçemez; katmanlı düşünün.</li><li>Otomatik ölçütler hızlıdır ama yüzeyseldir; "duman testi" olarak kullanın.</li><li>LLM-as-judge ölçeklenebilir ama önyargılara (uzunluk, sıra, üslup) açıktır.</li><li>İnsan değerlendirmesi altın standart kalır; tutarlılık için uyum ölçün.</li><li>Genel benchmark yerine kendi alan-özel test setinizi kurun.</li><li>RAG'de doğruluk ile sadakati ayırın; sadakati iddia-temelli ölçün.</li></ul></div>

<div class="faq"><details><summary>LLM-as-judge insan değerlendirmesinin yerini alır mı?</summary><p>Tam olarak değil. Ölçeklenebilir bir vekildir; rutin kontroller için harikadır. Ama önyargıları olduğundan, kararlarını düzenli olarak insan örneklemiyle kalibre etmek gerekir. En iyisi ikisini birlikte kullanmaktır.</p></details><details><summary>Sadakat (faithfulness) ile doğruluk (accuracy) aynı şey mi?</summary><p>Hayır. Doğruluk, cevabın gerçekte doğru olmasıdır. Sadakat ise cevabın yalnızca verilen bağlama dayanıp dayanmadığıdır. Bir cevap sadık olup yanlış (yanlış belge), ya da doğru olup sadık olmayabilir (uydurma).</p></details><details><summary>Küçük bir test seti güvenilir olur mu?</summary><p>İyi seçilmiş ve uzmanca etiketlenmiş 50-100 örnek, gürültülü on binlerce örnekten daha bilgilendirici olabilir. Önce temiz ve temsili bir küçük set kurun, sonra büyütün.</p></details></div>

---

Özetle, LLM değerlendirmesi tek bir sayı değil, bir disiplindir: ne ölçtüğünüzü bilmek, ucuz ve pahalı yöntemleri akıllıca karıştırmak ve özellikle RAG'de sadakati doğruluktan ayırmak.
