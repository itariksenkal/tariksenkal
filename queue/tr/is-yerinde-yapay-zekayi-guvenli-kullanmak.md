---
title: "İş Yerinde Yapay Zekayı Güvenli Kullanmak: Pratik Kurallar"
description: "Yapay zeka araçlarına neler yapıştırılmamalı, KVKK açısından nelere dikkat edilmeli, kurumsal ve kişisel hesap farkı nedir? Çalışanlar için sade bir rehber."
publishDate: "2026-11-16T09:17:00+03:00"
lang: tr
category: "Güvenlik"
tags: ["Yapay Zeka", "KVKK", "Veri Güvenliği", "İş Hayatı"]
translation: "using-ai-safely-at-work"
heroImage:
  src: "../../../assets/blog/covers/is-yerinde-yapay-zekayi-guvenli-kullanmak.jpg"
  alt: "Ofiste bilgisayar başında yapay zeka aracı kullanan bir çalışan ve kilit simgesi"
---

Yapay zeka asistanları e-posta yazmaktan rapor özetlemeye kadar pek çok işi hızlandırıyor ve birçok çalışan bunları şirketin resmî bir kararını beklemeden kullanmaya başladı bile. Sorun araçların kendisinde değil, onlara neyi verdiğimizde. Sohbet kutusuna yapıştırdığınız bir müşteri listesi, bir sözleşme taslağı ya da bir şifre, artık yalnızca sizin bilgisayarınızda değildir. Bu yazıda bireysel bir çalışan olarak yapay zekayı iş yerinde güvenle kullanmak için uygulayabileceğiniz pratik kuralları, KVKK’nın temel ilkeleriyle birlikte anlatıyorum. Amacım korkutmak değil; birkaç basit alışkanlıkla hem verimli hem de temkinli olmanın mümkün olduğunu göstermek.

## Yapıştırdığınız metin nereye gidiyor?

Bulut tabanlı bir yapay zeka aracına bir metin gönderdiğinizde, bu metin hizmet sağlayıcının sunucularında işlenir ve çoğu zaman bir süre saklanır. Sağlayıcıya, hesap türüne ve ayarlarınıza bağlı olarak konuşmalar kötüye kullanım denetimi için incelenebilir ya da modelin geliştirilmesinde kullanılabilir. Bunların hangisinin geçerli olduğu araçtan araca ve zaman içinde değişebilir; bu yüzden “nasılsa kimse görmez” varsayımı güvenli değildir.

Bunun gerçek sonuçları oldu. Mayıs 2023’te Samsung, bazı mühendislerinin hassas kaynak kodunu bir sohbet botuna yüklediğini fark ettikten sonra çalışanlarının şirket cihazlarında üretken yapay zeka araçlarını kullanmasını geçici olarak yasakladı. Olay, kötü niyetten değil, “işimi hızlandırayım” refleksinden kaynaklanıyordu. Çoğu veri sızıntısı da tam olarak böyle başlar.

## Yapıştırmadan önce: kırmızı çizgiler

Pratik bir kural: bir bilgiyi şirket dışından birine e-postayla gönderemiyorsanız, onaylanmamış bir yapay zeka aracına da yapıştırmayın. Aşağıdaki tablo en sık karşılaşılan riskli içerikleri özetliyor.

| İçerik türü | Örnekler | Neden riskli? |
|---|---|---|
| Kişisel veriler | Ad-soyad, TC kimlik no, telefon, adres, e-posta | KVKK kapsamında; aktarım için hukuki dayanak gerekir |
| Özel nitelikli kişisel veriler | Sağlık, biyometrik veri, din, sendika üyeliği, ceza mahkûmiyeti | Kanunda daha sıkı korunur; sızıntının etkisi ağırdır |
| Sırlar ve kimlik bilgileri | Şifreler, API anahtarları, erişim belirteçleri | Bir kez dışarı çıkınca geri alınamaz; hemen değiştirilmesi gerekir |
| Müşteri ve iş ortağı belgeleri | Sözleşmeler, teklifler, yazışmalar | Gizlilik sözleşmelerini ihlal edebilir |
| Şirket içi gizli bilgiler | Kaynak kod, yayımlanmamış finansal veriler, strateji belgeleri | Ticari sır niteliği taşıyabilir |

Bu, yapay zekayı bu konularda hiç kullanamayacağınız anlamına gelmez. Çoğu zaman metni **anonimleştirerek** aynı faydayı elde edebilirsiniz: gerçek isimler yerine “Müşteri A”, gerçek tutarlar yerine yuvarlak örnekler, şirket adı yerine “bir lojistik firması” yazmak gibi. Model, bir sözleşme maddesinin dilini iyileştirmek için tarafların gerçek adını bilmeye ihtiyaç duymaz.

