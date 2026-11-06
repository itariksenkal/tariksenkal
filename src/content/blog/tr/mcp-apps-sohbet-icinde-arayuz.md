---
title: "MCP Apps: Sohbetin İçinde Çalışan Arayüzler"
description: "MCP Apps uzantısı araç sonuçlarını etkileşimli arayüze çeviriyor. ui:// kaynakları, _meta.ui alanı, korumalı iframe ve postMessage protokolü çalışan kodla."
publishDate: "2026-08-13T23:54:00+03:00"
lang: tr
category: "Ürün"
tags: ["Ürün", "Yapay Zeka"]
translation: "mcp-apps-generative-ui"
heroImage:
  src: "../../../assets/blog/bimg-14.jpg"
  alt: "MCP Apps: Sohbetin İçinde Çalışan Arayüzler"
---

Kullanıcı "önümüzdeki hafta müsait olduğum saatleri göster" diyor ve ajan geriye on dört satırlık bir metin listesi döküyor. Kullanıcı bir saat seçmek istiyor, ama seçebileceği bir şey yok — yazarak tarif etmesi gerekiyor. MCP Apps tam olarak bu boşluğu kapatıyor: bir araç, sonucunu düz metin yerine sohbetin içinde çalışan bir arayüz olarak döndürebiliyor. Bu yazıda mekanizmayı uçtan uca, çalışan kodla anlatıyorum.

## Neden metin yetmiyor?

Sohbet arayüzü her şey için doğru arayüz değil. Modelin metin üretmekte iyi olması, kullanıcının her şeyi metinle ifade etmesi gerektiği anlamına gelmiyor. Üç tür etkileşim metinde yapısal olarak kötü çalışır:

-   **Seçim:** On dört seçenek arasından birini işaret etmek. Metinde kullanıcı "üçüncüsü" der, model yanlış sayar, tur boşa gider.
-   **İnce ayar:** Bir aralığı, bir eşiği, bir rengi ayarlamak. "Biraz daha koyu" bir kaydırma çubuğunun yerini tutmaz.
-   **Yoğun veri:** Bir tablo, bir takvim, bir harita. Metne çevrildiğinde hem token yakar hem okunmaz.

> Metin iyi bir çıktı biçimidir; iyi bir girdi biçimi olmak zorunda değildir.

MCP Apps, MCP'nin resmî bir _uzantısı_ olarak bu sorunu çözüyor (spesifikasyon tarihi `2026-01-26`). Çekirdek protokole dokunmuyor; mevcut araç mekanizmasının üzerine, aracın sonucuna bir arayüz iliştirme imkânı ekliyor. Bugün Claude ve Claude Desktop, VS Code GitHub Copilot, Microsoft 365 Copilot, Goose, Postman, MCPJam ve Archestra.AI tarafından destekleniyor.

## ui:// kaynağı ve \_meta.ui bağlantısı

Mekanizma iki parçadan oluşuyor ve ikisi de MCP'nin zaten var olan yapıtaşlarını kullanıyor.

Birinci parça, **`ui://` şemasıyla yayınlanan bir kaynak**. Sunucunuz nasıl bir dosya veya veritabanı kaydı yayınlıyorsa, aynı şekilde bir HTML belgesi de yayınlar. Bu belge arayüzün kendisidir.

İkinci parça, **aracın `_meta.ui` alanı**. Araç tanımı, sonucunun hangi `ui://` kaynağıyla gösterileceğini `_meta.ui.resourceUri` ile bildirir. Bu bildirim araç _tanımında_ durur, sonucunda değil — ve bu ayrıntı önemlidir: istemci, araç daha çağrılmadan hangi arayüzün gerekeceğini bilir, dolayısıyla arayüzü **önden yükleyebilir**. Araç sonucu geldiğinde iframe zaten hazırdır; kullanıcı beyaz bir kutunun yüklenmesini izlemez.

