---
title: "RAG Nedir ve Uçtan Uca Nasıl Kurulur? Pratik Bir Mimari Rehber"
description: "RAG nedir, nasıl çalışır? Belge, chunk, embedding, vektör arama ve bağlamla üretim adımlarını küçük kod örnekleriyle uçtan uca anlatan pratik mimari rehber."
publishDate: "2026-08-09T23:13:00+03:00"
lang: tr
category: "RAG"
tags: ["RAG", "Yapay Zeka"]
translation: "what-is-rag-how-to-build"
heroImage:
  src: "../../../assets/blog/covers/rag-nedir-nasil-kurulur.jpg"
  alt: "RAG Nedir ve Uçtan Uca Nasıl Kurulur? Pratik Bir Mimari Rehber"
---

Bir yapay zekâya “şirket politikamıza göre yıllık izin kaç gün?” diye sorduğunuzda, modelin ezberinden uydurmasını değil, gerçek belgenize bakıp cevap vermesini istersiniz. İşte RAG tam olarak bunu yapar: önce ilgili belgeyi bulur, sonra o belgeye bakarak yazar. Bu yazıda RAG’in ne olduğunu sezgisel olarak anlatacak, ardından belgeden cevaba kadar tüm hattı uçtan uca, küçük kod örnekleriyle kuracağız.

## RAG nedir? (Açık kitap sınavı)

**RAG**, “Retrieval-Augmented Generation” yani “Erişimle Güçlendirilmiş Üretim” demektir. Karmaşık duruyor ama fikri son derece basit.

> Önce ilgili belgeleri bul, sonra o belgelere bakarak cevabı yaz.

İki tür öğrenci hayal edin. Birincisi sınava yalnızca ezberiyle giren öğrenci: çoğu şeyi bilir, ama hatırlayamadığında kendinden emin biçimde uydurur. İkincisi açık kitap sınavına giren öğrenci: önce kaynaktaki ilgili sayfayı bulur, sonra ona bakarak yazar ve nereden bulduğunu söyleyebilir. Sade bir büyük dil modeli birinci öğrenci, RAG ise ikincisidir.

Bu basit ayrım önemli bir sorunu çözer: _halüsinasyon_, yani modelin gerçekte olmayan bir bilgiyi emin bir tavırla uydurması. RAG, cevabı modelin önüne konan gerçek metinlere demirlediği için hem doğruluğu artırır hem de “bunu nereden buldun?” sorusuna yanıt verilebilir hale getirir.

## Boru hattının beş adımı

Bir RAG sistemi iki zamanda çalışır. **Hazırlık zamanı** (offline): belgeleri bir kez işleyip aranabilir hale getirirsiniz. **Sorgu zamanı** (online): kullanıcı soru sorduğunda ilgili parçaları bulup cevabı üretirsiniz.

1.  **Belge:** PDF, sözleşme, wiki sayfası, e-posta arşivi — ham kaynak.
2.  **Chunk (parçalama):** Uzun belgeyi anlamlı, küçük parçalara bölersiniz.
3.  **Embedding:** Her parçayı, anlamını temsil eden bir sayı dizisine (vektöre) çevirirsiniz.
4.  **Vektör arama:** Soruyu da vektöre çevirip, anlamca en yakın parçaları bulursunuz.
5.  **Bağlamla üretim:** Bulunan parçaları soruyla birlikte modele verir, cevabı yazdırırsınız.

Akışı tek bir şemada görmek faydalı olur:

```text
Hazırlık (bir kez):
  belgeler ──► parçala ──► embedding ──► vektör veritabanına yaz

Sorgu (her soruda):
  soru ──► embedding ──► en yakın K parçayı getir
        └─► [parçalar + soru] ──► LLM ──► kaynaklı cevap
```

## Belge → chunk: parçalama sanatı

Neden belgeyi olduğu gibi vermiyoruz? Çünkü bağlam penceresi sınırlıdır ve aramada isabet önemlidir. 80 sayfalık bir sözleşmenin tamamını getirmek yerine, sorunun cevabını içeren tek paragrafı getirmek hem daha ucuz hem daha doğrudur. Parçalama, “aranabilir en küçük anlamlı birim”i tanımlama işidir.

Pratik ipuçları: paragraf veya başlık sınırlarında bölün, parçalar arasında küçük bir _örtüşme_ (overlap) bırakın ki cümle ortasında kopan bağlam korunsun, ve her parçaya kaynağını (dosya adı, sayfa, başlık) _metadata_ olarak ekleyin — cevapta kaynak göstermek için bu şarttır.

```python
def parcala(metin, boyut=800, ortusme=120):
    parcalar, i = [], 0
    while i < len(metin):
        parcalar.append(metin[i:i + boyut])
        i += boyut - ortusme   # bir önceki parçayla örtüşsün
    return parcalar
```

<div class="callout"><strong>İpucu:</strong> Parça boyutunu belge türüne göre ayarlayın. Yoğun teknik metinde küçük parçalar (300–600 karakter) isabeti artırır; akıcı anlatımda büyük parçalar (800–1200) bağlamı daha iyi korur. “Doğru” boyut yoktur; ölçerek bulunur.</div>

## Embedding ve vektör arama

**Embedding**, bir metni anlamını temsil eden bir sayı dizisine çevirir. “Evden çıkarma” ile “tahliye” farklı kelimelerdir ama anlamca yakın oldukları için vektörleri de birbirine yakın olur. Klasik anahtar kelime araması bu ikisini eşleştiremez; _anlamsal arama_ ise tam olarak bunu yapar. İşte RAG’in kalbi budur.

