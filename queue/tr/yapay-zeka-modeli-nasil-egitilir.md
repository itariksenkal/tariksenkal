---
title: "Bir Yapay Zekâ Modeli Nasıl Eğitilir? Mühendis Olmayanlar İçin Rehber"
description: "Veri toplamadan ön eğitime, ince ayardan değerlendirmeye: bir dil modelinin hayat döngüsü, maliyeti ve veri kalitesinin neden belirleyici olduğu."
publishDate: "2026-11-21T09:17:00+03:00"
lang: tr
category: "Temeller"
tags: ["Yapay Zeka", "Dil Modelleri", "Veri"]
translation: "how-ai-models-are-trained"
heroImage:
  src: "../../../assets/blog/covers/yapay-zeka-modeli-nasil-egitilir.jpg"
  alt: "Bir yapay zekâ modelinin veri, eğitim ve değerlendirme aşamalarını gösteren şema"
---

Bir sohbet asistanına soru sorduğumuzda karşımıza akıcı, çoğu zaman isabetli bir cevap çıkıyor. Ama o cevabın arkasında aylar süren bir hazırlık var: milyarlarca sayfalık metnin toplanması, ayıklanması, binlerce işlemcide haftalarca süren bir eğitim ve ardından modelin "iyi bir yardımcı" olmayı öğrendiği ayrı bir aşama. Bu süreci bilmek yalnızca mühendisler için değil, yapay zekâyı işinde kullanan herkes için faydalı; çünkü bir modelin neyi iyi yaptığını, nerede hata yaptığını ve neden pahalı olduğunu büyük ölçüde bu hikâye açıklıyor. Bu yazıda bir dil modelinin hayatını, teknik ayrıntıya boğmadan adım adım anlatmaya çalışacağım.

## Her şey veriyle başlar

Bir dil modeli, temelde çok basit bir oyunu oynayarak öğrenir: bir metnin devamında hangi kelimenin (daha doğrusu hangi "token"ın, yani kelime parçasının) geleceğini tahmin etmek. Bu oyunu iyi oynayabilmesi için devasa miktarda örnek görmesi gerekir. Bu yüzden ilk iş veri toplamaktır: herkese açık web sayfaları, kitaplar, ansiklopedik içerikler, açık kaynak kodlar, bilimsel makaleler gibi kaynaklar bir araya getirilir.

Ham veri ise oldukça dağınıktır. Aynı sayfanın yüzlerce kopyası, reklam metinleri, bozuk karakterler, spam ve kişisel bilgiler bu yığının içindedir. Bu nedenle verinin büyük kısmı temizlenir: tekrarlar ayıklanır, düşük kaliteli sayfalar filtrelenir, dil tespiti yapılır, zararlı ya da hassas içerikler çıkarılmaya çalışılır. Hugging Face ekibinin 2024'te yayımladığı FineWeb çalışması bunun iyi bir örneği: 96 Common Crawl anlık görüntüsünden yaklaşık 15 trilyon token'lık bir veri seti üretilmiş ve bunun eğitim içeriklerine göre süzülmüş 1,3 trilyon token'lık bir alt kümesiyle eğitilen modellerin bilgi ve akıl yürütme ölçümlerinde belirgin biçimde daha iyi sonuç verdiği raporlanmış.

<div class="callout"><strong>İpucu:</strong> "Model ne kadar büyük?" sorusu kadar "Model hangi veriyle, ne kadar temiz bir veriyle eğitildi?" sorusu da önemlidir. Türkçe gibi dillerde iyi performansın ilk şartı, o dilde yeterli ve kaliteli metnin eğitim verisinde yer almasıdır.</div>

## Ön eğitim: dili ve dünyayı "okuyarak" öğrenmek

Temizlenen veri hazır olduğunda en uzun ve en pahalı aşama başlar: **ön eğitim** (pre-training). Model, metinlerin devamını tahmin etmeye çalışır; her yanlış tahminde iç parametreleri (milyarlarca küçük ayar düğmesi gibi düşünebilirsiniz) çok az miktarda düzeltilir. Bu işlem trilyonlarca token üzerinde tekrarlandıkça model dilbilgisini, kelimeler arasındaki ilişkileri, olgusal bilgileri ve hatta bazı akıl yürütme kalıplarını istatistiksel olarak içselleştirir.

Bu aşamanın sonunda elimizde bir **temel model** (base model) olur. Temel model çok şey bilir ama henüz iyi bir sohbet arkadaşı değildir: bir soruyu cevaplamak yerine soruya benzer başka sorular üretmeye devam edebilir. Çünkü ona öğretilen tek şey "metni sürdürmek"tir.

