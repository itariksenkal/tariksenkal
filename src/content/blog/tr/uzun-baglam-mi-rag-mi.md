---
title: "1 Milyon Token Bağlam Varken RAG'a Hâlâ Gerek Var mı? (2026)"
description: "1 milyon tokenlık bağlam penceresi RAG'ı gereksiz kılıyor mu? Bağlam çürümesi, ölçülmüş Türkçe token maliyeti ve üçüncü bir seçenek: dosya sistemi üzerinden çalışmak."
publishDate: "2026-08-13T23:38:00+03:00"
lang: tr
category: "Mimari"
tags: ["Mimari", "Yapay Zeka"]
translation: "long-context-vs-rag"
heroImage:
  src: "../../../assets/blog/bimg-02.jpg"
  alt: "1 Milyon Token Bağlam Varken RAG'a Hâlâ Gerek Var mı? (2026)"
---

Modelinizin bağlam penceresi 1 milyon token. Şirketin tüm politika belgeleri 400 bin token tutuyor. Akla gelen ilk soru şu: madem hepsi sığıyor, neden hâlâ bir RAG hattı kurup bakımını yapayım? Bu makul bir soru ve Türkçe'de neredeyse hiç yanıtlanmamış. Kısa cevap: sığması, iyi kullanılacağı anlamına gelmiyor — ve fatura düşündüğünüzden farklı işliyor. Uzun cevabı ölçülmüş sayılarla veriyorum.

## 1 milyon artık ayırt edici değil

Birkaç yıl önce bağlam penceresi bir pazarlama argümanıydı. 2026'da değil: Claude'un güncel model ailesi 1 milyon tokenlık pencere ve 128 bin tokenlık azami çıktı ile geliyor, Gemini'nin hızlı modelleri de 1 milyon seviyesinde. Yani "kaç token" sorusu artık bir seçim kriteri değil, bir taban özellik.

> Soru "pencere ne kadar büyük" olmaktan çıktı, "pencerenin ne kadarı gerçekten işe yarıyor" hâline geldi.

Bu ayrımın adı var: _ilan edilen pencere_ ile _etkin pencere_ farkı. İlan edilen pencere, modelin reddetmeden kabul ettiği token sayısıdır. Etkin pencere, modelin o tokenların hepsini eşit güvenilirlikte kullanabildiği aralıktır ve neredeyse her zaman daha küçüktür.

## Bağlam çürümesi: pencere doldukça ne olur?

Bu konudaki kaynak çalışma Chroma'nın **2025 tarihli** "context rot" (bağlam çürümesi) araştırmasıdır — 2026 blogları bu tarihi sürekli yanlış veriyor, doğrusu 14 Temmuz 2025 ve Anthropic, OpenAI, Google, Alibaba modellerinden 18 tanesini kapsıyor. Beş deneyin ürettiği bulgular şunlar:

-   **Uzunluk tek başına performansı düşürüyor** — hem de _basit_ görevlerde bile. Görev zorlaşmadan, sadece girdi büyüdükçe doğruluk azalıyor.
-   **Tek bir dikkat dağıtıcı bile zarar veriyor**; birden fazlası etkiyi katlıyor. Aradığınız bilgiye benzeyen ama yanlış olan bir paragraf, sistemin en tehlikeli düşmanı.
-   **Konum önemli:** hedef bilgi metnin başında olduğunda doğruluk en yüksek.
-   **Modeller karışık sırayla dizilmiş metinlerde, tutarlı sırayla dizilmiş metinlere göre daha iyi puan aldı** — sezgiye aykırı ve bu yüzden akılda kalıcı bir bulgu.
-   Belirsizlik karşısında davranış model ailesine göre değişiyor: Claude modelleri emin olmadıklarında çekimser kalmaya, GPT modelleri dikkat dağıtıcı varlığında daha çok uydurmaya eğilimli.

Buradaki mühendislik dersi net: pencereye daha çok şey koymak, doğruluğu artıran bir kaldıraç değil. Çoğu zaman tam tersi.

## Kırılma noktası: statik getirme değil, dinamik sentez

2026'nın katkısı, sorunun tam olarak _nerede_ ortaya çıktığını yerelleştirmesi oldu. AgentLongBench (arXiv:2601.20730, 28 Ocak 2026) 32 binden 4 milyon tokena kadar uzanan bağlamlarda test ediyor ve şunu buluyor: güncel modeller **statik getirme**de (uzun metinden bir bilgiyi bulup çıkarma) gayet iyi, **dinamik sentez**de (bağlam boyunca biriken bilgiyi birleştirip karar üretme) başarısız. AMA-Bench (arXiv:2602.22769, 26 Şubat 2026) bunun bir bölümünü, benzerlik tabanlı getirmenin kayıplı olmasına bağlıyor.

