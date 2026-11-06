---
title: "Yapay Zekâ Girişiminde İlk Ürün Nasıl Seçilir?"
description: "Gerçek problemle başlamak, kapsamı daraltmak, demodan önce test seti kurmak, fiyatı token'a değil değere bağlamak: ilk yapay zekâ ürünü için bir çerçeve."
publishDate: "2026-11-27T09:17:00+03:00"
lang: tr
category: "Girişim"
tags: ["Girişimcilik", "Yapay Zeka", "Ürün Geliştirme"]
translation: "first-product-for-an-ai-startup"
heroImage:
  src: "../../../assets/blog/covers/yapay-zeka-girisiminde-ilk-urun.jpg"
  alt: "Beyaz tahtada ürün fikirleri ve kullanıcı akışı çizen bir ekip"
---

Güçlü dil modellerine bir API çağrısıyla erişilebildiği bir dönemde, bir yapay zekâ ürününün ilk demosunu hazırlamak hiç bu kadar kolay olmamıştı. Ama tam da bu yüzden, ilk ürünü seçmek hiç bu kadar zor olmamıştı: Etkileyici bir demo artık kendi başına bir ayrışma değil. Yapay zekâ girişimlerinin önemli bir kısmı, teknolojisi çalıştığı halde, kimsenin düzenli olarak para ödeyeceği bir problemi çözmediği için zorlanıyor. Bu yazıda ilk yapay zekâ ürününü seçerken kullanışlı bulduğum bir çerçeveyi paylaşmak istiyorum: gerçek problemle başlamak, kapsamı daraltmak, demodan önce değerlendirme seti kurmak, veri ve geri bildirim döngüsünü baştan tasarlamak, fiyatı değere bağlamak ve sık düşülen tuzaklardan kaçınmak.

## Önce problem, sonra model

"Elimizde güçlü bir model var, bununla ne yapabiliriz?" sorusu, ürün aramaya başlamak için yanlış bir noktadır. Daha iyi soru şudur: "Kim, hangi işi yaparken, hangi adımda zaman ya da para kaybediyor ve bunu bugün nasıl çözüyor?"

İyi bir ilk problemin birkaç ortak özelliği var:

-   **Sık tekrarlanır:** Haftada bir değil, günde birçok kez yaşanan bir iş.
-   **Bugün pahalıdır:** İnsan saati, hata maliyeti ya da gecikme açısından ölçülebilir bir bedeli vardır.
-   **Sahibi bellidir:** Problemi yaşayan kişi ile satın alma kararını veren kişi arasındaki ilişki nettir.
-   **Hata toleransı uygundur:** Yapay zekâ hatasız değildir; ilk ürün için, hataların fark edilip düzeltilebildiği işler daha uygundur.

Paul Graham'ın 2013 tarihli "Do Things that Don't Scale" yazısındaki tavsiye burada da geçerli: İlk kullanıcıları tek tek kendiniz bulun, onların işini neredeyse elle yapacak kadar yakından tanıyın. Yapay zekâ ürünlerinde bu, ilk aşamada çıktıların bir kısmını bizzat kontrol etmek, kullanıcının iş akışını yanında oturup izlemek anlamına gelebilir.

## Kapsamı daraltmak: "her şeyi yapan asistan" tuzağı

İlk ürünün en yaygın hatası fazla geniş olmaktır: "Şirketinizin tüm belgelerine cevap veren asistan" ya da "her sektör için yapay zekâ çözümü". Geniş kapsam üç sorun doğurur: neyin başarı olduğunu ölçemezsiniz, kimin için yaptığınızı anlatamazsınız ve büyük şirketlerin genel amaçlı ürünleriyle doğrudan rekabete girersiniz.