<div class="callout"><strong>İpucu:</strong> Yanlışlıkla bir şifre veya API anahtarı yapıştırdıysanız konuşmayı silmek yeterli değildir. O anahtarı hemen iptal edip yenisini oluşturun ve durumu BT veya bilgi güvenliği ekibinize bildirin.</div>

## KVKK açısından temel noktalar

Türkiye’de kişisel verilerin işlenmesi 6698 sayılı Kişisel Verilerin Korunması Kanunu’na (KVKK) tabidir. Bir yapay zeka aracına kişisel veri içeren bir metin göndermek de bir “işleme” faaliyetidir. Çalışan olarak bilmeniz gereken birkaç temel ilke şunlar:

- **Kişisel veri geniş bir kavramdır.** Bir kişiyi doğrudan ya da dolaylı olarak tanımlanabilir kılan her bilgi bu kapsama girer; yalnızca TC kimlik numarası değil, bir e-posta adresi ya da benzersiz bir müşteri numarası da.
- **Özel nitelikli veriler daha sıkı korunur.** Kanunun 6. maddesi sağlık, biyometrik ve genetik veriler, din, siyasi düşünce, sendika üyeliği, ceza mahkûmiyeti gibi verileri ayrı bir kategoride tutar.
- **Yurt dışına aktarım ayrı kurallara bağlıdır.** Kullandığınız aracın sunucuları yurt dışındaysa, kişisel verinin oraya gönderilmesi Kanunun 9. maddesindeki yurt dışına aktarım kurallarını gündeme getirir. Bu madde, 7499 sayılı Kanunla değiştirilmiş ve yeni düzenleme 1 Haziran 2024’te yürürlüğe girmiştir.
- **Kurumun rehberi var.** Kişisel Verileri Koruma Kurumu, 24 Kasım 2025’te “Üretken Yapay Zekâ ve Kişisel Verilerin Korunması Rehberi (15 Soruda)” başlıklı bir rehber yayımladı. Rehber, üretken yapay zeka sistemlerinin kişisel veriler üzerindeki etkilerini ve bireylerin dikkat etmesi gereken noktaları ele alıyor; şirketinizin uyum ekibiyle birlikte okumaya değer.

Bu bölüm genel bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Somut bir durum için şirketinizin hukuk veya uyum birimine danışın.

## Kurumsal hesap ile kişisel hesap aynı şey değil

Birçok yapay zeka sağlayıcısı bireysel kullanıcılar için ücretsiz veya ücretli hesaplar ile şirketlere yönelik kurumsal planlar sunar. Bu planlar arasında veri kullanımı konusunda önemli farklar olabilir: konuşmaların model eğitiminde kullanılıp kullanılmadığı, ne kadar süre saklandığı, yöneticilerin hangi denetim araçlarına sahip olduğu ve sağlayıcıyla imzalanan veri işleme sözleşmesi gibi.

Burada genelleme yapmak tehlikeli, çünkü varsayılan ayarlar ve koşullar sağlayıcıdan sağlayıcıya farklıdır ve zamanla değişir. Pratik öneriler:

- İş bilgisi için mümkünse şirketinizin onayladığı ve yönettiği hesabı kullanın, kişisel hesabınızı değil.
- Kişisel bir hesap kullanıyorsanız, ayarlarda “model geliştirme için verilerimi kullan” türündeki seçeneği bulun ve ne yaptığını okuyun.
- Gizlilik politikasını ve kullanım koşullarını en azından veri saklama ve eğitim kullanımı başlıkları için gözden geçirin.
- “Kurumsal” etiketi tek başına her şeyi çözmez; şirketinizin sağlayıcıyla yaptığı sözleşme ve iç kurallar asıl belirleyicidir.

## Çıktıyı doğrulamak sizin sorumluluğunuz

Güvenli kullanımın ikinci yarısı, araca ne verdiğiniz kadar araçtan ne aldığınızla ilgilidir. Dil modelleri akıcı ama zaman zaman yanlış cevaplar üretir; olmayan bir mevzuat maddesine, uydurma bir kaynağa ya da yanlış bir hesaplamaya kendinden emin bir dille yer verebilir. ABD Ulusal Standartlar ve Teknoloji Enstitüsü (NIST), Temmuz 2024’te yayımladığı üretken yapay zeka risk profilinde bu durumu “konfabulasyon” başlığıyla temel riskler arasında sayıyor. Konuyu daha teknik bir açıdan [halüsinasyonları azaltma yazımda](/posts/llm-halusinasyon-azaltma/) ele almıştım.

İş yerinde bunun anlamı şu: yapay zekanın yazdığı bir metni gönderdiğinizde, altında sizin adınız vardır. Bu yüzden:

- Rakamları, tarihleri, isimleri ve alıntıları kaynağından kontrol edin.
- Hukuki, mali veya teknik bir iddiayı uzmanına doğrulatmadan dışarıya göndermeyin.
- Yapay zekanın ürettiği kodu, test etmeden canlı sisteme almayın.
- Gerektiğinde, bir metnin hazırlanmasında yapay zekadan yararlandığınızı şirket kurallarına uygun biçimde belirtin.

Bir de az bilinen bir risk var: yapay zekaya özetlettiğiniz bir belge veya web sayfası, modeli yanıltmaya yönelik gizli talimatlar içerebilir. Bu, “prompt injection” olarak bilinir ve özellikle araç kullanabilen asistanlarda önemlidir. Ayrıntısını [bu yazıda](/posts/prompt-injection-guvenlik/) anlattım.

## Şirketinizde politika yoksa ne yapmalı?

Pek çok kurumda yapay zeka kullanımına dair yazılı bir kural henüz yok ya da çalışanlar onu bilmiyor. Bu durumda şu adımlar işe yarar:

1. **Sorun.** BT, bilgi güvenliği veya uyum biriminize hangi araçların onaylı olduğunu sorun. Bu soru çoğu zaman bir politikanın yazılmasını da tetikler.
2. **Varsayılan olarak temkinli olun.** Kural netleşene kadar yalnızca kamuya açık veya anonimleştirilmiş bilgiyle çalışın.
3. **Kendi kurallarınızı yazın.** Ekip olarak “hangi bilgiyi hangi araca verebiliriz” sorusuna birlikte cevap veren kısa bir liste hazırlayın.
4. **Hataları saklamayın.** Yanlışlıkla hassas bir bilgi paylaştıysanız, bunu erken bildirmek zararı küçültmenin en iyi yoludur.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Şirket dışına e-postayla gönderemeyeceğiniz bir bilgiyi onaylanmamış bir yapay zeka aracına da yapıştırmayın.</li><li>Kişisel veriler, özel nitelikli veriler, şifreler ve müşteri belgeleri kırmızı çizgidir; çoğu iş anonimleştirilmiş metinle de yapılabilir.</li><li>KVKK, yapay zeka araçlarına gönderilen kişisel verileri de kapsar; yurt dışındaki sunucular ayrıca aktarım kurallarını gündeme getirir.</li><li>Kurumsal ve kişisel hesapların veri kullanım koşulları farklı olabilir; varsayımda bulunmak yerine ayarları ve sözleşmeyi kontrol edin.</li><li>Çıktının sorumluluğu sizdedir: rakamları, kaynakları ve iddiaları göndermeden önce doğrulayın.</li></ul></div>

<div class="faq"><details><summary>Anonimleştirdiğim metni rahatça paylaşabilir miyim?</summary><p>Riski büyük ölçüde azaltır ama dikkat gerekir. İsimleri silmek tek başına yetmeyebilir; benzersiz bir unvan, tarih ve şehir birleşince kişi yine tanınabilir hâle gelebilir. Kişiyi dolaylı yoldan tanımlatabilecek ayrıntıları da çıkarın.</p></details><details><summary>Kendi bilgisayarımda çalışan bir model daha güvenli mi?</summary><p>Veri cihazınızdan çıkmadığı için gizlilik açısından genellikle daha kontrollüdür. Ancak şirket cihazına izinsiz yazılım kurmak da ayrı bir güvenlik sorunudur; önce BT biriminizin onayını alın.</p></details><details><summary>Yapay zekayla yazdığım metni belirtmek zorunda mıyım?</summary><p>Bu, şirketinizin kurallarına, sektörünüze ve metnin nereye gittiğine bağlıdır. Genel bir yasal zorunluluk her durumda geçerli olmayabilir, ama şeffaflık güveni artırır. Şüphedeyseniz yöneticinize veya uyum biriminize sorun.</p></details><details><summary>Yanlışlıkla müşteri verisi paylaştım, ne yapmalıyım?</summary><p>Konuşmayı silin, ilgili şifre veya erişim bilgisi varsa hemen değiştirin ve durumu gecikmeden bilgi güvenliği veya uyum biriminize bildirin. Olayın KVKK kapsamında bir bildirim gerektirip gerektirmediğini onlar değerlendirecektir.</p></details></div>

---

**Kaynaklar**

- [KVKK – Üretken Yapay Zekâ ve Kişisel Verilerin Korunması Rehberi (15 Soruda)](https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda)
- [Mevzuat Bilgi Sistemi – 6698 sayılı Kişisel Verilerin Korunması Kanunu](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
- [NIST AI 600-1 – Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [Bloomberg – Samsung Bans Staff’s AI Use After Spotting ChatGPT Data Leak (2 Mayıs 2023)](https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-and-other-generative-ai-use-by-staff-after-leak)
