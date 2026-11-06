---
title: "GPU Nedir, Yapay Zeka İçin Neden Bu Kadar Önemli?"
description: "GPU ile CPU farkı, paralel matris hesabının yapay zeka için önemi, VRAM ve HBM bellek, eğitim ile çıkarım farkı ve GPU’ların neden kıt ve pahalı olduğu."
publishDate: "2026-11-20T09:17:00+03:00"
lang: tr
category: "Altyapı"
tags: ["GPU", "Yapay Zeka", "Donanım", "Altyapı"]
translation: "what-is-a-gpu-for-ai"
heroImage:
  src: "../../../assets/blog/covers/gpu-nedir-yapay-zeka-icin-neden-onemli.jpg"
  alt: "Bir veri merkezi rafında sıralanmış GPU sunucuları"
---

Yapay zeka haberlerinde şirketlerin kaç bin GPU satın aldığı, veri merkezlerine ne kadar yatırım yaptığı ya da çip üreticilerinin piyasa değerleri sık sık manşet oluyor. Peki GPU tam olarak nedir ve neden bir zamanlar oyun bilgisayarlarının parçası olan bu donanım, bugün yapay zekanın en kritik kaynağı hâline geldi? Bu yazıda GPU’yu CPU ile karşılaştırarak sade bir dille anlatıyorum: yapay zekanın neden paralel hesaba ihtiyaç duyduğunu, belleğin neden işlem gücü kadar önemli olduğunu, eğitim ile kullanım arasındaki farkı ve GPU’ların neden hem kıt hem de pahalı olduğunu. Dil modelleriyle çalışan herkesin kısa sürede fark ettiği bir gerçeğe de değineceğim: darboğaz çoğu zaman hesap gücünden çok bellektir.

## CPU ve GPU: iki farklı çalışma biçimi

Bilgisayarınızın ana işlemcisi olan **CPU** (merkezi işlem birimi), az sayıda ama çok güçlü ve çok yönlü çekirdekten oluşur. Her türlü işi yapabilir, karmaşık karar mantığını hızla yürütür ve görevleri genellikle sırayla, art arda işler. İşletim sisteminizi, tarayıcınızı ve kelime işlemcinizi çalıştıran odur.

**GPU** (grafik işlem birimi) ise başlangıçta ekrandaki milyonlarca pikselin rengini aynı anda hesaplamak için tasarlandı. Bunu yapmak için çok sayıda daha basit çekirdeği bir arada barındırır. Tek tek çekirdekleri CPU çekirdekleri kadar esnek değildir ama hepsi aynı anda çalışabilir.

Sık kullanılan bir benzetme: CPU, her türlü yemeği yapabilen birkaç usta aşçının çalıştığı bir mutfak gibidir. GPU ise aynı anda binlerce soğanı doğrayabilen kalabalık bir ekip. Tek bir karmaşık yemek için ustalar daha iyidir; ama binlerce aynı işlem varsa kalabalık ekip açık ara öndedir.

| Özellik | CPU | GPU |
|---|---|---|
| Çekirdek yapısı | Az sayıda, güçlü ve çok yönlü | Çok sayıda, daha basit |
| Güçlü olduğu iş | Sıralı, dallanan, karmaşık mantık | Aynı işlemin büyük veri üzerinde tekrarı |
| Tipik kullanım | İşletim sistemi, uygulamalar, veri tabanları | Grafik, bilimsel hesap, yapay zeka |
| Yapay zekadaki rolü | Veriyi hazırlar, süreci yönetir | Asıl hesap yükünü taşır |

## Yapay zeka neden paralel hesaba ihtiyaç duyar?

Bir yapay sinir ağının içinde olan biten, büyük ölçüde **matris çarpımıdır**: uzun sayı tablolarının birbiriyle çarpılıp toplanması. Bir dil modeli tek bir kelime parçası (token) üretirken bile milyarlarca çarpma ve toplama işlemi yapar. Bu işlemlerin büyük kısmı birbirinden bağımsızdır; yani aynı anda yapılabilir.

İşte GPU’nun parladığı yer burası. Binlerce çekirdek, bu bağımsız hesapları paralel olarak yürütür. Modern veri merkezi GPU’larında ayrıca matris çarpımına özel olarak tasarlanmış birimler de bulunur.

