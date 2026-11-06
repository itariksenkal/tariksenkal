---
title: "Vektör Veritabanları Rehberi: Benzerlik Araması, HNSW ve FAISS / pgvector / Qdrant Karşılaştırması"
description: "Vektör veritabanlarını sezgisel anlatan rehber: benzerlik araması, ANN ve HNSW algoritması, FAISS, pgvector ile Qdrant karşılaştırması ve ne zaman hangisini seçmelisiniz."
publishDate: "2026-08-09T23:12:00+03:00"
lang: tr
category: "Altyapı"
tags: ["Altyapı", "Yapay Zeka"]
translation: "vector-databases-guide"
heroImage:
  src: "../../../assets/blog/bimg-14.jpg"
  alt: "Vektör Veritabanları Rehberi: Benzerlik Araması, HNSW ve FAISS / pgvector / Qdrant Karşılaştırması"
---

Bir kütüphanede "bu kitaba benzer bir şey istiyorum" dediğinizde, görevli ISBN numarasını sormaz; konuyu, tonu, hissi düşünür. Vektör veritabanları tam da bunu yapar: kelimelerin birebir eşleşmesini değil, _anlamların yakınlığını_ arar. Bu rehberde benzerlik aramasının nasıl çalıştığını, HNSW gibi yaklaşık komşu algoritmalarını ve FAISS, pgvector ile Qdrant arasında ne zaman hangisini seçeceğinizi sezgisel olarak anlatıyorum.

## 1\. Vektör nedir, neden benzerlik araması?

Bir gömme (embedding) modeli, bir metni, görseli veya sesi sayı dizisine, yani bir **vektöre** dönüştürür. Bu vektör, içeriğin "anlam koordinatları" gibidir. Benzer içerikler, çok boyutlu bir uzayda birbirine yakın noktalara düşer. "Köpek" ile "kedi" birbirine yakın, "köpek" ile "muhasebe" uzak olur.

Geleneksel veritabanı sorgusu birebir eşleşme arar: `WHERE baslik = 'köpek'`. Vektör araması ise "anlamca en yakın 10 kayıt" der. Bu, modern arama, öneri sistemleri ve özellikle RAG (getirmeyle güçlendirilmiş üretim) mimarilerinin kalbidir.

> Anahtar fikir: Vektör veritabanı bir "anlam haritası" üzerinde en yakın komşuları bulan bir araçtır; klasik bir B-tree dizini değil.

## 2\. Mesafe ölçüsü: yakınlık nasıl hesaplanır?

İki vektörün ne kadar "benzer" olduğunu bir mesafe (ya da benzerlik) ölçüsüyle hesaplarız. En yaygın üç tanesi:

-   **Kosinüs benzerliği:** İki vektör arasındaki açıya bakar; büyüklüğü değil yönü önemser. Metin gömmelerinde en sık kullanılan ölçüdür.
-   **Öklid mesafesi (L2):** İki nokta arasındaki düz çizgi mesafesi. Sezgisel; "ne kadar uzak" sorusunun en doğal cevabı.
-   **İç çarpım (dot product):** Yön ve büyüklüğü birlikte hesaba katar; bazı önerme modelleri bunun için eğitilir.

Analojiyle: kosinüs "aynı yöne mi bakıyorlar?", Öklid "fiziksel olarak ne kadar yakınlar?" diye sorar. Hangi ölçüyü kullandığınız, gömme modelinin nasıl eğitildiğine bağlıdır; modelin önerdiği ölçüye uymak iyi bir varsayılan kuraldır.

## 3\. ANN ve HNSW: hızın sırrı

Bir milyon vektörünüz varsa, sorgunuza en yakın 10 tanesini bulmak için hepsiyle tek tek mesafe hesaplamak (kaba kuvvet, "brute force") doğru ama yavaştır. İşte burada **yaklaşık en yakın komşu** (ANN — Approximate Nearest Neighbor) algoritmaları devreye girer: küçük bir doğruluk ödünü karşılığında muazzam bir hız kazandırır.

Bugün en popüler ANN yöntemi **HNSW**'dir (Hierarchical Navigable Small World). HNSW'yi bir uçuş ağı gibi düşünün: en üst katta yalnızca büyük havalimanları (kıtalar arası uzun atlamalar) vardır; aşağı indikçe daha yerel uçuşlar belirir. Arama en üst, seyrek katmandan başlar, hedefe kabaca yaklaşır, sonra alt katmanlara inerek ince ayar yapar. Böylece her noktayı ziyaret etmeden hedefe hızla varırsınız.

<div class="callout"><strong>İpucu:</strong> HNSW'de iki ayar kritiktir: <code>M</code> (her düğümün komşu sayısı; bellek ve doğruluk) ve <code>ef</code> (arama anındaki gezinti genişliği; hız–doğruluk dengesi). <code>ef</code>'i artırmak doğruluğu yükseltir ama sorguyu yavaşlatır.<p></p></div>

Basitleştirilmiş bir akış şöyle görünür:

```python
fonksiyon ann_ara(sorgu_vektoru, k):
    giris = ust_kattaki_giris_dugumu
    # üst katmanlardan aşağıya doğru kabaca yaklaş
    for kat in ust_kattan_alta:
        giris = bu_katta_en_yakini_bul(giris, sorgu_vektoru)
    # en alt katmanda ef genişliğiyle ince arama
    aday_kume = oncelikli_kuyruk(boyut = ef)
    genislet(aday_kume, giris, sorgu_vektoru)
    return aday_kume.ilk_k(k)   # en yakın k komşu
```

