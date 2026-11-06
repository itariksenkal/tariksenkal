---
title: "A2A: Ajanlar Birbiriyle Nasıl Konuşur? (MCP'nin Rakibi Değil, Tamamlayıcısı)"
description: "A2A v1.0 ajanlar arası keşif ve görev devrini standartlaştırıyor. Agent Card, görev yaşam döngüsü, MCP ile farkı ve ajan ticaretinin protokol katmanı."
publishDate: "2026-08-13T23:53:00+03:00"
lang: tr
category: "Araçlar"
tags: ["Araçlar", "Yapay Zeka"]
translation: "a2a-agent-interoperability"
heroImage:
  src: "../../../assets/blog/covers/ajanlar-arasi-protokol-a2a.jpg"
  alt: "A2A: Ajanlar Birbiriyle Nasıl Konuşur? (MCP'nin Rakibi Değil, Tamamlayıcısı)"
---

Şirketinizin bir seyahat ajanı var, muhasebe departmanının bir harcama onay ajanı var ve ikisi birbirinden habersiz çalışıyor. Seyahat ajanının onay isteyebilmesi için ya muhasebenin iç mantığını öğrenmesi ya da birilerinin araya bir entegrasyon yazması gerekiyor. A2A tam olarak bu problemi standartlaştırıyor: bir ajanın başka bir ajanı bulup ona iş devredebilmesini — iç mantığını görmeden. Bu yazıda A2A'nın nasıl çalıştığını ve MCP ile ilişkisini net bir sınırla anlatıyorum.

## A2A ile MCP aynı katmanda değil

"A2A mı MCP mi?" sorusu yanlış kurulmuş bir soru; ikisi farklı ilişkileri tarifliyor. A2A'nın kendi konumlandırması da bunu açıkça söylüyor: **tamamlayıcı**.

|  | MCP | A2A |
| --- | --- | --- |
| Kimin kiminle | Ajan ↔ araç | Ajan ↔ ajan |
| Karşı taraf | Belirlenimci bir işlev (dosya oku, sorgu çalıştır) | Kendi başına akıl yürüten, kendi araçları olan bir sistem |
| Sözleşme | Girdi şeması → çıktı | Yetenek tanımı → görev, durum makinesiyle |
| Süre | Genellikle tek çağrı, kısa | Uzun süreli; dakikalar, saatler, insan onayı arası |
| Görünürlük | Araç ne yaptığını tamamen açar | Ajan iç mantığını, promptlarını ve araçlarını _açmaz_ |

> MCP bir ajanın elini uzatmasıdır; A2A bir ajanın başka birine iş devretmesidir.

Son satır en önemlisi. Bir ajanı MCP aracı olarak sarmalayabilirsiniz — teknik olarak mümkün — ama o zaman karşı tarafın uzun sürebileceğini, ara durum bildirebileceğini, insan onayı bekleyebileceğini ve kendi başına karar verebileceğini ifade edecek bir sözleşmeniz olmaz. A2A'nın var oluş nedeni budur.

Yönetişim tarafı da olgunlaştı: A2A **v1.0**'a ulaştı, Google tarafından başlatıldıktan sonra **Linux Foundation**'a devredildi ve bugün AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP ve ServiceNow'un yer aldığı bir teknik yönlendirme komitesi tarafından yürütülüyor. Lisans Apache-2.0.

## Agent Card: ajanın kartviziti

Keşif, A2A'nın ilk problemi: bir ajan başka bir ajanın _ne yapabildiğini_ nasıl öğrenir? Cevap, ajanın kendi alan adında yayınladığı makine tarafından okunabilir bir tanım — **Agent Card**.

