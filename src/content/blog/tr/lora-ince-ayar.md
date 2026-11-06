---
title: "LoRA ve Verimli İnce Ayar (PEFT): Tüm Modeli Eğitmeden Uyarlama"
description: "LoRA ve PEFT'i sezgisel olarak anlatıyoruz: tüm modeli eğitmeden, düşük ranklı küçük adaptörlerle uyarlama, bellek/maliyet avantajı ve pratik kullanım ipuçları."
publishDate: "2026-08-09T23:22:00+03:00"
lang: tr
category: "İnce Ayar"
tags: ["İnce Ayar", "Yapay Zeka"]
translation: "lora-peft-fine-tuning"
heroImage:
  src: "../../../assets/blog/bimg-04.jpg"
  alt: "LoRA ve Verimli İnce Ayar (PEFT): Tüm Modeli Eğitmeden Uyarlama"
---

Büyük bir dil modelini kendi göreviniz için uyarlamak istediğinizde ilk akla gelen yol, modeli baştan sona yeniden eğitmektir. Ama milyarlarca parametreyi güncellemek hem pahalı hem de yavaştır; çoğu ekip için pratikte imkânsızdır. LoRA (Low-Rank Adaptation) ve onun ait olduğu PEFT (Parameter-Efficient Fine-Tuning) ailesi tam burada devreye girer: modelin büyük gövdesine hiç dokunmadan, küçük ve ucuz “adaptör” parçaları eğiterek aynı uyarlamayı çok daha az bellek ve maliyetle yapmanızı sağlar. Bu yazıda LoRA’nın sezgisini, neden işe yaradığını ve pratikte nasıl kullanıldığını günlük analojilerle anlatıyoruz.

## Sorun: tüm modeli eğitmek neden pahalı?

Modern bir dil modeli milyarlarca parametre içerir. Bunların tamamını yeniden eğitmek (tam ince ayar) iki büyük yük getirir:

-   **Bellek:** Eğitim sırasında yalnızca parametreleri değil; bunların gradyanlarını ve optimizasyon durumlarını (örneğin Adam’ın tuttuğu iki ek değeri) da bellekte tutmanız gerekir. Bu, kabaca model boyutunun birkaç katı GPU belleği demektir.
-   **Saklama ve yönetim:** Her görev için modelin tam bir kopyasını saklarsınız. On farklı göreviniz varsa, on tane dev model dosyanız olur.

> Tam ince ayarda zorluk, modeli “öğretmek” değil; onu eğitecek donanımı bulmak ve sonuçları yönetmektir.

## PEFT nedir? Tek cümlede

**PEFT (Parameter-Efficient Fine-Tuning)**, modelin parametrelerinin büyük çoğunluğunu dondurup yalnızca küçük bir bölümünü ya da eklenen küçük yeni parçaları eğitme yaklaşımıdır. Amaç, tam ince ayara yakın kaliteyi, onun maliyetinin küçük bir kısmıyla yakalamaktır.

PEFT bir şemsiye terimdir; altında birden çok yöntem vardır (adaptör katmanları, prefix-tuning, prompt-tuning gibi). Bugün en yaygın ve pratik olanı ise **LoRA**’dır.

## LoRA’nın sezgisi: düşük ranklı adaptörler

LoRA’nın temel gözlemi şudur: bir modeli yeni bir göreve uyarlarken ağırlıklarda olması gereken _değişim_, aslında çok zengin bilgi taşımaz; “düşük ranklı” bir yapıyla iyi yaklaşılabilir. Yani büyük bir değişim matrisini, çok daha küçük iki matrisin çarpımı olarak temsil edebilirsiniz.

Pratikte LoRA, mevcut bir ağırlık matrisi `W`’yi dondurur ve onun yanına iki küçük matris ekler: bir `A` (aşağı projeksiyon) ve bir `B` (yukarı projeksiyon). Eğitim sırasında yalnızca `A` ve `B` güncellenir. Modelin son davranışı, orijinal çıktı ile bu küçük eklentinin toplamıdır.

