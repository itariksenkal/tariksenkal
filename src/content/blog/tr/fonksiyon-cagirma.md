---
title: "Fonksiyon Çağırma ve Yapılandırılmış Çıktı: Modeli Güvenilir Bir Bileşene Dönüştürmek"
description: "Fonksiyon çağırma ve yapılandırılmış çıktı, dil modelini serbest metin üreten bir sohbetçiden sistemlerinize güvenle bağlanan bir bileşene dönüştürür. JSON üretimi, şema zorlama ve sağlam entegrasyon pratiklerini sezgisel örneklerle anlatıyoruz."
publishDate: "2026-08-09T23:20:00+03:00"
lang: tr
category: "Entegrasyon"
tags: ["Entegrasyon", "Yapay Zeka"]
translation: "function-calling-structured-output"
heroImage:
  src: "../../../assets/blog/bimg-06.jpg"
  alt: "Fonksiyon Çağırma ve Yapılandırılmış Çıktı: Modeli Güvenilir Bir Bileşene Dönüştürmek"
---

Bir dil modeline "İstanbul'da hava nasıl?" diye sorduğunuzda, eskiden uzun bir paragrafla yanıt verirdi; oysa siz yalnızca bir hava durumu API'sini çağırmak için gereken iki bilgiyi istiyordunuz: şehir ve birim. Fonksiyon çağırma (function/tool calling) ve yapılandırılmış çıktı, modeli laf üreten bir sohbetçiden, yazılımınıza temiz fişle takılan bir bileşene dönüştürür. Bu yazıda modelin nasıl JSON ürettiğini, şemayı nasıl zorladığımızı ve entegrasyonu nasıl güvenilir kıldığımızı sezgisel olarak anlatıyoruz.

## Sorun: serbest metin makineyle konuşmaz

İnsanlar belirsizliği sever; yazılım sevmez. "Yarın saat üç gibi bir toplantı ayarla" cümlesi bir insan için nettir, ama bir takvim API'si için anlamsızdır. API'nin ihtiyacı olan şey şudur: başlangıç zamanı, süre, katılımcılar. Yani serbest cümleyi, makinenin doğrudan yiyebileceği bir veri yapısına çevirmek gerekir.

İşte fonksiyon çağırma tam burada devreye girer. Modeli, "şu cümleyi anla ve şu kalıba göre doldur" diye yönlendirirsiniz. Model artık nesir yazmaz; bir _çağrı niyeti_ üretir: hangi fonksiyon, hangi argümanlarla.

> Fonksiyon çağırma, modelin koddan veri okumasını değil; kodun modelden veri okumasını sağlar. Yön tersine döner.

## Fonksiyon çağırma nasıl çalışır?

Akışı bir restoran analojisiyle düşünün. Siz (uygulama) menüyü (kullanabileceği araçların listesini) garsona (modele) verirsiniz. Müşteri (kullanıcı) doğal dille sipariş verir: "Acılı bir şeyler olsun, az pişmiş." Garson bu isteği mutfağın anlayacağı bir fişe çevirir: `{yemek: "köfte", acı: true, pişme: "az"}`. Mutfak (sizin kodunuz) fişi okur, yemeği hazırlar, garson sonucu masaya getirir.

Teknik olarak adımlar şöyledir:

1.  Uygulama, modele kullanıcı mesajıyla birlikte **araç tanımlarını** (isim, açıklama, parametre şeması) gönderir.
2.  Model, doğrudan yanıt vermek yerine bir **araç çağrısı** döndürür: fonksiyon adı ve JSON argümanları.
3.  Uygulama bu çağrıyı **gerçekten çalıştırır** (API'yi vurur, veritabanını sorgular).
4.  Sonuç modele geri verilir; model bunu doğal dilde özetler veya bir sonraki adıma geçer.

Kritik nokta: modelin kendisi fonksiyonu çalıştırmaz. Yalnızca "bu fonksiyonu şu argümanlarla çağırmak istiyorum" der. Yürütme tamamen sizin kontrolünüzdedir; bu da güvenlik ve denetlenebilirlik açısından önemlidir.

## Şema: modele verdiğiniz form

Şema, modele verdiğiniz boş bir formdur. İyi tasarlanmış bir form, doğru doldurulma olasılığını ciddi biçimde artırır. Çoğu sağlayıcı, parametreleri tarif etmek için **JSON Schema** kullanır. Aşağıda bir hava durumu aracının basit tanımı yer alıyor:

```json
{
  "name": "hava_durumu_getir",
  "description": "Belirtilen şehir için güncel hava durumunu döndürür.",
  "input_schema": {
    "type": "object",
    "properties": {
      "sehir":  { "type": "string", "description": "Örn: İstanbul" },
      "birim":  { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["sehir"]
  }
}
```

Buradaki her ayrıntı modele bir sinyal gönderir. `description` alanları, modelin aracı ne zaman ve nasıl kullanacağını anlamasını sağlar; bunları ihmal etmeyin. `enum` ile geçerli değerleri kısıtlarsınız, böylece model "santigrat" gibi serbest bir metin uyduramaz. `required` ise hangi alanların zorunlu olduğunu belirtir.

<div class="callout"><strong>İpucu:</strong> Açıklama alanlarını dokümantasyon gibi yazın, anahtar kelime gibi değil. "Şehir adı" yerine "Hava durumunun sorgulanacağı şehir; ülke belirsizse Türkiye varsayılır" yazmak, modelin doğru karar vermesini kolaylaştırır.<p></p></div>

## Şemayı zorlamak: nazikçe istemek mi, kuralı dayatmak mı?

Bir şemayı modele iletmenin iki ayrı garanti düzeyi vardır ve bunları karıştırmak çoğu hatanın kaynağıdır.

### 1\. Sözlü rica (prompt ile)

Modele "lütfen şu JSON formatında yanıt ver" diyebilirsiniz. Bu çoğu zaman işe yarar, ama bir garanti değildir. Model bazen açıklama metni ekler, virgül unutur, yahut alanı atlar. Bu yaklaşım hızlı prototipler için yeterlidir; üretim için kırılgandır.

### 2\. Yapısal zorlama (constrained decoding)

Birçok modern sağlayıcı, çıktıyı üretim aşamasında şemaya göre _kısıtlar_. Yani model her bir tokenı seçerken, şemayı bozacak seçenekler en baştan elenir. Sonuç: dilbilgisel olarak şemaya uyan JSON çıkar. Buna genellikle "structured output", "JSON mode" veya araç çağrılarında "tool use" denir.

Önemli bir ayrım: yapısal zorlama _biçimi_ garanti eder, _anlamı_ değil. Model size geçerli bir JSON verebilir ama içindeki şehir adı yine de yanlış olabilir. Şema, geçersiz tarihi engeller; ama 30 Şubat'ı engellemez. Biçimsel geçerlilik ile mantıksal doğruluğu ayrı tutun.

> Şema, "bu kutuya ne yazılabilir" sorusunu yanıtlar; "yazılan doğru mu" sorusunu yanıtlamaz. İkincisi hâlâ sizin işiniz.

## Güvenilir entegrasyon için pratikler

Fonksiyon çağırmayı üretime taşırken birkaç ilke, sistemi kırılgan olmaktan çıkarır:

-   **Çıktıyı her zaman doğrulayın.** Model JSON üretse bile, kendi kodunuzda tekrar şemaya karşı doğrulayın (örneğin Pydantic, Zod gibi). Modele güvenin ama denetleyin.
-   **Argümanları sanki kullanıcıdan geliyormuş gibi ele alın.** Modelin ürettiği bir dosya yolu, SQL parçası veya komut, doğrudan çalıştırılmadan önce arındırılmalıdır. Model, kötü niyetli bir kullanıcının dolaylı talimatlarıyla yönlendirilebilir.
-   **Hataları modele geri besleyin.** Çağrı başarısız olursa (eksik alan, API hatası), hata mesajını modele iletip yeniden denemesini isteyin. Çoğu zaman ikinci denemede düzeltir.
-   **Araç sayısını yönetilebilir tutun.** Onlarca araç sunarsanız model hangisini seçeceğini şaşırır. Gerekiyorsa araçları bağlama göre filtreleyip alt küme sunun.
-   **İdempotentlik ve onay.** Para transferi gibi geri alınamaz eylemlerde, modelin çağrısını doğrudan yürütmek yerine kullanıcı onayı isteyin.

```text
# Sözde kod: güvenli yürütme döngüsü
cagri = model.cevapla(mesaj, araclar)
if cagri.tur == "arac_cagrisi":
    veri = sema.dogrula(cagri.argumanlar)   # biçim + tip kontrolü
    if not veri.gecerli:
        model.geri_besle(veri.hata)          # modele tekrar dene de
    else:
        sonuc = guvenli_calistir(cagri.isim, veri)
        model.devam_et(sonuc)
```

<div class="callout"><strong>İpucu:</strong> Araç çağrılarını ve sonuçlarını loglayın. Bir hata olduğunda "model neden bu argümanı seçti?" sorusuna ancak ham çağrı kaydına bakarak yanıt verebilirsiniz.<p></p></div>

## Sık yapılan hatalar

Sahada en çok karşılaşılan tuzaklar şunlardır: araç açıklamalarını boş geçmek (model ne zaman kullanacağını bilemez); biçimsel geçerliliği doğruluk sanmak; modelin çağrısını sorgusuz yürütmek; ve tek bir devasa "her şeyi yapan" araç tanımlamak. Bunun yerine, dar kapsamlı, iyi tarif edilmiş ve doğrulanan araçlar tasarlayın.

Bu disiplin, ajan tabanlı sistemlerin de temelidir. Bir LLM ajanının dış dünyayla her etkileşimi aslında bir araç çağrısıdır. Bu konuya daha geniş bir çerçeveden bakmak isterseniz, [HatsonTech](/posts/hatsontech-nedir/) ekibinin yapay zekâ entegrasyonu üzerine yazılarına göz atabilirsiniz.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Fonksiyon çağırma, modeli serbest metinden makine-okunur veri üretimine geçirir; yön kullanıcıdan koda döner.</li><li>Model fonksiyonu çalıştırmaz; yalnızca çağrı niyeti üretir. Yürütme sizin kontrolünüzdedir.</li><li>İyi yazılmış şema açıklamaları (<code>description</code>, <code>enum</code>, <code>required</code>) çıktı kalitesini doğrudan etkiler.</li><li>Yapısal zorlama biçimi garanti eder, anlamı değil; çıktıyı her zaman kendi tarafınızda doğrulayın.</li><li>Model argümanlarını güvenilmez kullanıcı girdisi gibi ele alın; arındırın, onaylatın, loglayın.</li></ul></div>

<div class="faq"><details><summary>Yapısal çıktı ile fonksiyon çağırma aynı şey mi?</summary><p>Yakın akrabalar ama tıpatıp aynı değiller. Yapısal çıktı, modelin yanıtını belirli bir JSON şemasına uydurmaktır. Fonksiyon çağırma ise modelin bir aracı belirli argümanlarla çağırma niyetini ifade etmesidir; argümanlar da yapısal çıktının özel bir hâlidir. Yani fonksiyon çağırma, yapısal çıktıyı bir eylemle birleştirir.</p></details><details><summary>Şema zorlama varsa neden hâlâ doğrulama gerekiyor?</summary><p>Çünkü zorlama yalnızca biçimi garanti eder. Şemaya uygun ama mantıksal olarak hatalı değerler (var olmayan bir ürün kodu, gelecekteki bir doğum tarihi) hâlâ üretilebilir. Ayrıca sağlayıcı veya model değiştiğinde davranış farklılaşabilir; kendi doğrulamanız bu belirsizliğe karşı sigortadır.</p></details><details><summary>Çok sayıda araç sunmak modeli yorar mı?</summary><p>Evet. Araç sayısı arttıkça model doğru olanı seçmekte zorlanır ve bağlam penceresi de şişer. Pratik çözüm, araçları kullanıcı niyetine göre önceden filtrelemek, mantıksal gruplara ayırmak ve her birine net, ayırt edici açıklamalar yazmaktır.</p></details></div>

---