Dar bir kapsam ise şöyle görünür: belirli bir kullanıcı (örneğin bir muhasebe bürosundaki uzman), belirli bir iş (belirli türdeki belgeleri kontrol etmek), belirli bir girdi formatı ve net bir çıktı. Dar başlamak küçük kalmak anlamına gelmez; bir işte gerçekten iyi olduktan sonra komşu işlere genişlemek çok daha kolaydır.

<div class="callout"><strong>İpucu:</strong> Ürününüzü tek bir cümleyle anlatmayı deneyin: "[Kim] için, [hangi işi], [bugünkü yönteme göre ne kadar] daha hızlı/ucuz/doğru yapan bir araç." Bu cümleyi kuramıyorsanız kapsam muhtemelen hâlâ fazla geniş.</div>

## Demodan önce değerlendirme seti

Yapay zekâ ürünlerinde demo yanıltıcıdır: En iyi on örnekle hazırlanan bir demo harika görünür, ama gerçek kullanıcılar ilk gün demoda olmayan yüzlerce durumla gelir. Bu yüzden ilk iş, kullanıcıların gerçek girdilerinden oluşan ve "doğru cevabın" ne olduğunun bilindiği küçük bir **değerlendirme seti** kurmaktır.

Pratik bir başlangıç:

1.  Kullanıcılarla birlikte 50–200 gerçekçi örnek toplayın; kolay, orta ve zor vakaları dahil edin.
2.  Her örnek için beklenen çıktıyı veya kabul kriterini yazın.
3.  Her değişiklikten sonra (model, istem, veri hattı) seti çalıştırıp sonucu karşılaştırın.
4.  Hataları türlerine göre sınıflandırın; hangi hata türünün kullanıcıya en pahalıya mal olduğunu bilin.

Hamel Husain'in 2024 tarihli "Your AI Product Needs Evals" yazısı bu yaklaşımı iyi özetliyor: Yapay zekâ ürünlerinde ilerleme hızını belirleyen şey, kaliteyi ne kadar hızlı ölçebildiğinizdir; bunun için de verilere, yani modelin gerçek çıktılarına düzenli olarak bakmak gerekir. Risk yönetimi açısından ise NIST'in 2023'te yayımladığı Yapay Zekâ Risk Yönetimi Çerçevesi (AI RMF), ölçme ve izlemeyi riskleri yönetmenin temel işlevleri arasında sayıyor.

## Veri ve geri bildirim döngüsü

İlk günden şunu sorun: "Ürün kullanıldıkça nasıl daha iyi olacak?" Bunun cevabı genellikle bir geri bildirim döngüsüdür:

-   Kullanıcının çıktıyı düzelttiği anları kaydetmek (izin ve gizlilik kurallarına uyarak),
-   Bu düzeltmeleri değerlendirme setine ve gerekirse istem, getirme (RAG) ya da ince ayar verisine dönüştürmek,
-   Hangi tür girdilerde ürünün zorlandığını düzenli olarak raporlamak.

Burada veri gizliliği ikinci planda bırakılamaz. Müşteri verisinin nerede işlendiği, ne kadar saklandığı ve model eğitiminde kullanılıp kullanılmadığı, özellikle kurumsal müşteriler için satın alma kararının parçasıdır. Bu soruların cevabını ürünü tasarlarken netleştirmek, satış aşamasında ciddi zaman kazandırır.

## Fiyatı token'a değil değere bağlamak

Yapay zekâ ürünlerinde maliyet genellikle kullanılan token ya da çağrı sayısıyla ölçülür; bu yüzden fiyatı da buna göre belirlemek cazip gelir. Ama müşteri token satın almaz; zaman, doğruluk ya da gelir satın alır. "Bin istek başına şu kadar" yerine "işlenen belge başına", "kullanıcı başına" ya da "tasarruf edilen saatin bir kısmı" gibi müşterinin anladığı birimlerle fiyatlandırmak hem satışı hem de değeri anlatmayı kolaylaştırır.