Bu, "iğne samanlıkta" testlerinin neden yanıltıcı olduğunu açıklıyor. O testler tam olarak modellerin iyi olduğu şeyi ölçüyor. Sizin üretimdeki işiniz ise genellikle diğeri: yüz sayfalık bir sözleşme yığınından çelişkileri çıkarmak, bir konuşma geçmişi boyunca değişen kararı takip etmek, otuz adımlık bir ajan oturumunda ne yapıldığını hatırlamak.

<div class="callout"><strong>İpucu:</strong> Kendi kararınızı "iğne samanlıkta" testiyle vermeyin. Kendi belgelerinizden 30–50 soruluk bir set çıkarın, aynı soruları hem 400 bin tokenlık tam bağlamla hem de 5 parçalık RAG ile sorun ve iki şeyi ölçün: doğruluk ve soru başına maliyet. Karar iki tabloyla verilir, sezgiyle değil.</div>

## Türkçe vergisi: aynı belge kaç token?

İngilizce kaynaklardan kopyalanan bütün bağlam ve maliyet hesapları Türkçe'de bozulur, çünkü aynı anlam Türkçe'de daha fazla token tutar. Bu, herkesin dile getirdiği ama kimsenin ölçmediği bir iddia. Ölçelim — bu betik çalışır:

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

tr = ("Sözleşmenin feshi hâlinde tarafların karşılıklı yükümlülükleri sona erer "
      "ve tazminat talepleri saklıdır. Çalışanlarımızın yıllık izin hakları, "
      "çalışma süresine göre hesaplanmaktadır. Bu bilgilendirme metni yalnızca "
      "genel bilgi amacıyla hazırlanmıştır ve hukuki tavsiye niteliği taşımaz.")

en = ("If the contract is terminated, the mutual obligations of the parties end "
      "and claims for damages are reserved. The annual leave entitlements of our "
      "employees are calculated according to their length of service. This notice "
      "has been prepared for general information purposes only and does not "
      "constitute legal advice.")

for ad, metin in (("TR", tr), ("EN", en)):
    n = len(enc.encode(metin))
    print(ad, "token:", n, "| karakter/token:", round(len(metin) / n, 2))
```

Bu paralel çiftte ölçtüğüm sonuç: **Türkçe 80 token, İngilizce 54 token** — aynı içerik için yaklaşık **1,48 kat**. Karakter başına verim de düşüyor: Türkçe'de token başına 3,58 karakter, İngilizce'de 5,83. Sebep, sondan eklemeli yapının her çekim ekini ayrı bir alt-kelime parçasına bölmesi. TR-MMLU çalışması da (arXiv:2501.00593) tokenizasyon kalitesini Türkçe'nin temel zayıflıklarından biri olarak işaretlemişti.

Bu tek sayı üç şeyi aynı anda değiştirir. **Bağlam penceresi**: 1 milyon tokenlık pencere Türkçe'de İngilizce'nin yaklaşık üçte iki kadar metin alır. **Maliyet**: aynı belgeyi her sorguda tam bağlama koymak Türkçe'de orantılı olarak daha pahalıdır. **Gecikme**: ön dolum (prefill) süresi token sayısıyla ölçeklendiği için ilk token gecikmesi de artar.

Önemli uyarı: bu 1,48 rakamı _bir_ metin çifti ve _bir_ tokenleştirici içindir. Kendi korpusunuzda ve kendi modelinizin tokenleştiricisinde ölçün; blogdan sayı kopyalamak tam da bu yazının karşı olduğu şey. Türkçe tokenizasyonun dilbilimsel nedenlerini derinlemesine okumak isterseniz, konunun ayrıntılı ele alındığı bir kaynak olarak [Türkçe tokenizasyon üzerine bu yazıya](https://halideyilmaz.com/posts/tokenizasyon-turkce/) bakabilirsiniz.

## Üçüncü seçenek: bağlamı dosya sistemine taşımak

Tartışma genellikle iki seçenekli sunuluyor, ama 2026'da güçlü bir üçüncüsü var: uzun bağlam işini modelin dikkat mekanizmasından çıkarıp **dosya sistemi ve kabuk araç çağrılarına** taşımak. "Coding Agents are Effective Long-Context Processors" (arXiv:2603.20432, 20 Mart 2026) bu yaklaşımın yayımlanmış en iyi sonuçları ortalama **%17,3** geçtiğini ve 3 trilyon tokena kadar uzanan korpuslarda çalıştığını bildiriyor.

Fikir aslında eski bir mühendislik refleksi: veriyi belleğe yüklemek yerine, veriye giden bir sorgu yazmak. Ajan `grep`, `head`, `jq` gibi araçlarla dosyaya bakar, yalnızca ilgili satırları bağlama alır, geri kalanı diskte bırakır:

```bash
# Ajanın bağlama 400 bin token yüklemek yerine yaptığı iş:
$ grep -rn "fesih bildirimi" sozlesmeler/ | head -20
sozlesmeler/2024-tedarik.md:118: ... fesih bildirimi otuz gün önce ...
sozlesmeler/2025-bakim.md:64:    ... fesih bildirimi yazılı olarak ...