```json
{
  "protocolVersion": "1.0",
  "name": "Harcama Onay Ajanı",
  "description": "Şirket harcama politikasına göre talepleri değerlendirir ve onaylar.",
  "url": "https://muhasebe.sirket.com/a2a",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "Örnek A.Ş.",
    "url": "https://sirket.com"
  },
  "version": "2.3.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "defaultInputModes":  ["text/plain", "application/json"],
  "defaultOutputModes": ["application/json"],
  "securitySchemes": {
    "kurumsal-oidc": {
      "type": "openIdConnect",
      "openIdConnectUrl": "https://kimlik.sirket.com/.well-known/openid-configuration"
    }
  },
  "security": [{ "kurumsal-oidc": [] }],
  "skills": [
    {
      "id": "harcama-onayi",
      "name": "Harcama onayı",
      "description": "Bir harcama talebini politikaya göre onaylar veya reddeder.",
      "tags": ["finans", "onay"],
      "examples": [
        "1.200 TL uçak bileti, İstanbul-Ankara, müşteri ziyareti",
        "3 gecelik otel konaklaması, 8.400 TL"
      ]
    }
  ]
}
```

Kartın en çok işe yarayan kısmı `skills`. Dikkat edin: bir yetenek, MCP aracı gibi katı bir JSON şeması değil; _doğal dille_ tarif edilmiş bir iş ve birkaç örnek. Bunun sebebi karşı tarafın da bir dil modeli olması. Çağıran ajan bu tanımı okur ve "benim elimdeki iş buna uyuyor mu?" kararını verir. Örnekler bu yüzden dekoratif değil, işlevseldir.

<div class="callout"><strong>İpucu:</strong> Yetenek açıklamasını iki soruya cevap verecek şekilde yazın: <em>ne yapar</em> ve <em>ne yapmaz</em>. En sık görülen entegrasyon hatası, çağıran ajanın kapsam dışı bir işi "yaklaşık uyuyor" diye devretmesi. "Yalnızca 50.000 TL altındaki talepleri değerlendirir; üstü insan onayına gider" cümlesi, bir şema alanının yapamayacağı işi yapar.</div>

## Görev yaşam döngüsü

A2A'nın çekirdek nesnesi **görev** (task). Bir görev, kimliği olan ve durumu zamanla değişen bir varlıktır — tek bir istek-yanıt değil. Bu, uzun süreli işlerin protokole yazılmış hâlidir.

```text
submitted ──> working ──┬──> completed      (bitti)
                        ├──> input-required (girdi bekliyor)
                        ├──> failed         (hata)
                        ├──> canceled       (iptal)
                        └──> rejected       (kabul edilmedi)

      input-required ──> working   (istemci yanıt verince)
```

`input-required` durumu en ayırt edici olanı. Uzaktaki ajan işin ortasında durabilir ve "bu talep politika sınırında, yöneticinin onayı gerekiyor" diyebilir. Çağıran ajan bu durumu kullanıcısına taşır, cevabı alır ve aynı göreve iletir. Görev kimliği baştan sona aynı kalır; yani iki taraf da işin neresinde olduklarını bilir.

Görev sonuçları iki biçimde döner: **mesajlar** (konuşma niteliğindeki ara çıktılar) ve **eserler** (artifact — üretilen kalıcı çıktı: bir rapor, bir dosya, yapılandırılmış bir sonuç). Uzun süren görevler için `pushNotifications` yeteneği var: istemci bir geri çağrı adresi verir, ajan durum değiştikçe oraya bildirir. Saatler süren bir görevde bağlantıyı açık tutmak zorunda kalmazsınız.

## Bir devir akışı, uçtan uca

Python ile, keşiften sonuca kadar. Kart okunuyor, uygun yetenek seçiliyor, görev gönderiliyor ve durum takip ediliyor.