Bununla birlikte maliyeti bilmek şarttır: Her işlemin size maliyetini ve ağır kullanıcıların marjınızı nasıl etkilediğini erkenden hesaplayın. Model kullanım maliyetleri zamanla düşme eğiliminde; Stanford'un 2025 AI Index raporuna göre GPT-3.5 düzeyindeki bir sistemi çalıştırmanın maliyeti Kasım 2022 ile Ekim 2024 arasında 280 kattan fazla azaldı. Yine de maliyeti hiç izlemeyen bir ürün beklenmedik faturalarla karşılaşabilir.

| Yaklaşım | Avantaj | Risk |
|---|---|---|
| Token/çağrı başına | Maliyetle birebir uyumlu | Müşteri değeri göremez, fatura öngörülemez |
| Kullanıcı başına abonelik | Basit ve öngörülebilir | Ağır kullanıcılar marjı eritebilir |
| İş birimi başına (belge, vaka) | Değerle doğrudan bağlantılı | Birim tanımı net olmalı |
| Sonuca dayalı | Güçlü değer anlatısı | Ölçmek ve sözleşmeye bağlamak zor |

## Sık düşülen tuzaklar

-   **Demo ile ürünü karıştırmak:** Hata yönetimi, yetkilendirme, kayıt tutma ve destek, demodan çok daha fazla iş gerektirir.
-   **Tek bir modele bağımlı kalmak:** Mimariyi, model değiştirmeyi kolaylaştıracak biçimde kurmak uzun vadede esneklik sağlar.
-   **"İnce bir katman" olmak:** Yalnızca genel bir modele istem gönderen bir ürün, modelin sağlayıcısı aynı özelliği eklediğinde değerini kaybedebilir. Alan verisi, iş akışı entegrasyonu ve değerlendirme birikimi daha kalıcı avantajlardır.
-   **Kullanıcıyla konuşmayı bırakmak:** İlk ürün, kullanıcıyla düzenli temas olmadan gelişemez.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>İlk ürün, sık tekrarlanan, bugün pahalı olan ve sahibi belli bir problemle başlamalı.</li><li>Dar kapsam ölçmeyi, anlatmayı ve rekabeti kolaylaştırır.</li><li>Demodan önce gerçek girdilerden oluşan bir değerlendirme seti kurun ve her değişiklikte çalıştırın.</li><li>Geri bildirim döngüsü ve veri gizliliği ilk günden tasarlanmalı.</li><li>Fiyatı müşterinin anladığı değer birimlerine bağlayın, maliyeti ise yakından izleyin.</li></ul></div>

<div class="faq"><details><summary>Kendi modelimizi eğitmeden girişim kurulabilir mi?</summary><p>Evet. Pek çok başarılı ürün hazır modeller üzerine kurulur. Kalıcı avantaj çoğu zaman modelin kendisinden değil, alan bilgisinden, verinin düzenlenmesinden, iş akışına entegrasyondan ve değerlendirme birikiminden gelir.</p></details><details><summary>Değerlendirme seti için kaç örnek yeterli?</summary><p>Başlangıç için birkaç düzine gerçekçi örnek bile hiç olmamasından çok daha iyidir. Ürün olgunlaştıkça, karşılaşılan yeni hata türlerini ekleyerek seti büyütmek en sağlıklı yoldur.</p></details><details><summary>İlk müşterileri nasıl bulmalı?</summary><p>Problemi yaşayan kişilerle doğrudan konuşarak. İlk aşamada ölçeklenmeyen işler yapmak, yani kullanıcıları tek tek bulmak ve iş akışlarını yakından izlemek, hem doğru ürünü bulmanızı hem de ilk sadık kullanıcıları kazanmanızı sağlar.</p></details></div>

---

**Kaynaklar**

-   [Paul Graham (2013), Do Things that Don't Scale](https://paulgraham.com/ds.html)
-   [Hamel Husain (2024), Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/)
-   [NIST, AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
-   [Stanford HAI, AI Index Report 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report)