Parçaların vektörlerini bir **vektör veritabanına** (FAISS, pgvector, Qdrant gibi) yazarsınız. Sorgu geldiğinde soruyu da aynı embedding modeliyle vektöre çevirir, veritabanından en yakın K parçayı (örneğin 4–6) getirirsiniz. Yakınlık genellikle kosinüs benzerliğiyle ölçülür.

```python
# Kavramsal akış (sözde kod)
veritabani = VektorDB()
for parca in tum_parcalar:
    veritabani.ekle(embed(parca.metin), metadata=parca.kaynak)

def getir(soru, k=5):
    q = embed(soru)
    return veritabani.en_yakin(q, k)   # anlamca en ilgili k parça
```

Önemli bir kural: belgeleri vektöre çevirirken kullandığınız embedding modeli ile soruyu çevirirken kullandığınız model _aynı_ olmalıdır. Farklı modellerin vektör uzayları birbiriyle kıyaslanamaz.

## Bağlamla üretim (prompt kurgusu)

Son adımda, getirilen parçaları soruyla birlikte modele verirsiniz. Buradaki kritik nokta talimattır: modele yalnızca verilen bağlamı kullanmasını ve bilgi yoksa “bilmiyorum” demesini söyleyin. Bu tek cümle, halüsinasyonu büyük ölçüde keser.

```python
SISTEM = """Yalnızca aşağıdaki BAĞLAM'ı kullanarak yanıt ver.
Cevap bağlamda yoksa "Belgelerde bulamadım" de. Kaynak numarasını belirt."""

def cevapla(soru):
    parcalar = getir(soru, k=5)
    baglam = "\n\n".join(f"[{i+1}] {p.metin}" for i, p in enumerate(parcalar))
    mesaj = f"BAĞLAM:\n{baglam}\n\nSORU: {soru}"
    return llm(sistem=SISTEM, kullanici=mesaj)   # kaynaklı cevap döner
```

Üretim katmanı için modern bir dil modeli yeterlidir; örneğin Claude (Anthropic) gibi modeller uzun bağlamı işleyip kaynağa sadık kalma konusunda iyidir. Mimari açıdan model seçimi takılabilir bir parçadır — embedding ve arama hattınız aynı kalır, üretim modelini değiştirebilirsiniz.

## Üretime alırken dikkat edilecekler

Demo kurmak kolaydır; güvenilir bir sistem kurmak biraz daha titizlik ister. En sık karşılaşılan noktalar şunlardır:

-   **Kaynak gösterimi:** Her cevabın yanında hangi parçadan geldiğini gösterin. Güven, izlenebilirlikten doğar.
-   **Değerlendirme:** “İyi görünüyor” yeterli değildir. Bilinen soru-cevap çiftlerinden bir test seti hazırlayın ve isabeti ölçün.
-   **Getirme kalitesi:** Cevap kötüyse genellikle suç üretimde değil, getirmededir. Önce hangi parçaların geldiğine bakın.
-   **Tazelik:** Belgeler değiştikçe vektörleri güncelleyin; bayat indeks bayat cevap üretir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>RAG = önce ilgili belgeyi bul, sonra ona bakarak cevap yaz; halüsinasyonu azaltır.</li><li>Hat beş adımdır: belge → chunk → embedding → vektör arama → bağlamla üretim.</li><li>Parçalama ve getirme kalitesi, cevabın kalitesini en çok belirleyen iki ayardır.</li><li>Belge ve soru için aynı embedding modelini kullanın; modele “bağlam yoksa bilmiyorum de” deyin.</li></ul></div>

<div class="faq"><details><summary>RAG ile modeli yeniden eğitmek (fine-tuning) arasındaki fark nedir?</summary><p>Fine-tuning, modelin davranışını/üslubunu kalıcı olarak değiştirir ama bilgi eklemek için pahalı ve yavaştır. RAG ise bilgiyi dışarıdan, sorgu anında verir; belge eklemek için yeniden eğitime gerek kalmaz. Çoğu “kendi belgelerime cevap versin” senaryosunda doğru başlangıç RAG’tir.</p></details><details><summary>Kaç parça (K) getirmeliyim?</summary><p>Genellikle 4–6 parça iyi bir başlangıçtır. Çok az getirirseniz cevap eksik kalır; çok fazla getirirseniz gürültü artar ve maliyet yükselir. Doğru sayı, kendi test setinizde ölçerek bulunur.</p></details><details><summary>Vektör veritabanı şart mı, normal veritabanı yetmez mi?</summary><p>Küçük denemelerde bir dosyada saklanan vektörler ve basit bir benzerlik araması yeter. Ölçek büyüdükçe, anlamsal aramayı hızlı yapmak için FAISS, pgvector veya Qdrant gibi araçlar pratikleşir. Mantık aynıdır; değişen yalnızca ölçek ve hızdır.</p></details></div>

---

Kısacası RAG, yapay zekâyı “hayal kuran” bir anlatıcıdan “kaynak gösteren” bir araştırmacıya dönüştürür. Doğruluğun önemli olduğu her alanda fark tam buradadır. Bu mimariyi pratikte nasıl uyguladığımıza dair yaklaşımı [HatsonTech](/posts/hatsontech-nedir/) sayfasında okuyabilirsiniz.
