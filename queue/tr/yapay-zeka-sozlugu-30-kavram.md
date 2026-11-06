---
title: "Yapay Zeka Sözlüğü: Herkesin Bilmesi Gereken 30 Kavram"
description: "Model, token, parametre, halüsinasyon, RAG, ajan, GPU... Yapay zeka konuşmalarında en sık geçen 30 kavramı bir iki sade cümleyle açıklayan pratik bir sözlük."
publishDate: "2026-11-14T09:17:00+03:00"
lang: tr
category: "Temeller"
tags: ["Yapay Zeka", "Sözlük", "Temeller"]
translation: "ai-glossary-30-terms"
heroImage:
  src: "../../../assets/blog/covers/yapay-zeka-sozlugu-30-kavram.jpg"
  alt: "Yapay zeka kavramlarını gruplar hâlinde gösteren sözlük görseli"
---

Bir toplantıda biri “modeli ince ayarla eğittik, RAG ekledik, halüsinasyon azaldı” dediğinde cümlenin yarısı havada kalıyorsa yalnız değilsiniz. Yapay zeka hızla gündelik hayata girdi ama beraberinde getirdiği kelimeler aynı hızla açıklanmadı. Türkçe dil işleme ve büyük dil modelleri üzerine çalışırken en sık duyduğum sorular da çoğu zaman teknik değil, kavramsal oluyor: “Parametre tam olarak ne?”, “Açık kaynak ile açık ağırlık aynı şey mi?” Bu yazıda en sık karşılaşılan 30 kavramı beş gruba ayırıp her birini bir iki sade cümleyle açıklıyorum. Amaç uzman olmak değil; haberi, sunumu ya da ürün tanıtımını okurken neyin ne olduğunu rahatça takip edebilmek.

## Temel kavramlar

İşe en geniş çerçeveden başlayalım. Bu beş kavram birbirinin içine geçmiş halkalar gibidir: yapay zeka en dıştaki halka, model ise elinizde tuttuğunuz somut üründür.

| Kavram | Sade açıklama |
|---|---|
| **Yapay zeka** | Bilgisayarların tahmin, öneri, karar ya da içerik üretme gibi normalde insan zekâsı gerektirdiği düşünülen işleri yapabilmesini sağlayan sistemlerin genel adı. |
| **Makine öğrenmesi** | Kuralları tek tek yazmak yerine bilgisayarın örneklerden kalıp çıkarmasını sağlayan yaklaşım. Bugünkü yapay zeka uygulamalarının büyük kısmı bu yolla geliştirilir. |
| **Derin öğrenme** | Çok katmanlı yapay sinir ağlarıyla yapılan makine öğrenmesi. Görüntü tanıma, konuşma ve dil modellerindeki büyük sıçramaların arkasındaki teknik. |
| **Yapay sinir ağı** | Birbirine bağlı basit hesap birimlerinden oluşan matematiksel bir yapı. Adını beyinden alır ama beyni taklit etmekten çok, sayıları katman katman dönüştüren bir hesap makinesine benzer. |
| **Model** | Eğitim sonunda ortaya çıkan, girdi alıp çıktı üreten somut dosya ve yazılım. “ChatGPT’nin arkasındaki model” dediğimizde bunu kastederiz. |

## Model nasıl öğrenir?

Bir modelin “bilmesi” aslında eğitim sırasında ayarlanmış milyonlarca, hatta milyarlarca sayıdan ibarettir. Bu gruptaki kavramlar o sürecin aşamalarını anlatır.

| Kavram | Sade açıklama |
|---|---|
| **Eğitim verisi** | Modelin öğrenirken gördüğü örneklerin tamamı: metinler, görseller, ses kayıtları. Modelin güçlü ve zayıf yanları büyük ölçüde bu veriden gelir. |
| **Eğitim (training)** | Modelin tahminlerini doğru cevaplarla karşılaştırıp hatasını azaltacak yönde kendini tekrar tekrar ayarlaması. Büyük modellerde haftalar sürebilen, çok pahalı bir süreçtir. |
| **Parametre** | Modelin içindeki ayarlanabilir sayılar. “70 milyar parametreli model” ifadesi, eğitimle belirlenmiş 70 milyar sayıdan söz eder; daha çok parametre genellikle daha çok kapasite ama daha yüksek maliyet demektir. |
| **Ön eğitim (pre-training)** | Modelin çok büyük ve genel bir veri üzerinde temel dil ya da görsel becerileri kazandığı ilk ve en pahalı aşama. |
| **İnce ayar (fine-tuning)** | Ön eğitimli bir modeli daha küçük ve özel bir veriyle ek eğitime sokarak belirli bir işe ya da üsluba uyarlamak. |
| **Hizalama (alignment)** | Modelin davranışını insanların niyet ve değerleriyle uyumlu hâle getirme çabası: yardımcı olsun, zarar vermesin, dürüst kalsın. |
| **RLHF** | “İnsan geri bildirimiyle pekiştirmeli öğrenme.” İnsanların hangi cevabı daha iyi bulduğunu işaretlemesinden bir ödül sinyali çıkarılır ve model bu sinyale göre ayarlanır. |