```ts
import asyncio
import httpx

BASE = "https://muhasebe.sirket.com"

# gorev_getir / gorev_gonder_devam / kullaniciya_sor: aynı desende,
# sırasıyla tasks/get, message/send (taskId ile) ve kendi arayüzünüz.

async def kart_oku(client: httpx.AsyncClient) -> dict:
    # Agent Card iyi bilinen bir yolda yayınlanır.
    r = await client.get(f"{BASE}/.well-known/agent-card.json")
    r.raise_for_status()
    return r.json()

async def gorev_gonder(client, url, metin, token) -> dict:
    r = await client.post(
        url,
        headers={"Authorization": f"Bearer {token}"},
        json={
            "jsonrpc": "2.0",
            "id": 1,
            "method": "message/send",
            "params": {
                "message": {
                    "role": "user",
                    "messageId": "msg-1",
                    "parts": [{"kind": "text", "text": metin}],
                }
            },
        },
    )
    r.raise_for_status()
    return r.json()["result"]

async def devret(talep_metni: str, token: str) -> dict:
    async with httpx.AsyncClient(timeout=30) as client:
        kart = await kart_oku(client)

        # Yetenek seçimi: etiketle filtrele, kalanı modele bırak.
        uygun = [s for s in kart["skills"] if "onay" in s["tags"]]
        if not uygun:
            raise RuntimeError("Bu ajan onay yeteneği sunmuyor.")

        gorev = await gorev_gonder(client, kart["url"], talep_metni, token)

        while gorev["status"]["state"] in ("submitted", "working"):
            await asyncio.sleep(2)
            gorev = await gorev_getir(client, kart["url"], gorev["id"], token)

        if gorev["status"]["state"] == "input-required":
            # Kullanıcıya sor, cevabı AYNI göreve ilet.
            cevap = await kullaniciya_sor(gorev["status"]["message"])
            gorev = await gorev_gonder_devam(
                client, kart["url"], gorev["id"], cevap, token
            )

        return gorev
```

Bu döngüde dikkat edilecek üç şey var. Birincisi, **zaman aşımı çağıran tarafta olmalı** — uzaktaki ajanın ne kadar süreceğine dair sözleşmesi yok, dolayısıyla vazgeçme kararı sizindir. İkincisi, **yoklama yerine bildirim tercih edin**; `pushNotifications` destekleniyorsa yukarıdaki `while` döngüsü yerine bir geri çağrı uç noktası kullanın. Üçüncüsü, `rejected` durumunu `failed` ile karıştırmayın: birincisi "bu işi almıyorum" demektir ve tekrar denemek anlamsızdır; ikincisi geçici olabilir.

## Ajan ticareti: üstüne binen katman

A2A'nın 2026'da somutlaştığı yer ajanların birbirinden _satın alması_. Görev devri standartlaştığında sıradaki soru ödemenin nasıl yapılacağı oluyor ve bu boşluğu iki ayrı girişim dolduruyor.

-   **Agentic Commerce Protocol** — OpenAI ve Stripe'ın birlikte yayınladığı, Apache-2.0 lisanslı, REST ve MCP üzerinden çalışan bir protokol. ChatGPT içinde canlı olarak kullanılıyor; satıcı katalogunu ve sipariş akışını ajanın doğrudan tüketebileceği hâle getiriyor.
-   **AP2 (Agent Payments Protocol)** — Google'ın 16 Eylül 2025'te duyurduğu yaklaşım. Merkezinde _imzalı yetki belgeleri_ (Mandate) var: kullanıcının ajanına verdiği harcama yetkisi kriptografik olarak imzalanır ve zincir boyunca doğrulanabilir. Mastercard, PayPal, Amex, Adyen ve Etsy dahil 60'tan fazla ortakla duyuruldu.

Bu iki yaklaşımın ortak sorduğu soru şu: bir ajan sizin adınıza para harcadığında, harcama yetkisinin gerçekten sizden geldiğini kim ve nasıl kanıtlar? AP2'nin imzalı mandate yanıtı, ajan ticaretinin kimlik doğrulama katmanını çözmeye çalışıyor — çünkü "ajanım öyle dedi" bir ödeme itirazında hiçbir şey ifade etmez.

## Güvenlik: ASI07 ve sınırlar

OWASP'ın 2026 ajan risk listesinde **ASI07 — Güvensiz Ajanlar Arası İletişim** ayrı bir madde olarak yer alıyor ve A2A tam olarak bu yüzeyi açıyor. Dikkat edilecek üç nokta:

1.  **Uzaktaki ajan güvenilmez bir içerik kaynağıdır.** Döndürdüğü metin sizin ajanınızın bağlamına girer. Kendi sisteminizde bu metni _kullanıcı girdisi_ gibi işleyin: ondan türeyen değerlerle yan etkili araç çağırmayın.
2.  **Yetki devri zincirleme büyür.** A ajanı B'ye, B de C'ye iş devrederse, C'nin hangi yetkiyle çalıştığı hızla belirsizleşir. Agent Card'daki `securitySchemes` alanını ciddiye alın ve devredilen erişim token'ının kapsamını her sıçramada daraltın — genişletmeyin.
3.  **Kartın kendisi doğrulanmalıdır.** Agent Card bir alan adında yayınlanan JSON'dur; onu getiren kanal TLS ile korunmuyorsa ya da kart bir yönlendirmenin sonunda başka bir alan adından geliyorsa, konuştuğunuz ajanın kim olduğunu bilmiyorsunuz demektir.

Pratik bir kural: A2A ile bağlandığınız her ajanı, kendi sisteminizin dışında duran bir üçüncü taraf API'si gibi ele alın — çünkü öyledir. Aynı organizasyon içinde bile. Ajanlar arası güvenin varsayılan olarak yüksek olduğu mimariler, ilk zehirli görev sonucunda çöker.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>MCP ajan↔araç, A2A ajan↔ajan katmanıdır; A2A'nın kendi konumlandırması MCP'yi tamamlayıcı olduğu yönündedir.</li><li>A2A v1.0 Linux Foundation altında, AWS/Cisco/Google/IBM/Microsoft/Salesforce/SAP/ServiceNow'un yer aldığı bir komiteyle yürütülüyor; lisans Apache-2.0.</li><li>Keşif Agent Card ile, iş ise durum makinesi olan görevlerle yürür; <code>input-required</code> uzun süreli ve insan onaylı akışları protokole taşır.</li><li>Ajan ticareti üstüne binen katmandır: ACP (OpenAI + Stripe) ve imzalı Mandate temelli AP2 aynı yetki kanıtı sorununu çözmeye çalışır.</li></ul></div>

<div class="faq"><details><summary>A2A kullanmak için ajanımı yeniden yazmam gerekir mi?</summary><p>Hayır. A2A ajanınızın iç mimarisine hiçbir şey dayatmaz — hangi modeli kullandığınız, nasıl akıl yürüttüğünüz, hangi araçları çağırdığınız protokolün görüş alanı dışındadır. Eklemeniz gereken iki şey var: yayınlanan bir Agent Card ve görev yaşam döngüsünü konuşan bir HTTP uç noktası. Mevcut ajanınızı bu uç noktanın arkasına koymak çoğu durumda birkaç yüz satırlık bir sarmalayıcı işidir.</p></details><details><summary>Aynı sistemde hem MCP hem A2A kullanılır mı?</summary><p>Tipik kurulum tam olarak budur. Ajanınız kendi araçlarına MCP ile ulaşır — veritabanı, dosya sistemi, arama. Kendi başına halledemediği, başka bir ekibin veya şirketin sahip olduğu işi ise A2A ile devreder. İkisi aynı çağrı yığınında farklı katmanlarda durur; birini seçip diğerini elemek gerekmez.</p></details><details><summary>Uzaktaki ajan işi yanlış yaparsa sorumluluk kimde?</summary><p>Protokol bu soruyu çözmez, ama görünür kılar. Görev nesnesinin kimliği, durum geçişleri ve döndürdüğü eserler denetlenebilir bir iz bırakır — hangi talebin hangi ajana ne zaman devredildiği ve ne döndüğü kayıtlıdır. Sorumluluk paylaşımı sözleşmesel bir konudur; sizin mühendislik göreviniz, o sözleşmenin dayanacağı izi eksiksiz tutmak ve devredilen yetkiyi mümkün olan en dar kapsamda vermektir.</p></details></div>

---

Özetle: A2A, ajanların birbirini bulup iş devredebilmesi için eksik olan ortak dili sağlıyor — ve bunu MCP'nin yerine değil, onun bir katman üstünde yapıyor. Araç katmanının nasıl çalıştığını [MCP'ye giriş](/posts/mcp-model-baglam-protokolu/) yazısında, bu ajanların iç mimarisini [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/) yazısında, araçların modele nasıl tarif edildiğini ise [fonksiyon çağırma](/posts/fonksiyon-cagirma/) yazısında bulabilirsiniz.