Buradaki sihirli kelime **rank (r)**’dir. Eğer matris boyutu çok büyükse (örneğin 4096×4096), `A` ve `B`’yi yalnızca r=8 veya r=16 gibi küçük bir iç boyutla seçtiğinizde, eğitilen parametre sayısı milyarlardan birkaç milyona düşer.

<div class="callout"><strong>İpucu:</strong> Rank’i “ne kadar serbestlik tanıdığınız” olarak düşünün. Düşük rank daha az parametre ve daha hızlı eğitim demektir; çok düşük seçerseniz model yeni görevi öğrenmekte zorlanabilir. r=8–16 çoğu görev için sağlam bir başlangıçtır.</div>

## Asetat analojisi

Eski bir ders kitabınız olduğunu düşünün. Kitap mükemmel basılmış ama içeriği genel. Siz bunu kendi dersinize uyarlamak istiyorsunuz. İki yolunuz var:

-   **Tam ince ayar:** Kitabın her sayfasını silip baştan yazmak. Çok zaman ve mürekkep ister; üstelik artık herkesin elinde sizin kitabınız olur, orijinali kaybedersiniz.
-   **LoRA:** Kitabın üzerine şeffaf bir _asetat_ koyup notlarınızı oraya yazmak. Kitap aynen kalır; asetat küçüktür, ucuzdur, kolayca değiştirilebilir. Farklı dersler için farklı asetatlar hazırlarsınız ve hepsi aynı kitabın üzerinde çalışır.

İşte LoRA adaptörleri o asetatlardır: küçük, taşınabilir ve aynı temel modelin üzerine takılıp çıkarılabilir.

## Küçük bir kod örneği

Aşağıdaki kavramsal Python örneği, LoRA’nın bir katmanı nasıl sardığını gösterir:

```text
class LoRALinear:
    def __init__(self, W, r):
        self.W = W              # donmuş orijinal ağırlık (eğitilmez)
        d_out, d_in = W.shape
        self.A = randn(r, d_in) * 0.01   # küçük, eğitilir
        self.B = zeros(d_out, r)         # küçük, eğitilir

    def forward(self, x):
        # Orijinal yol + düşük ranklı düzeltme
        return x @ self.W.T + (x @ self.A.T) @ self.B.T

# Eğitimde yalnızca A ve B'nin gradyanı hesaplanır;
# milyarlarca parametre yerine yalnızca r * (d_in + d_out) parametre.
```

Dikkat edin: `B` sıfırla başlatılır, böylece eğitimin ilk anında adaptörün etkisi sıfırdır ve model orijinal davranışından sapmadan öğrenmeye başlar.

## Bellek ve maliyet avantajı

LoRA’nın getirisi yalnızca “daha az parametre” değildir; bu küçülme zincirleme avantajlar yaratır:

-   **Optimizasyon belleği düşer:** Optimizasyon durumlarını yalnızca eğitilen küçük adaptörler için tutarsınız. Donmuş gövde için gradyan veya optimizatör durumu saklamanız gerekmez.
-   **Saklama küçülür:** Bir görev için yalnızca adaptör ağırlıklarını saklarsınız; bunlar tam modelin yanında çok küçük dosyalardır. On görev için on dev model yerine, bir temel model ve on küçük adaptör tutarsınız.
-   **Dağıtım esnekliği:** Aynı temel modeli bellekte tutup farklı adaptörleri anlık takıp çıkarabilirsiniz. Tek bir sunucu birden çok özelleştirilmiş davranışı sırayla sunabilir.

> Özet: Donmuş gövde paylaşılır, asıl tasarruf eğitilen parçanın küçüklüğünden ve onun gradyan/optimizatör yükünün ortadan kalkmasından gelir.

## QLoRA: bir adım daha ileri

LoRA tek başına güçlüdür, ama temel modelin kendisi yine de belleğe sığmak zorundadır. **QLoRA** burada devreye girer: temel modeli düşük hassasiyetli (nicemlenmiş, örneğin 4-bit) bir biçimde belleğe yükler, ardından bunun üzerine normal LoRA adaptörlerini eğitir.