Bu konuda daha derine inmek isterseniz [RLHF yazıma](/posts/rlhf-nedir/) göz atabilirsiniz.

## Dil modellerinin dili

Sohbet botlarıyla ilgili haberlerde en çok geçen kelimeler bu gruptadır. Bir dil modelinin metni nasıl gördüğünü anlamak, neden bazen tuhaf hatalar yaptığını da açıklar.

| Kavram | Sade açıklama |
|---|---|
| **Büyük dil modeli (LLM)** | Çok büyük metin kütleleri üzerinde eğitilmiş, bir metnin devamında gelmesi en olası parçayı tahmin ederek yazı üreten model. |
| **Token** | Modelin metni böldüğü küçük parçalar; bir kelime, kelimenin bir kısmı ya da bir noktalama işareti olabilir. Türkçe gibi eklemeli dillerde tek bir kelime çoğu zaman birkaç tokene bölünür. |
| **Bağlam penceresi** | Modelin tek seferde “görebildiği” en fazla token sayısı. Konuşma ya da belge bu sınırı aşarsa baştaki kısımlar hesaba katılmaz. |
| **Prompt** | Modele verdiğiniz talimat, soru ya da örneklerin tamamı. Ne kadar açık ve bağlamlı olursa cevap o kadar isabetli olur. |
| **Çıkarım (inference)** | Eğitimi bitmiş modelin yeni bir girdiye cevap üretmesi. Siz soru sorduğunuzda çalışan kısım budur; eğitimden ayrı bir maliyettir. |
| **Halüsinasyon** | Modelin gerçekte olmayan bir bilgiyi kendinden emin bir dille uydurması. Teknik literatürde “konfabulasyon” da denir. |
| **Embedding** | Bir metnin anlamını temsil eden uzun bir sayı dizisi. Anlamca yakın metinlerin sayıları da birbirine yakın olur; anlamsal aramanın temeli budur. |

Token ve embedding kavramlarını daha ayrıntılı merak ediyorsanız [bu yazıda](/posts/token-ve-embedding/), bir dil modelinin içini ise [şurada](/posts/llm-nasil-calisir/) anlattım.

<div class="callout"><strong>İpucu:</strong> Halüsinasyon bir “arıza” değil, modelin çalışma biçiminin doğal bir yan ürünüdür: model doğruyu değil, en olası devamı üretir. Bu yüzden önemli her bilgiyi, özellikle isim, tarih, rakam ve kaynakları, ayrıca doğrulamak iyi bir alışkanlıktır.</div>

## Yapay zekayı nasıl kullanıyoruz?

Aynı temel model farklı biçimlerde paketlenip karşımıza çıkabilir. Bu kavramlar, modelin ürüne dönüştüğü katmanı anlatır.

| Kavram | Sade açıklama |
|---|---|
| **Üretken yapay zeka** | Yalnızca sınıflandırma ya da tahmin yapmak yerine yeni metin, görsel, ses veya kod üreten yapay zeka türü. |
| **Sohbet botu (chatbot)** | Bir dil modelini doğal konuşma arayüzüyle sunan uygulama. Model ile arayüz aynı şey değildir; aynı model farklı uygulamalarda çalışabilir. |
| **Çok modlu (multimodal) model** | Metnin yanında görsel, ses ya da video gibi farklı veri türlerini birlikte anlayabilen veya üretebilen model. |
| **RAG** | “Erişimle güçlendirilmiş üretim.” Model cevap yazmadan önce ilgili belgeler bulunur ve modele verilir; böylece cevap ezbere değil, kaynağa dayanır. |
| **Ajan (agent)** | Bir hedefi gerçekleştirmek için adım adım plan yapan, araç kullanan (arama, hesaplama, e-posta gibi) ve sonuca göre yeni adım atan yapay zeka sistemi. |
| **Akıl yürüten model** | Cevap vermeden önce ara adımlar üzerinde daha uzun “düşünmek” için ek hesap harcayan model türü. Matematik ve çok adımlı problemlerde daha iyi sonuç verebilir ama daha yavaş ve pahalıdır. |

## Altyapı ve ekosistem

Son grup, perde arkasını ve sektörün kendi içindeki tartışmalarını anlamak için gerekli kelimeler.

