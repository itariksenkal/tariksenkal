---
title: "Yapay Zekâya Doğru Soru Sormak: Günlük Kullanım İçin Rehber"
description: "Yapay zekâ asistanlarından daha iyi yanıt almak için bağlam, amaç, biçim, örnek ve kaynak isteme ipuçları; teknik bilgi gerektirmeyen 10 önce/sonra örneğiyle."
publishDate: "2026-12-05T09:17:00+03:00"
lang: tr
category: "Temeller"
tags: ["Yapay Zeka", "Prompt", "Dijital Okuryazarlık"]
translation: "asking-ai-better-questions"
heroImage:
  src: "../../../assets/blog/covers/yapay-zekaya-dogru-soru-sormak.jpg"
  alt: "Bir yapay zekâ sohbet ekranında yazılan ayrıntılı bir soru"
---

Yapay zekâ asistanlarını kullanan çoğu kişi benzer bir deneyim yaşıyor: bazen şaşırtıcı derecede iyi bir yanıt alıyorsunuz, bazen de genel geçer, işe yaramaz bir metin. Aradaki farkın önemli bir kısmı modelden değil, sorudan kaynaklanıyor. Dil modelleriyle çalışan biri olarak sık gördüğüm bir sorun, insanların asistana, kendileri hakkında hiçbir şey bilmeyen bir yabancıya değil de yıllardır birlikte çalıştıkları bir iş arkadaşına konuşur gibi soru sormaları. Bu yazı teknik bir "prompt mühendisliği" rehberi değil; ChatGPT, Claude, Gemini veya başka bir asistanı günlük işlerinde kullanan herkes için pratik bir el kitabı. Sonunda 10 önce/sonra örneğini bir tabloda bulacaksınız.

## Asistan sizi tanımıyor

Bir yapay zekâ asistanı, siz söylemedikçe kim olduğunuzu, neden sorduğunuzu ve yanıtı ne için kullanacağınızı bilmez. "Bir dilekçe yaz" dediğinizde, kime, hangi konuda, hangi tonda ve ne uzunlukta bir dilekçe istediğinizi tahmin etmek zorunda kalır. Tahmin ettiği şey de genellikle "ortalama" bir dilekçedir.

Anthropic'in Claude için yayımladığı rehberde bunun için kullanışlı bir test öneriliyor: isteğinizi, konuyu hiç bilmeyen bir iş arkadaşınıza gösterdiğinizi düşünün. O kişi isteği okuyup ne yapacağını anlayabiliyor mu, yoksa bir sürü soru sorması mı gerekiyor? Bir insan kafası karışarak okuyorsa, model de büyük olasılıkla karışacaktır.

## İyi bir sorunun parçaları

Her soruda hepsine gerek yok, ama iyi sonuç veren isteklerde şu unsurlar sıkça bulunuyor. Google da Gemini için hazırladığı rehberde benzer bir çerçeve öneriyor: rol, görev, bağlam ve biçim.

- **Bağlam:** Siz kimsiniz, durum ne? "Küçük bir pastane işletiyorum", "lise öğretmeniyim", "ilk kez ev kiralıyorum" gibi.
- **Amaç:** Yanıtı ne için kullanacaksınız? Karar vermek, birine göndermek, bir şeyi anlamak?
- **Biçim:** Nasıl bir çıktı istiyorsunuz? Madde listesi, tablo, 150 kelimelik bir e-posta, adım adım talimat?
- **Örnek:** Elinizde beğendiğiniz bir örnek varsa ekleyin. "Şu tonda yaz" demek, tonu tarif etmekten çoğu zaman daha etkilidir.
- **Sınırlar:** Nelerden kaçınılmalı? "Teknik terim kullanma", "bütçe 5.000 TL'yi geçmesin", "bir sayfayı aşmasın".

<div class="callout"><strong>İpucu:</strong> Ne istediğinizden emin değilseniz bunu söyleyin: "Bu konuda sana bilgi verebilmem için önce bana sormam gereken soruları sor." Asistan, eksik bilgileri sizinle birlikte tamamlayabilir.</div>

## Kaynak isteyin, ama kontrol edin

Yapay zekâ asistanları bazen kendinden emin bir dille yanlış bilgi verebilir, hatta var olmayan makale, kanun maddesi veya bağlantı uydurabilir. Bu yüzden önemli konularda:

- **Kaynak isteyin:** "Bu bilgiyi hangi kaynağa dayandırıyorsun? Resmi kaynakları listele."
- **Bağlantıları açın:** Verilen bağlantının gerçekten var olduğunu ve iddiayı desteklediğini kendiniz kontrol edin.
- **Belirsizliği sorun:** "Bu konuda emin olmadığın noktalar neler?" sorusu, modelin zayıf noktalarını görünür kılar.
- **Güncelliği sorgulayın:** Modellerin bilgisi belirli bir tarihe kadar uzanır. Fiyat, mevzuat, seçim, kur gibi değişken konularda güncel resmi kaynağa bakın.

Sağlık, hukuk ve finans gibi alanlarda yapay zekâ asistanları bir konuyu anlamanıza yardımcı olabilir, ama uzman görüşünün yerini tutmaz. Bu yazı da genel bilgilendirme amaçlıdır.

## Tek seferde değil, sohbet ederek

İlk yanıt mükemmel olmak zorunda değil. OpenAI'ın ChatGPT için yayımladığı yardım sayfasında da vurgulandığı gibi, iyi sonuç çoğu zaman deneme, sonucu inceleme ve isteği düzeltme döngüsüyle gelir. Yanıtı beğenmediğinizde baştan başlamak yerine neyin eksik olduğunu söyleyin:

- "Daha kısa olsun, en fazla beş madde."
- "Bu çok resmi oldu, arkadaşça bir ton kullan."
- "İkinci maddeyi bir örnekle açıkla."
- "Bu öneriyi 10 yaşında bir çocuğa anlatır gibi yeniden yaz."

Uzun bir işi parçalara bölmek de yardımcı olur. Önce taslak plan, sonra her bölüm, en sonda bütünün gözden geçirilmesi.

## 10 önce/sonra örneği

| # | Önce | Sonra | Ne eklendi? |
|---|---|---|---|
| 1 | "Diyet listesi yaz." | "Masa başı çalışan, 35 yaşında biriyim. Haftada 3 gün yürüyüş yapıyorum. Pratik, Türk mutfağına uygun 1 haftalık örnek kahvaltı fikirleri ver. Bir sağlık sorunum olursa doktora danışacağım." | Bağlam, sınır, beklenti |
| 2 | "Bir e-posta yaz." | "Ev sahibime, kombinin 10 gündür arızalı olduğunu ve bu hafta içinde tamir için ne zaman uygun olduğunu soran kibar ama net bir e-posta yaz. En fazla 120 kelime." | Alıcı, amaç, ton, uzunluk |
| 3 | "Bu yazıyı özetle." | "Aşağıdaki raporu yöneticime iletmek için 5 maddelik özetle. Her madde tek cümle olsun, sonuna tek cümlelik bir öneri ekle." | Okuyucu, biçim |
| 4 | "Tatil önerisi ver." | "Mayıs ayında 4 günlük, araba olmadan gezilebilecek, iki yetişkin için kişi başı konaklama hariç 8.000 TL bütçeli 3 yurt içi rota öner. Tablo halinde ver." | Tarih, kısıt, bütçe, biçim |
| 5 | "Kira artışı ne kadar?" | "Türkiye'de konut kira artışının yasal sınırının nasıl belirlendiğini genel olarak açıkla. Güncel oranı hangi resmi kaynaktan kontrol etmem gerektiğini söyle." | Güncel bilgi için resmi kaynak |
| 6 | "Bana Excel öğret." | "Excel'de hiç formül kullanmadım. Aylık harcamalarımı toplamak ve kategoriye göre ayırmak istiyorum. Adım adım, örnek verilerle anlat." | Seviye, somut hedef |
| 7 | "Bu doğru mu?" | "Aşağıdaki iddia doğru mu? Hangi kaynaklara dayanarak söylediğini belirt ve emin olmadığın noktaları ayrıca yaz." | Kaynak ve belirsizlik |
| 8 | "Çocuğuma fotosentezi anlat." | "8 yaşındaki çocuğuma fotosentezi mutfaktan bir benzetmeyle, 5–6 cümlede anlatmak istiyorum. Sonuna evde yapabileceğimiz basit bir deney ekle." | Hedef kitle, uzunluk, ek |
| 9 | "Özgeçmişimi düzelt." | "Aşağıdaki özgeçmiş, satış uzmanı ilanına başvurmak için. Önce zayıf noktaları listele, sonra değişiklik önerilerini madde madde yaz. Bilgi uydurma." | Amaç, sıra, sınır |
| 10 | "Sunum hazırla." | "Belediye meclisine geri dönüşüm projemizi anlatan 10 dakikalık bir sunum için 6 slaytlık bir akış öner. Her slayt için başlık ve 3 madde yaz. Örnek tonumuz aşağıda." | Süre, yapı, örnek |

