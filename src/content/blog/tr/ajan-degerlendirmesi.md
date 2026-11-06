---
title: "Ajan Değerlendirmesi: Çok Adımlı Sistemleri Nasıl Ölçersiniz?"
description: "Bir ajanı değerlendirmek tek bir cevabı puanlamaktan farklıdır. Görev başarısı, adım kalitesi, araç seçimi, maliyet ve kırılganlık testleriyle ajan değerlendirme çerçevesi."
publishDate: "2026-08-09T23:29:00+03:00"
lang: tr
category: "Ajanlar"
tags: ["Ajanlar", "Yapay Zeka"]
translation: "agent-evaluation"
heroImage:
  src: "../../../assets/blog/covers/ajan-degerlendirmesi.jpg"
  alt: "Ajan Değerlendirmesi: Çok Adımlı Sistemleri Nasıl Ölçersiniz?"
---

Tek soruluk bir modeli değerlendirmek nispeten kolaydır: cevabı bir referansla karşılaştırırsınız. Bir ajan ise on beş adım atar, üç araç çağırır, bir hata alır, geri döner ve sonunda bir şey üretir. Bu durumda "doğru mu?" sorusu tek başına yetersizdir — **hangi adımda ne olduğunu** da bilmeniz gerekir.

## Dört ölçüm katmanı

-   **Görev başarısı:** Kullanıcının istediği sonuç elde edildi mi? İkili ve tartışmasız olmalıdır.
-   **Yol kalitesi:** Sonuca makul bir yoldan mı ulaşıldı, yoksa şansa mı kalındı?
-   **Verimlilik:** Kaç adım, kaç token, ne kadar süre?
-   **Güvenlik:** Yetkisi dışına çıktı mı, geri alınamaz bir şey yaptı mı?

## Sonuç mu, yol mu

Yalnızca sonuca bakmak cazip ama yanıltıcıdır. Doğru sonuca yanlış yoldan ulaşan bir ajan, koşullar biraz değiştiğinde çöker. Tersi de geçerlidir: yolu doğru olup son adımda hata yapan bir ajanı düzeltmek çok daha kolaydır.

Pratik yaklaşım ikisini birlikte kaydetmektir: sonuç ikili olarak puanlanır, yol ise adım adım incelenebilir biçimde loglanır.

<div class="callout"><strong>Altın kural:</strong> Yeniden üretilebilir bir görev seti olmadan ajan geliştirilemez. Elle birkaç örnek denemek, gerilemeleri asla yakalamaz.</div>

## Araç seçimini ölçmek

| Hata tipi | Belirti |
| --- | --- |
| Yanlış araç | Doğru araç varken başkası çağrılıyor |
| Eksik çağrı | Araç kullanılması gerekirken model uyduruyor |
| Gereksiz çağrı | Cevap zaten bilinirken pahalı araç çağrılıyor |
| Hatalı parametre | Doğru araç, yanlış argüman |

Bu dört hatanın çözümü farklıdır: ilki araç tanımlarını netleştirmeyi, ikincisi talimatı sıkılaştırmayı, üçüncüsü yönlendirmeyi, dördüncüsü şema doğrulamasını gerektirir. Ayırmadan iyileştiremezsiniz.

## Kırılganlık testleri

Gerçek dünyada araçlar hata verir, API'ler zaman aşımına uğrar, belgeler eksik gelir. İyi bir değerlendirme seti bunları bilerek içerir: bozuk bir araç yanıtı, boş bir sonuç kümesi, çelişkili iki kaynak. Ajanın bu durumlarda ne yaptığı, ideal koşullardaki performansından daha çok şey söyler.

En değerli tek test şudur: _cevabı bilmiyorsa ne yapıyor?_ Uyduran bir ajan, üretimde en pahalı ajandır.

## Maliyet ve gecikme birer metriktir

Ajan değerlendirmesinde doğruluk tek başına anlamsızdır. Yüzde iki daha doğru ama üç kat pahalı bir sürüm, çoğu ürün için gerileme sayılır. Her değerlendirme çalıştırmasında görev başına ortalama token ve süre raporlanmalıdır.

## Sık sorulanlar

<div class="faq"><details><summary>LLM-as-judge ajanlar için işe yarar mı?</summary><p>Yol kalitesi gibi öznel boyutlarda evet, ama görev başarısı mümkünse programatik olarak kontrol edilmelidir. Belirsiz bir hakem, belirsiz bir metrik üretir.</p></details><details><summary>Kaç görev yeterli?</summary><p>Elli iyi seçilmiş görev, beş yüz rastgele görevden faydalıdır. Kapsamı çeşitlendirin: kolay, zor, tuzaklı ve başarısız olması gereken görevler.</p></details><details><summary>Ajan sonuçları neden her seferinde farklı?</summary><p>Örnekleme rastgeledir. Aynı görevi birkaç kez çalıştırıp başarı oranını raporlayın; tek çalıştırma bir ölçüm değildir.</p></details></div>

---

Ajan değerlendirmesi, geliştirme hızınızı belirleyen altyapıdır: ölçemediğiniz bir sistemi ancak tahminle iyileştirebilirsiniz. Devamı için [LLM değerlendirme](/posts/llm-degerlendirme/) ve [gözlemlenebilirlik](/posts/llm-gozlemlenebilirlik/) yazılarına bakabilirsiniz.