Bu aşamada önemli bir denge vardır: model boyutu ile veri miktarı. DeepMind araştırmacılarının 2022'de yayımladığı "Chinchilla" çalışması, aynı hesaplama bütçesiyle daha küçük ama yaklaşık dört kat daha fazla veriyle eğitilen 70 milyar parametreli bir modelin, 280 milyar parametreli Gopher'ı pek çok testte geçtiğini gösterdi. Yani yalnızca modeli büyütmek yetmiyor; ona yeterince ve doğru veri vermek de gerekiyor.

## İnce ayar ve hizalama: bilgili modelden yardımsever asistana

Temel modeli kullanışlı bir asistana dönüştürmek için ikinci bir aşama gelir. Kabaca iki adımdan oluşur:

1.  **Denetimli ince ayar (supervised fine-tuning):** İnsanların yazdığı örnek soru–cevap çiftleriyle model, talimatları izlemeyi ve uygun formatta cevap vermeyi öğrenir.
2.  **Tercihlerden öğrenme:** Model aynı soruya birkaç farklı cevap üretir, insanlar (veya insan tercihlerini taklit eden yardımcı modeller) bunları sıralar ve model daha çok tercih edilen cevaplara doğru yönlendirilir. En bilinen yöntem "insan geri bildirimiyle pekiştirmeli öğrenme"dir (RLHF).

Bu aşamanın etkisi şaşırtıcı derecede büyük olabiliyor. OpenAI'ın 2022 tarihli InstructGPT makalesinde, insan değerlendiriciler 1,3 milyar parametreli ince ayarlı modelin cevaplarını, yaklaşık 100 kat büyük olan 175 milyar parametreli GPT-3'ün cevaplarına tercih etmiş. Hizalama aşaması aynı zamanda modelin zararlı taleplere nasıl yaklaşacağının, belirsiz durumlarda nasıl davranacağının da şekillendiği yerdir.

## Değerlendirme: "iyi görünüyor" yeterli değil

Eğitilen bir model yayına çıkmadan önce ölçülür. Bunun için birkaç yol vardır:

-   **Standart testler (benchmark):** Matematik, kodlama, genel kültür, okuduğunu anlama gibi alanlarda hazır soru setleri.
-   **İnsan değerlendirmesi:** Gerçek kişilerin cevapları karşılaştırıp puanlaması.
-   **Güvenlik testleri:** Modeli kasıtlı olarak zorlayan, kötüye kullanım senaryolarını deneyen "kırmızı takım" çalışmaları.
-   **Alana özel testler:** Bir hukuk, sağlık ya da müşteri hizmetleri uygulaması için o alana özgü sorularla yapılan ölçümler.

Burada dikkat edilmesi gereken bir tuzak var: test soruları eğitim verisine sızmışsa model cevapları "ezberlemiş" olabilir ve skor olduğundan iyi görünür. Bu yüzden ciddi ekipler kendi, dışarıda yayımlanmamış test setlerini de kullanır. Ben de genel testlerdeki skordan çok, gerçek kullanım senaryolarına benzeyen küçük ama özenli test setlerine güvenmeyi tercih ediyorum.

## Hesaplama gücü ve maliyet nereden geliyor?

Büyük modellerin eğitimi binlerce grafik işlemcinin (GPU) haftalarca, hatta aylarca birlikte çalışmasını gerektirir. Maliyetin ana kalemleri şunlardır:

| Kalem | Ne anlama geliyor? |
|---|---|
| Donanım | GPU'lar, sunucular ve bunları birbirine bağlayan ağ altyapısı |
| Personel | Araştırmacılar ve mühendisler; deneyler, başarısız denemeler dahil |
| Enerji | Eğitim süresince harcanan elektrik ve soğutma |
| Veri | Toplama, temizleme, etiketleme ve insan geri bildirimi |

Epoch AI'ın 2024 tarihli analizine göre öncü modellerin son eğitim koşusunun maliyeti 2016'dan bu yana yılda yaklaşık 2,4 kat artmış; GPT-4 ve Gemini Ultra gibi modellerde maliyetin yaklaşık yarısı ile üçte ikisi arası donanıma, üçte biri ile yarısı arası personele, yalnızca yüzde 2–6'lık kısmı enerjiye gidiyor. Stanford'un 2025 AI Index raporu da önemli modellerin eğitiminde kullanılan hesaplama miktarının yaklaşık beş ayda bir ikiye katlandığını belirtiyor. Öte yandan aynı rapor, belirli bir performans seviyesindeki modeli çalıştırmanın (çıkarım) maliyetinin Kasım 2022 ile Ekim 2024 arasında 280 kattan fazla düştüğünü de not ediyor. Yani eğitmek pahalılaşırken kullanmak ucuzluyor.