## Paylaşmadan önce düşünün

İyi bir soru için bağlam önemli, ama her bilgiyi paylaşmak gerekmiyor. TC kimlik numarası, şifreler, banka bilgileri, başkalarına ait kişisel veriler veya işyerinizin gizli belgeleri gibi bilgileri genel kullanıma açık asistanlara yazmadan önce iki kez düşünün. Gerektiğinde isimleri ve ayrıntıları değiştirerek ("A şirketi", "müşteri X") aynı soruyu sorabilirsiniz. Kullandığınız hizmetin sohbetleri nasıl sakladığını ve model geliştirmede kullanıp kullanmadığını ayarlardan kontrol edin.

<div class="callout"><strong>Not:</strong> Asistandan aldığınız yanıtın sorumluluğu, onu kullanan kişidedir. Özellikle başkalarına göndereceğiniz veya karar vereceğiniz metinleri son kez kendiniz okuyun.</div>

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Asistan sizi tanımaz; bağlam, amaç ve biçim eklemek yanıt kalitesini belirgin biçimde artırır.</li><li>Beğendiğiniz bir örneği paylaşmak, tonu tarif etmekten çoğu zaman daha etkilidir.</li><li>Önemli konularda kaynak isteyin ve bağlantıları kendiniz kontrol edin.</li><li>İlk yanıtı son yanıt saymayın; neyin eksik olduğunu söyleyerek sohbeti sürdürün.</li><li>Kişisel ve gizli bilgileri paylaşmadan önce düşünün; gerekiyorsa ayrıntıları anonimleştirin.</li></ul></div>

<div class="faq"><details><summary>Uzun soru her zaman daha mı iyidir?</summary><p>Hayır. Amaç uzunluk değil, açıklıktır. Basit bir soru için tek cümle yeterlidir. Uzunluk, yanıtı etkileyecek bilgileri eklediğinizde işe yarar; gereksiz ayrıntı ise asıl isteği gölgede bırakabilir.</p></details><details><summary>Asistana kibar davranmak sonucu değiştirir mi?</summary><p>Kibarlık zararsızdır ve birçok kişi için doğal olandır, ama yanıtın kalitesini asıl belirleyen şey isteğin ne kadar açık olduğudur. "Lütfen"in yanına bağlam ve amaç eklemek daha büyük fark yaratır.</p></details><details><summary>Asistan "bilmiyorum" diyebilir mi?</summary><p>Diyebilir, ama her zaman demez. Bu yüzden ondan açıkça "emin değilsen belirt" veya "bilgi yoksa bilmiyorum de" istemek, uydurma bilgi riskini azaltmaya yardımcı olur. Yine de önemli bilgileri bağımsız kaynaklardan doğrulayın.</p></details><details><summary>Türkçe sormak sonucu kötüleştirir mi?</summary><p>Yaygın asistanlar Türkçe sorulara genellikle iyi yanıt veriyor. Çok teknik veya niş konularda İngilizce kaynaklar daha zengin olabilir; böyle durumlarda sorunuza önemli terimlerin İngilizce karşılıklarını da ekleyip yanıtı Türkçe isteyebilirsiniz.</p></details></div>

---

**Kaynaklar**

- [Anthropic: Prompting best practices (Claude istem rehberi)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [OpenAI Yardım Merkezi: Prompt engineering best practices for ChatGPT](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt)
- [9to5Google: Google'ın Gemini için yayımladığı istem yazma rehberi (Nisan 2024)](https://9to5google.com/2024/04/09/gemini-google-workspace-prompting-guide/)