Diğer aileler de vardır: **IVF** (vektör uzayını kümelere bölüp yalnızca ilgili kümeleri tarar) ve **PQ** (Product Quantization — vektörleri sıkıştırarak belleği küçültür). Pratikte bunlar sıkça birleştirilir (örn. IVF+PQ).

## 4\. FAISS, pgvector, Qdrant karşılaştırması

Üç popüler aracın farkı, aslında "ne oldukları" sorusunda saklı:

-   **FAISS** bir _kütüphanedir_, veritabanı değil. Meta tarafından geliştirilen, C++/Python tabanlı bu araç çok yüksek performanslı ANN dizinleri sunar; GPU desteği güçlüdür. Ancak kalıcılık, filtreleme, ağ API'si, kimlik doğrulama gibi "veritabanı" özelliklerini siz eklersiniz.
-   **pgvector** PostgreSQL için bir _eklentidir_. Vektörleri tam da ilişkisel verinizin yanında saklamanızı sağlar; SQL ile filtreleyip JOIN'leyebilirsiniz. HNSW ve IVFFlat dizinlerini destekler. Zaten Postgres kullanıyorsanız ek altyapı maliyeti neredeyse sıfırdır.
-   **Qdrant** baştan sona vektör için tasarlanmış, Rust ile yazılmış bir _vektör veritabanıdır_. HNSW dizini, zengin yük (payload) filtreleme, kümeleme/dağıtık çalışma ve REST/gRPC API'leri ile gelir. Büyük ölçek ve operasyonel olgunluk hedefleyenler için tasarlanmıştır.

Kabaca bir konumlandırma:

| Özellik | FAISS | pgvector | Qdrant |
| --- | --- | --- | --- |
| Türü | Kütüphane | Postgres eklentisi | Bağımsız VTYS |
| Dizin | HNSW, IVF, PQ… | HNSW, IVFFlat | HNSW |
| Metadata filtreleme | Sınırlı | Tam SQL | Zengin payload |
| Ağ API'si | Yok (gömülü) | SQL üzerinden | REST + gRPC |
| GPU | Güçlü | Yok | Sınırlı |

## 5\. Ne zaman hangisi?

-   **pgvector seçin** eğer zaten PostgreSQL kullanıyorsanız, veri hacminiz orta ölçekteyse ve vektörleri ilişkisel verinizle birlikte tek yerde tutmak istiyorsanız. En düşük operasyonel yük budur.
-   **Qdrant seçin** eğer büyük ölçek, hızlı filtrelemeli aramalar, yatay ölçekleme ve hazır bir API ile çalışan tam teşekküllü bir vektör servisi istiyorsanız.
-   **FAISS seçin** eğer maksimum performans ve esneklik için kendi katmanınızı kurmaya istekliyseniz, GPU'dan yararlanmak istiyorsanız ya da bir araştırma/prototip ortamında çalışıyorsanız.

<div class="callout"><strong>İpucu:</strong> "Doğru" seçim genelde teknik üstünlükten çok ekibinizin işletim kapasitesine bağlıdır. En hızlı dizin, bakımını yapamadığınız dizinden daha iyi değildir.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Vektör araması birebir eşleşme değil, anlam yakınlığı arar.</li><li>Ölçü seçimi (kosinüs/Öklid/iç çarpım) gömme modeline bağlıdır.</li><li>HNSW, küçük bir doğruluk ödünüyle büyük hız kazandıran baskın ANN yöntemidir.</li><li>FAISS kütüphane, pgvector Postgres eklentisi, Qdrant bağımsız bir vektör VTYS'sidir.</li><li>Seçim, ölçek ve işletim kapasitenizle şekillenir; en parlak araç değil, sürdürebileceğiniz araç kazanır.</li></ul></div>

<div class="faq"><details><summary>Vektör veritabanı, normal veritabanının yerini alır mı?</summary><p>Hayır. Çoğu sistem ikisini birlikte kullanır: ilişkisel/belge veritabanı kaynak veriyi tutar, vektör katmanı anlamsal aramayı yapar. pgvector gibi çözümler bu ikisini tek motorda birleştirir.</p></details><details><summary>HNSW her zaman en iyi seçim mi?</summary><p>Çoğu durumda mükemmel bir varsayılandır, ama bellek tüketimi yüksektir. Çok büyük ve bellek kısıtlı senaryolarda IVF+PQ gibi sıkıştırmalı yöntemler daha uygun olabilir.</p></details><details><summary>Yaklaşık arama yanlış sonuç vermez mi?</summary><p>"Yaklaşık" demek, ara sıra en iyi komşulardan birini kaçırabilir demektir. Pratikte geri çağırma (recall) %95–99 aralığında ayarlanabilir; <code>ef</code> gibi parametrelerle doğruluk–hız dengesini siz belirlersiniz.</p></details></div>

---

Vektör veritabanı seçimi, bir araç değil bir mimari kararıdır: ölçeğinizi, ekibinizin operasyon kapasitesini ve mevcut yığınınızı birlikte değerlendirin. Anlamsal arama ve RAG sistemlerini üretim ortamına taşırken benzer kararları nasıl ele aldığımızı merak ediyorsanız, [HatsonTech](/posts/hatsontech-nedir/)'in yaklaşımına göz atabilirsiniz.