Çoğu kurum için gerçekçi yol sıfırdan model eğitmek değildir. Hazır bir modeli kendi verisiyle ince ayarlamak, ya da modeli değiştirmeden belgelerini sorgu anında modele vermek (RAG) çok daha düşük maliyetlidir.

## Neden veri kalitesi her şeyin önünde?

Bir modelin davranışı, büyük ölçüde gördüğü verinin aynasıdır. Veride çok tekrar eden hatalar, önyargılar ya da eksik konular modelin cevaplarına doğrudan yansır. Bu yüzden sektörde sık duyulan bir gözlem var: aynı bütçeyle daha büyük bir model yerine daha temiz veriye yatırım yapmak çoğu zaman daha iyi sonuç verir. Yukarıda andığım Chinchilla ve FineWeb bulguları da bu yönde. İnce ayar aşamasında ise birkaç bin özenle hazırlanmış örnek, on binlerce gelişigüzel örnekten daha değerli olabilir.

Türkçe doğal dil işleme üzerine çalışan biri olarak bunu sık sık gözlemliyorum: Türkçenin eklemeli yapısı, resmî ve günlük dil arasındaki fark ve alana özgü terimler, iyi seçilmiş Türkçe verinin önemini daha da artırıyor.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Bir dil modeli önce devasa ve temizlenmiş bir metin yığını üzerinde "sonraki kelimeyi tahmin etme" ile ön eğitimden geçer.</li><li>İnce ayar ve insan tercihlerinden öğrenme, bilgili bir temel modeli talimat izleyen bir asistana dönüştürür.</li><li>Değerlendirme yalnızca hazır testlerle değil, gerçek senaryolara benzeyen özel test setleriyle de yapılmalıdır.</li><li>Maliyetin büyük kısmı donanım ve personeldir; eğitim pahalılaşırken kullanım maliyeti düşmektedir.</li><li>Veri kalitesi, model boyutu kadar, çoğu zaman ondan da fazla belirleyicidir.</li></ul></div>

<div class="faq"><details><summary>Bir modeli eğitmek ile kullanmak arasındaki fark nedir?</summary><p>Eğitim, modelin parametrelerinin veriden öğrenilerek ayarlandığı, bir kez yapılan pahalı süreçtir. Kullanım (çıkarım) ise eğitilmiş modelin her soruya cevap üretmesidir; çok daha ucuzdur ve model artık öğrenmez, yalnızca öğrendiğini uygular.</p></details><details><summary>Model sohbet ederken benden öğreniyor mu?</summary><p>Sohbet sırasında modelin parametreleri değişmez. Ancak bazı hizmetler, kullanıcı ayarlarına bağlı olarak konuşmaları ileride eğitimde kullanabilir. Bu yüzden kullandığınız hizmetin veri politikasını okumak ve hassas bilgileri paylaşmamak önemlidir.</p></details><details><summary>Kendi şirketim için model eğitmem gerekir mi?</summary><p>Çoğu durumda hayır. Hazır bir modeli kendi belgelerinizle RAG yöntemiyle kullanmak veya küçük bir ince ayar yapmak, sıfırdan eğitime göre çok daha hızlı ve ucuzdur. Sıfırdan eğitim, genellikle çok özel bir dil ya da alan ihtiyacı olduğunda gündeme gelir.</p></details><details><summary>Modeller neden bazen yanlış bilgi uyduruyor?</summary><p>Çünkü model "doğruyu" değil, "en olası devamı" üretmek üzere eğitilir. Bilgisi eksik olduğunda bile akıcı bir cevap üretebilir. Kaynak gösteren sistemler ve dikkatli değerlendirme bu riski azaltır ama tamamen ortadan kaldırmaz.</p></details></div>

---

**Kaynaklar**

-   [Hoffmann vd. (2022), Training Compute-Optimal Large Language Models (Chinchilla), arXiv](https://arxiv.org/abs/2203.15556)
-   [Ouyang vd. (2022), Training language models to follow instructions with human feedback, arXiv](https://arxiv.org/abs/2203.02155)
-   [Penedo vd. (2024), The FineWeb Datasets, arXiv](https://arxiv.org/abs/2406.17557)
-   [Epoch AI (2024), How Much Does It Cost to Train Frontier AI Models?](https://epoch.ai/blog/how-much-does-it-cost-to-train-frontier-ai-models)
-   [Stanford HAI, AI Index Report 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report)