| Kavram | Sade açıklama |
|---|---|
| **GPU** | Binlerce basit hesabı aynı anda yapabilen işlemci. Başlangıçta grafik için tasarlandı; bugün yapay zeka eğitiminin ve çıkarımının iş gücüdür. |
| **Açık ağırlıklı model (open-weights)** | Parametreleri (ağırlıkları) herkesin indirip kendi bilgisayarında çalıştırabileceği model. Her açık ağırlıklı model “açık kaynak” değildir; eğitim verisi ve kodu paylaşılmamış, lisansı kısıtlı olabilir. |
| **Benchmark** | Modelleri karşılaştırmak için kullanılan standart test setleri. Faydalıdır ama test soruları eğitim verisine sızmışsa skorlar gerçek performansı abartabilir. |
| **API** | Bir yazılımın başka bir yazılımla konuşmasını sağlayan arayüz. Şirketler modelleri çoğu zaman bir API üzerinden, kullanım başına ücretle sunar. |
| **Kuantizasyon** | Modelin sayılarını daha az bitle saklayarak bellek ve hesap ihtiyacını düşürme tekniği. Model küçülür ve hızlanır; karşılığında kalite bir miktar düşebilir. |

## Kavramları birbirine bağlamak

Sözlükler tek tek kelimeleri öğretir ama asıl anlam ilişkilerde saklıdır. Bu yüzden 30 kavramı tek bir hikâyede birleştirelim.

Bir şirket büyük miktarda **eğitim verisi** toplar ve binlerce **GPU** üzerinde aylar süren bir **ön eğitim** yapar. Ortaya milyarlarca **parametre** taşıyan bir **büyük dil modeli** çıkar. Model önce **ince ayar** ve **RLHF** gibi yöntemlerle **hizalanır**, sonra **benchmark**larla ölçülür. Ardından ya bir **API** ve **sohbet botu** üzerinden sunulur ya da **açık ağırlıklı** olarak yayımlanır; meraklı biri onu **kuantizasyonla** küçültüp kendi bilgisayarında çalıştırabilir.

Siz bir **prompt** yazdığınızda metniniz **token**lara bölünür ve **bağlam penceresine** yerleşir; model **çıkarım** yaparak cevabı üretir. Cevap kaynağa dayanmıyorsa **halüsinasyon** riski artar; **RAG** bu yüzden ilgili belgeleri **embedding** ile bulup modele verir. Model bir görevi araçlar kullanarak adım adım yürütüyorsa artık bir **ajan**dan söz ederiz.

Bu akış, haberlerde okuduğunuz pek çok gelişmenin hangi halkaya dokunduğunu anlamanıza yardım eder. “Yeni model daha büyük” haberi parametrelerle, “daha ucuz” haberi çoğu zaman çıkarım ve kuantizasyonla, “daha güvenilir” haberi ise hizalama ve RAG ile ilgilidir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Yapay zeka en geniş çatıdır; makine öğrenmesi, derin öğrenme ve dil modelleri onun alt katmanlarıdır.</li><li>Bir modelin “bilgisi” eğitimle ayarlanmış parametrelerden oluşur; eğitim ile çıkarım ayrı süreçler ve ayrı maliyetlerdir.</li><li>Halüsinasyon, modelin en olası devamı üretmesinin doğal sonucudur; RAG ve doğrulama alışkanlığı riski azaltır.</li><li>Açık ağırlıklı model ile açık kaynak model aynı şey değildir; lisansa ve paylaşılan bileşenlere bakmak gerekir.</li></ul></div>

<div class="faq"><details><summary>Yapay zeka ile makine öğrenmesi aynı şey mi?</summary><p>Hayır. Yapay zeka genel hedefin adıdır; makine öğrenmesi bu hedefe ulaşmanın bugün en yaygın yoludur. Her makine öğrenmesi sistemi bir yapay zeka sistemidir ama tarihsel olarak kurallara dayalı, öğrenmeyen yapay zeka sistemleri de vardır.</p></details><details><summary>Daha fazla parametre her zaman daha iyi model demek mi?</summary><p>Her zaman değil. Parametre sayısı kapasiteyi gösterir ama verinin kalitesi, eğitim yöntemi ve hizalama da en az o kadar belirleyicidir. Bazı küçük modeller belirli işlerde çok daha büyük modellerle yarışabilir.</p></details><details><summary>Sohbet botu ile model arasındaki fark nedir?</summary><p>Model, cevabı üreten çekirdektir; sohbet botu ise o modeli bir arayüz, kurallar ve ek özelliklerle (dosya yükleme, web arama gibi) sunan üründür. Aynı model farklı ürünlerde farklı davranabilir.</p></details><details><summary>Bu kavramları öğrenmek için teknik bilgi gerekir mi?</summary><p>Gerekmez. Kavramları sezgisel olarak bilmek, haberleri değerlendirmek ve araçları bilinçli kullanmak için yeterlidir. Matematiksel ayrıntı yalnızca bu sistemleri geliştirmek isteyenler için gereklidir.</p></details></div>

---

**Kaynaklar**

- [OECD – Explanatory memorandum on the updated OECD definition of an AI system](https://oecd.ai/en/ai-publications/explanatory-memorandum-on-the-updated-oecd-definition-of-an-ai-system)
- [NIST AI 600-1 – Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [Google for Developers – Machine Learning Glossary](https://developers.google.com/machine-learning/glossary)
- [NTIA – Dual-Use Foundation Models with Widely Available Model Weights](https://www.ntia.gov/issues/artificial-intelligence/open-model-weights-report)