```json
{
  "name": "musait_saatler",
  "description": "Verilen tarih aralığındaki müsait saatleri döndürür.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "baslangic": { "type": "string", "format": "date" },
      "bitis":     { "type": "string", "format": "date" }
    },
    "required": ["baslangic", "bitis"]
  },
  "_meta": {
    "ui": {
      "resourceUri": "ui://takvim/saat-secici",
      "permissions": [],
      "csp": {
        "connect-src": [],
        "img-src": ["https://cdn.sirket-ici.local"]
      }
    }
  }
}
```

`permissions` alanı arayüzün mikrofon veya kamera gibi hassas tarayıcı yeteneklerine erişip erişemeyeceğini belirtir; `csp` ise arayüzün hangi dış kaynaklara ulaşabileceğini. İkisinin de varsayılanı en kısıtlayıcı hâldir — istemediğiniz sürece arayüzünüz hiçbir yere bağlanamaz.

## Sunucu tarafı: bir aracı arayüze bağlamak

Python SDK'sıyla asgari bir sunucu. İki şey yayınlıyoruz: `ui://` kaynağı ve ona bağlı araç.

```text
from mcp.server.fastmcp import FastMCP
from datetime import date, timedelta

mcp = FastMCP("takvim")

SAAT_SECICI_HTML = """<!doctype html>
<meta charset="utf-8">
<style>
  body { font: 14px system-ui; margin: 0; padding: 12px; }
  button { display:block; width:100%; margin:4px 0; padding:8px; }
</style>
<div id="liste">Yükleniyor…</div>
<script type="module" src="ui://takvim/saat-secici.js"></script>
"""

@mcp.resource("ui://takvim/saat-secici", mime_type="text/html")
def saat_secici_arayuzu() -> str:
    return SAAT_SECICI_HTML

@mcp.tool(
    annotations={
        "_meta": {"ui": {"resourceUri": "ui://takvim/saat-secici"}}
    }
)
def musait_saatler(baslangic: str, bitis: str) -> dict:
    """Verilen tarih aralığındaki müsait saatleri döndürür."""
    gun = date.fromisoformat(baslangic)
    son = date.fromisoformat(bitis)
    slotlar = []
    while gun <= son:
        if gun.weekday() < 5:                     # hafta içi
            for saat in (10, 14, 16):
                slotlar.append(f"{gun.isoformat()}T{saat:02d}:00")
        gun += timedelta(days=1)
    return {"slotlar": slotlar}
```

Dikkat edilecek nokta: araç **hâlâ yapılandırılmış veri döndürüyor**. Arayüz eklemek, aracın sonucunu HTML'e çevirmek değildir. Model, sonucun veri hâlini görmeye devam eder — çünkü kullanıcı arayüzle etkileşmese bile modelin "üç müsait saat var" diyebilmesi gerekir. Arayüz veriye ek bir katmandır, onun yerine geçen bir şey değil.

<div class="callout"><strong>İpucu:</strong> Araç sonucunu iki kitleye birden yazın: modele yeterli, arayüze yeterli. Modelin okuyacağı kısmı kısa tutun (üç saat yeter, üç yüz değil), arayüzün ihtiyaç duyduğu tam listeyi ayrı bir alanda gönderin. Aksi hâlde zengin bir arayüz için ödediğiniz bedel, her turda modele okutulan devasa bir JSON olur.</div>

## İstemci tarafı: postMessage protokolü

Arayüz korumalı bir iframe içinde çalışır ve ana sayfaya doğrudan erişemez. Konağıyla (host) tek iletişim yolu `postMessage`'dır ve üzerinden konuşulan dil, MCP'nin kendisi gibi bir JSON-RPC lehçesidir. Yöntem adları iki gruba ayrılır: arayüze özgü olanlar `ui/` önekini taşır (`ui/initialize` gibi), araç çağırma gibi ortak olanlar ise MCP'nin bildiğiniz adlarını kullanır (`tools/call`).

Arayüz tarafındaki asgari istemci:

```ts
// ui://takvim/saat-secici.js
let sonrakiId = 1;
const bekleyen = new Map();

function cagir(method, params) {
  const id = sonrakiId++;
  return new Promise((resolve, reject) => {
    bekleyen.set(id, { resolve, reject });
    window.parent.postMessage(
      { jsonrpc: "2.0", id, method, params },
      "*"                       // konak origin'i doğrulamayı unutmayın
    );
  });
}

window.addEventListener("message", (ev) => {
  const msg = ev.data;
  if (!msg || msg.jsonrpc !== "2.0") return;

  // Yanıt mı?
  if (msg.id !== undefined && bekleyen.has(msg.id)) {
    const { resolve, reject } = bekleyen.get(msg.id);
    bekleyen.delete(msg.id);
    msg.error ? reject(msg.error) : resolve(msg.result);
  }
});

// 1) El sıkışma — konak, araç sonucunu bu adımda verir.
const init = await cagir("ui/initialize", {
  capabilities: { tools: {} }
});

// 2) Veriyi çiz.
const liste = document.getElementById("liste");
liste.textContent = "";
for (const slot of init.toolResult.slotlar) {
  const b = document.createElement("button");
  b.textContent = new Date(slot).toLocaleString("tr-TR");
  b.onclick = async () => {
    // 3) Kullanıcı seçti — aynı sunucudaki başka bir aracı çağır.
    await cagir("tools/call", {
      name: "randevu_olustur",
      arguments: { slot }
    });
    liste.textContent = "Randevu oluşturuldu.";
  };
  liste.appendChild(b);
}
```

Akışın anlamı şu: kullanıcı bir düğmeye bastığında bu, modele yazılan bir mesaj değil, doğrudan bir araç çağrısıdır. Model turu beklenmez, model yanlış anlamaz, token harcanmaz. Aynı zamanda tehlikelidir — bu yüzden bir sonraki bölüm var.

## Korumalı iframe ve izin modeli

Arayüzü çalıştıran iframe korumalıdır (sandboxed): ana belgenin DOM'una, çerezlerine ve depolamasına erişemez. Bu, sunucunun gönderdiği HTML'in konak uygulamayı ele geçirememesi için gereken asgari koşuldur. Ama _yeterli_ koşul değil, çünkü arayüzün elinde hâlâ bir yetenek var: `tools/call`.

Bu yüzden MCP Apps'i tasarlarken üç kuralı baştan koyun:

1.  **Arayüzden çağrılabilen araçları ayırın.** Kullanıcı etkileşimiyle tetiklenen araçlar, ajanın kendi başına çağırdığı araçlardan farklı bir kümede olmalı. "Randevu oluştur" arayüzden çağrılabilir; "tüm randevuları sil" olmamalı.
2.  **Origin doğrulayın.** Yukarıdaki örnekte `postMessage` hedefi `"*"` — bu üretimde yanlış. Konağın origin'ini `ui/initialize` yanıtından öğrenin ve sonraki tüm mesajlarda onu hedefleyin; gelen mesajlarda da `ev.origin`'i kontrol edin.
3.  **İzinleri talep etmeyin, gerekçelendirin.** `permissions` içinde mikrofon istiyorsanız, kullanıcının bunu neden onaylayacağını arayüzün kendisinde açıklayın. İstemcilerin bu izinleri kullanıcıya sorması beklenir; gerekçesiz istekler reddedilir.

Bir de gözden kaçan bir tehdit modeli var: arayüzün HTML'i sunucudan gelir ve sunucu güvenilmez olabilir. Üçüncü taraf bir MCP sunucusu kurduğunuzda, o sunucunun sohbetinizin içinde çalışan bir arayüz göstermesine de izin vermiş olursunuz. Korumalı iframe bunu zararsız kılar ama _ikna edici_ olmasını engellemez — sahte bir giriş formu çizen bir arayüz, iframe içinde de sahte giriş formudur. Sunucu kaynağına, aracın yetkilerine bakarken gösterdiğiniz özeni gösterin.

## Ne zaman arayüz, ne zaman metin?

Her aracı arayüze bağlamak cazip ama yanlış. İşe yarayan ayrım şu:

1.  **Kullanıcı bir şey seçecek veya ayarlayacaksa → arayüz.** Seçim ve ayarlama metinle yapıldığında tur sayısı artar ve yanlış anlaşılma olasılığı yükselir.
2.  **Sonuç yoğun ve yapısalsa → arayüz.** Takvim, tablo, harita, grafik. Bunları metne çevirmek hem pahalıdır hem kayıplıdır.
3.  **Sonuç bir cevapsa → metin.** "Fatura tutarı 4.812 TL" bir arayüz gerektirmez. Arayüz eklemek burada yalnızca gecikme ekler.
4.  **Sonuç modelin akıl yürütmesine girecekse → mutlaka metin de.** Arayüz kullanıcıya, veri modele. Yalnızca arayüz döndüren bir araç, modeli kör bırakır ve bir sonraki turda "az önce ne gösterdim" diye soramaz.

Son madde ürün açısından en önemlisi. MCP Apps'in cazibesi "sohbeti uygulamaya çevirmek" gibi görünüyor ama asıl kazanç bu değil. Asıl kazanç, konuşmayı kesmeden araya bir etkileşim sıkıştırabilmek — kullanıcı seçimini yapıyor, sohbet kaldığı yerden devam ediyor ve model bütün akışı görmeye devam ediyor.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>MCP Apps resmî bir uzantıdır (<code>2026-01-26</code>); çekirdek protokolü değiştirmez, araç sonucuna arayüz iliştirir.</li><li>Araç tanımındaki <code>_meta.ui.resourceUri</code> bir <code>ui://</code> kaynağını gösterir; konak bunu araç çağrılmadan önce yükler.</li><li>Arayüz korumalı bir iframe'de çalışır ve konakla <code>postMessage</code> üzerinden JSON-RPC konuşur: <code>ui/initialize</code> gibi <code>ui/</code> önekli yöntemler artı <code>tools/call</code>.</li><li>Araç sonucu hem modele hem arayüze yazılmalıdır; yalnızca arayüz döndürmek modeli sonraki turlarda kör bırakır.</li></ul></div>

<div class="faq"><details><summary>MCP Apps ile normal bir web uygulaması arasındaki fark ne?</summary><p>Yaşam döngüsü ve bağlam. Bir MCP Apps arayüzü kendi başına var olmaz; bir araç çağrısının sonucu olarak doğar, o çağrının verisiyle başlar ve sohbetin içinde yaşar. Ayrıca kendi kimlik doğrulaması, yönlendirmesi veya durum yönetimi yoktur — bunların hepsi zaten MCP sunucusunda ve konak uygulamadadır. Doğru zihinsel model "sohbete gömülü mini uygulama" değil, "araç sonucunun etkileşimli gösterimi".</p></details><details><summary>Arayüz, aracı çağıran modelin bilgisi dışında iş yapabilir mi?</summary><p>Evet — arayüzden yapılan <code>tools/call</code> çağrıları model turu beklemez. Bu bir özellik, ama yetki tasarımını zorunlu kılar. Arayüzden çağrılabilen araçları ayrı bir kümede tutun, yan etkili ve geri alınamaz işlemleri o kümenin dışında bırakın, ve konak uygulamanın kullanıcı onayı akışına güvenin.</p></details><details><summary>Destekleyen istemci yoksa ne olur?</summary><p>Araç normal şekilde çalışmaya devam eder. <code>_meta.ui</code> alanını tanımayan bir istemci onu yok sayar ve yapılandırılmış sonucu metin olarak gösterir. Bu yüzden aracınız her koşulda anlamlı bir veri sonucu döndürmelidir; arayüz bir iyileştirme katmanıdır, çalışmanın önkoşulu değil.</p></details></div>

---

Özetle: MCP Apps, sohbet arayüzünün en zayıf olduğu yerde — seçim ve ayarlama anında — araya küçük bir arayüz koyup konuşmayı bölmeden devam etmeyi sağlıyor. Bu kararların ürün tarafını [yapay zeka ürün deneyimi](/posts/yapay-zeka-urun-ux/) yazısında, protokolün temellerini [MCP'ye giriş](/posts/mcp-model-baglam-protokolu/) yazısında, araçların modele nasıl tarif edildiğini ise [fonksiyon çağırma](/posts/fonksiyon-cagirma/) yazısında bulabilirsiniz.