Bu bağlantı tesadüfen keşfedilmedi. GPU’ları grafik dışı işler için programlamayı kolaylaştıran NVIDIA’nın CUDA platformu 2006’da duyuruldu. 2012’de Alex Krizhevsky, Ilya Sutskever ve Geoffrey Hinton’ın görüntü tanıma yarışması ImageNet’te büyük bir fark yaratan sinir ağı, makalelerinde de vurguladıkları gibi verimli bir GPU uygulamasıyla eğitilmişti. Bu çalışma, derin öğrenmede GPU kullanımının yaygınlaşmasında bir dönüm noktası olarak kabul edilir. Bir dil modelinin içinde tam olarak hangi hesapların yapıldığını merak ederseniz [büyük dil modellerinin nasıl çalıştığını](/posts/llm-nasil-calisir/) anlattığım yazıya göz atabilirsiniz.

## Bellek: VRAM ve HBM neden bu kadar önemli?

GPU’nun hızlı olması tek başına yetmez; hesaplanacak verinin de ona hızla ulaşması gerekir. GPU’nun kendi belleğine **VRAM** denir. Bir modelin çalışabilmesi için parametrelerinin büyük kısmının bu belleğe sığması gerekir.

Basit bir hesap fikir verir: 70 milyar parametreli bir modelin her parametresi 16 bitle (2 bayt) saklanırsa, yalnızca ağırlıklar için yaklaşık 140 GB bellek gerekir. Buna konuşmanın bağlamı ve ara hesaplar için gereken ek bellek de eklenir. Tüketici ekran kartlarının belleği bunun çok altında olduğundan, büyük modeller ya birden fazla GPU’ya bölünür ya da [kuantizasyon](/posts/uretimde-kuantizasyon/) gibi tekniklerle küçültülür.

Veri merkezi GPU’ları bu yüzden **HBM** (yüksek bant genişlikli bellek) kullanır. HBM, bellek yongalarını üst üste istifleyip işlemciye çok yakın konumlandırarak saniyede çok daha fazla veri taşınmasını sağlar. Örneğin NVIDIA, H100 SXM için 80 GB bellek ve saniyede 3,35 terabayt bellek bant genişliği belirtiyor. Pratikte pek çok yapay zeka işi, işlem gücünden önce bu bant genişliğine takılır: GPU çekirdekleri verinin gelmesini bekler.

<div class="callout"><strong>İpucu:</strong> Bir GPU’nun yapay zeka için uygun olup olmadığını değerlendirirken yalnızca işlem gücüne değil, bellek kapasitesine ve bant genişliğine de bakın. Kendi bilgisayarınızda yerel model çalıştırmak istiyorsanız, belirleyici olan çoğu zaman VRAM miktarıdır.</div>

## Eğitim ve çıkarım: iki farklı yük

GPU’lar yapay zekanın iki farklı aşamasında kullanılır ve bu aşamaların ihtiyaçları farklıdır.

**Eğitim**, modelin veriden öğrendiği aşamadır. Büyük modeller için binlerce GPU’nun haftalarca, hatta aylarca birlikte çalışması gerekebilir. Burada yalnızca GPU’ların gücü değil, aralarındaki bağlantının hızı da kritiktir; çünkü GPU’lar sürekli birbirleriyle sonuç paylaşır. Eğitim, büyük ve seyrek yapılan bir yatırımdır.

**Çıkarım (inference)** ise eğitilmiş modelin kullanıcılara cevap verdiği aşamadır. Tek bir soru, eğitime kıyasla çok küçük bir iştir; ama milyonlarca kullanıcı her gün soru sorduğunda toplam yük çok büyür ve süreklidir. Çıkarımda hız (cevabın ne kadar çabuk geldiği) ve maliyet (soru başına harcanan kaynak) öne çıkar. Bu yüzden şirketler çıkarım için daha küçük modeller, kuantizasyon ve önbellekleme gibi optimizasyonlara yöneliyor.

| | Eğitim | Çıkarım |
|---|---|---|
| Ne olur? | Model veriden öğrenir | Model soruya cevap üretir |
| Ölçek | Çok sayıda GPU, uzun süre, seyrek | Her soruda küçük iş, ama sürekli ve yaygın |
| Öne çıkan ihtiyaç | Toplam hesap gücü, GPU’lar arası hızlı bağlantı | Düşük gecikme, bellek bant genişliği, maliyet verimliliği |

## GPU’lar neden kıt ve pahalı?

Son yıllarda yapay zeka için kullanılan GPU’lara olan talep, arzı defalarca aştı. Bunun birkaç yapısal nedeni var:

- **Karmaşık üretim zinciri.** En gelişmiş yapay zeka çipleri yalnızca birkaç ileri üretim tesisinde üretilebiliyor. Çipin yanı sıra HBM bellek ve bu belleği işlemciyle aynı paket içinde birleştiren gelişmiş paketleme teknolojisi gerekiyor; bu adımların her birinin kapasitesi sınırlı. 2023’te TSMC yönetimi, yapay zeka GPU’larındaki arz sıkıntısının yaklaşık bir buçuk yıl sürebileceğini öngörmüştü.
- **Az sayıda tedarikçi.** HBM bellek az sayıda üretici tarafından yapılıyor ve yapay zeka hızlandırıcı pazarında birkaç şirket baskın konumda.
- **Yazılım ekosistemi.** Yıllar içinde biriken yazılım kütüphaneleri ve araçlar, belirli donanımlara olan bağımlılığı artırıyor; alternatif çiplere geçiş teknik olarak mümkün ama zahmetli.
- **Yoğunlaşmış talep.** Büyük teknoloji şirketleri ve yapay zeka laboratuvarları, kapasiteyi yıllar öncesinden sözleşmelerle ayırıyor.
- **Jeopolitik kısıtlar.** Bazı ülkeler gelişmiş yapay zeka çiplerinin ihracatına sınırlamalar getirdi; bu da tedarik zincirini daha karmaşık hâle getiriyor.

Fiyatlar model, sürüm ve dönemle çok hızlı değiştiği için burada rakam vermiyorum. Ama genel tablo net: yapay zeka hesabı, enerji ve soğutma maliyetleriyle birlikte, bugün bu alandaki en büyük gider kalemlerinden biri. Bu da [maliyet optimizasyonunu](/posts/llm-maliyet-optimizasyonu/) ve daha verimli [küçük dil modellerini](/posts/kucuk-dil-modelleri/) giderek daha önemli kılıyor.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>CPU az sayıda güçlü çekirdekle sıralı işlerde, GPU çok sayıda basit çekirdekle paralel işlerde güçlüdür.</li><li>Yapay sinir ağlarının temelindeki matris çarpımları büyük ölçüde paralel yapılabildiği için GPU’lar yapay zekanın iş gücü hâline geldi.</li><li>Bellek kapasitesi ve bant genişliği (VRAM, HBM) çoğu zaman işlem gücü kadar, hatta ondan daha belirleyicidir.</li><li>Eğitim büyük ve seyrek, çıkarım küçük ama sürekli bir yüktür; ihtiyaçları farklıdır.</li><li>Karmaşık üretim zinciri, az sayıda tedarikçi ve yoğun talep GPU’ları kıt ve pahalı kılıyor.</li></ul></div>

<div class="faq"><details><summary>Oyun bilgisayarımdaki ekran kartıyla yapay zeka modeli çalıştırabilir miyim?</summary><p>Evet, özellikle küçük ve kuantize edilmiş açık ağırlıklı modelleri çalıştırabilirsiniz. Sınırlayıcı faktör genellikle ekran kartının belleğidir (VRAM). Çok büyük modeller ise tüketici kartlarına sığmaz.</p></details><details><summary>Yapay zeka yalnızca GPU’larla mı çalışır?</summary><p>Hayır. Küçük modeller CPU’da da çalışabilir, ama daha yavaştır. Ayrıca bazı şirketler yapay zekaya özel hızlandırıcılar geliştiriyor; Google’ın TPU’ları buna bir örnek. Yine de GPU’lar bugün en yaygın seçenek.</p></details><details><summary>Eğitim mi daha pahalı, çıkarım mı?</summary><p>Tek seferlik maliyet olarak eğitim çok büyüktür. Ancak yaygın kullanılan bir modelde, milyonlarca kullanıcıya sürekli hizmet vermenin toplam çıkarım maliyeti zamanla eğitim maliyetine yaklaşabilir ya da onu aşabilir. Hangisinin ağır bastığı kullanım ölçeğine bağlıdır.</p></details><details><summary>HBM ile normal bilgisayar belleği arasındaki fark nedir?</summary><p>HBM, bellek yongalarını üst üste istifleyip işlemciye çok yakın yerleştiren bir teknolojidir. Bu sayede saniyede çok daha fazla veri taşıyabilir. Bu da büyük modellerde GPU çekirdeklerinin veri beklemesini azaltır.</p></details></div>

---

**Kaynaklar**

- [NVIDIA – What’s the Difference Between a CPU and a GPU?](https://blogs.nvidia.com/blog/2009/12/16/whats-the-difference-between-a-cpu-and-a-gpu/)
- [NVIDIA – H100 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h100/)
- [Krizhevsky, Sutskever, Hinton – ImageNet Classification with Deep Convolutional Neural Networks (NeurIPS 2012)](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)
- [Tom’s Hardware – TSMC: Shortage of Nvidia’s AI GPUs to Persist for 1.5 Years](https://www.tomshardware.com/news/tsmc-shortage-of-nvidias-ai-gpus-to-persist-for-15-years)