Sonuç, daha önce yalnızca büyük kümelerde mümkün olan model boyutlarının tek bir GPU’da uyarlanabilmesidir. Gövde nicemlenmiş ve dondurulmuş kalır; yalnızca küçük adaptörler tam hassasiyette eğitilir. Bu, “erişilebilir ince ayar” fikrini geniş kitlelere açan adımdı.

## Pratik kullanım ve ipuçları

LoRA’yı kendi projenizde uygularken birkaç pratik karar sizi bekler:

-   **Hangi katmanlara uygulanmalı?** Yaygın yaklaşım, dikkat (attention) katmanlarının projeksiyon matrislerini hedeflemektir. Daha fazla katmanı hedeflemek genelde kaliteyi artırır, parametre sayısını yine de düşük tutar.
-   **Rank ve alpha:** Rank kapasiteyi, `alpha` ise adaptörün ölçeğini belirler. Basit görevlerde düşük rank yeterlidir; karmaşık, üslup yoğun görevlerde rank’i artırmayı deneyin.
-   **Veri kalitesi her şeydir:** LoRA, tam ince ayar gibi yine de iyi, temiz örneklerle çalışır. Az ama kaliteli veri, çok ama gürültülü veriden iyidir.
-   **Birleştirme (merge):** Eğitim bittiğinde adaptörü temel modele kalıcı olarak kaynaştırabilir (ek çıkarım maliyeti olmaz) ya da ayrı tutup esnek bırakabilirsiniz.

LoRA, ince ayarı küçük ekipler için erişilebilir kıldı. Tüm modeli eğitmek yerine küçük bir adaptör eğitmek, hem deneme hızını artırır hem de maliyeti düşürür; bu da daha çok denemek, daha hızlı öğrenmek demektir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>PEFT, modelin gövdesini dondurup yalnızca küçük parçaları eğiterek tam ince ayara yakın kaliteyi çok daha ucuza yakalar.</li><li>LoRA, ağırlık değişimini iki küçük matris (A ve B) ile düşük ranklı olarak temsil eder; eğitilen parametre sayısı milyarlardan milyonlara iner.</li><li>Asıl tasarruf yalnızca parametre sayısından değil, kaybolan gradyan ve optimizatör yükünden gelir.</li><li>Adaptörler küçük ve taşınabilirdir: bir temel model + birçok adaptör, birçok dev model dosyasından iyidir.</li><li>QLoRA, nicemlenmiş temel model üzerine LoRA ekleyerek büyük modelleri tek bir GPU’da uyarlanabilir kılar.</li></ul></div>

<div class="faq"><details><summary>LoRA tam ince ayar kadar iyi sonuç verir mi?</summary><p>Birçok pratik görevde sonuçlar tam ince ayara oldukça yakındır ve genellikle aradaki fark, getirdiği bellek/maliyet avantajının yanında küçük kalır. Yine de görev, veri ve seçilen rank’e bağlıdır; çok geniş kapsamlı yeniden eğitim gerektiren durumlarda tam ince ayar üstün olabilir.</p></details><details><summary>LoRA çıkarım (inference) hızını yavaşlatır mı?</summary><p>Adaptörü ayrı tutarsanız ek bir küçük hesaplama olur. Ama eğitimden sonra adaptörü temel modele birleştirebilirsiniz; bu durumda çıkarım, orijinal modelle aynı hızda çalışır.</p></details><details><summary>Rank değerini nasıl seçmeliyim?</summary><p>r=8 veya r=16 ile başlamak çoğu görev için sağlam bir başlangıçtır. Model yeni görevi yeterince öğrenemiyorsa rank’i artırın; gereğinden yüksek seçmek hem parametreyi hem de aşırı uyum (overfitting) riskini artırabilir.</p></details></div>

---

LoRA ve PEFT, “güçlü modeller yalnızca büyük bütçeli ekiplerin işidir” fikrini büyük ölçüde kırdı. Doğru adaptör stratejisiyle küçük bir ekip bile bir modeli kendi alanına uyarlayabilir. Türkçe yapay zeka ürünlerinde verimli uyarlama yaklaşımlarını pratikte nasıl kullandığımızı merak ediyorsanız [HatsonTech](/posts/hatsontech-nedir/)’e göz atabilirsiniz.