$ sed -n '110,130p' sozlesmeler/2024-tedarik.md   # yalnızca ilgili blok
```

Bu, dosya tabanlı bir korpusunuz varsa hem RAG'dan daha az altyapı ister (embedding hattı, vektör veritabanı, yeniden indeksleme yok) hem de tam bağlamdan çok daha ucuzdur. Buna karşılık ajan döngüsü gerektirir ve arama terimini modelin doğru seçmesine bağlıdır — anlamsal eşleşmenin şart olduğu yerlerde RAG hâlâ üstündür.

## Karar tablosu

| Durum | Seçim |
| --- | --- |
| Korpus küçük (<100 bin token) ve her sorguda aynı | Tam bağlam + prompt caching |
| Korpus büyük, sorgular dar ve noktasal | RAG |
| Korpus dosya sisteminde, aramalar sözcüksel | Ajan + kabuk araçları |
| Belge sık değişiyor, tazelik kritik | RAG (indeksi güncelleyin) |
| Tek bir uzun belgede bütünsel akıl yürütme | Tam bağlam |
| Kaynak gösterimi zorunlu | Tam bağlam zayıf — RAG doğal olarak kaynak taşır |

Sık gözden kaçan bir ekonomik ayrıntı: sabit ve büyük bir ön ek her sorguda tekrar ediyorsa, prompt caching tam bağlam seçeneğini beklediğinizden çok daha rekabetçi hâle getirir — çünkü önbellek okumaları temel girdi fiyatının küçük bir katıdır. Ancak bu yalnızca ön ek _gerçekten_ sabit kaldığında geçerlidir; bağlamın başına değişken bir kullanıcı verisi koyduğunuz anda kazanç sıfırlanır.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>1 milyon token artık taban özellik; ayırt edici olan pencerenin ne kadarının etkin kullanıldığı.</li><li>Bağlam çürümesi (Chroma, 2025) uzunluğun tek başına doğruluğu düşürdüğünü, tek bir dikkat dağıtıcının bile zarar verdiğini gösteriyor.</li><li>Ölçtüm: aynı paralel metin Türkçe'de 80, İngilizce'de 54 token — yaklaşık 1,48 kat. Kendi korpusunuzda ölçün.</li><li>Üçüncü seçeneği unutmayın: dosya sistemi + kabuk araçlarıyla çalışmak, uygun korpuslarda her ikisinden de ucuz olabilir.</li></ul></div>

<div class="faq"><details><summary>RAG mı uzun bağlam mı, hangisi daha iyi?</summary><p>Tek bir doğru cevap yok; korpus büyüklüğü, sorgu tipi ve tazelik ihtiyacı belirler. Küçük ve sabit korpuslarda tam bağlam artı prompt caching genellikle daha basit ve yeterlidir. Büyük, sık değişen veya kaynak gösterimi gereken korpuslarda RAG üstündür.</p></details><details><summary>Bağlam çürümesi nedir?</summary><p>Girdi uzadıkça modelin doğruluğunun düşmesidir — görev zorlaşmasa bile. Chroma'nın 2025 tarihli çalışması 18 model üzerinde bunu gösterdi; hedef bilginin metnin başında olduğu durumlarda doğruluk en yüksek, dikkat dağıtıcı içerik arttıkça en düşük.</p></details><details><summary>1 milyon tokenlık pencerede tüm belgelerimi göndersem olmaz mı?</summary><p>Teknik olarak olur, pratik olarak nadiren doğru karardır. Her sorguda tam korpusu göndermek doğruluğu artırmaz, ilk token gecikmesini büyütür ve Türkçe metinde orantılı olarak daha pahalıya gelir. Sabit bir ön ekiniz varsa prompt caching bu maliyeti ciddi biçimde düşürür.</p></details></div>

---

Özetle: pencere büyüdü ama karar kolaylaşmadı — sadece seçenek sayısı üçe çıktı. Getirme hattını sıfırdan kurmak isterseniz [RAG rehberi](/posts/rag-nedir-nasil-kurulur/), pencereye ne koyacağınıza karar vermenin disiplini için [bağlam mühendisliği](/posts/baglam-muhendisligi/), ve modeli eğitmekle bilgi vermek arasındaki farkı netleştirmek için [fine-tuning mi RAG mi](/posts/fine-tuning-mi-rag-mi/) yazılarına bakabilirsiniz.
