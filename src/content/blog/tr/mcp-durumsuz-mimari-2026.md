---
title: "MCP 2026: Protokol Neden Durumsuz Hâle Geldi ve Sunucunuz Ne Yapmalı?"
description: "MCP'nin 2026-07-28 revizyonu oturumları, Mcp-Session-Id başlığını ve initialize el sıkışmasını kaldırdı. MRTR, server/discover ve göç planı somut örneklerle."
publishDate: "2026-08-13T23:36:00+03:00"
lang: tr
category: "Araçlar"
tags: ["Araçlar", "Yapay Zeka"]
translation: "mcp-stateless-architecture-2026"
heroImage:
  src: "../../../assets/blog/covers/mcp-durumsuz-mimari-2026.jpg"
  alt: "MCP 2026: Protokol Neden Durumsuz Hâle Geldi ve Sunucunuz Ne Yapmalı?"
---

MCP sunucunuzu bir yük dengeleyicinin arkasına koydunuz ve istekler rastgele düğümlere dağıldığında her şey bozuldu. Çözüm olarak yapışkan oturum (sticky session) açtınız, sonra Redis'e oturum durumu yazdınız, sonra düğüm ölünce oturumun da öldüğünü fark ettiniz. 28 Temmuz 2026 revizyonu bu sorunu kökten kaldırdı: protokolün kendisi durumsuz hâle geldi. Bu yazıda tam olarak neyin değiştiğini, hangi alan adlarının yerine ne geldiğini ve sunucunuzda sırayla neyi değiştirmeniz gerektiğini anlatıyorum.

## Tek cümlede: ne değişti?

MCP'nin bir önceki revizyonu `2025-11-25` idi. `2026-07-28` revizyonu protokolün doğduğu günden bu yana yapılmış en büyük değişikliği getirdi ve tek bir cümleye sığıyor:

> MCP artık durumsuz bir protokol; sunucunuz iki istek arasında hiçbir şey hatırlamak zorunda değil.

Bunun pratik karşılığı şu: Streamable HTTP taşımasından protokol düzeyindeki oturumlar ve `Mcp-Session-Id` başlığı çıkarıldı; `initialize` / `notifications/initialized` el sıkışması tamamen kaldırıldı; `tools/list`, `resources/list` ve `prompts/list` artık bağlantıya göre farklılaşmıyor. Sunucunuz sıradan bir round-robin yük dengeleyicinin arkasında, yapışkan oturum olmadan yatayda ölçekleniyor.

Karşılıklar tablosu, göç sırasında en çok işinize yarayacak şey:

| 2025-11-25 | 2026-07-28 |
| --- | --- |
| `Mcp-Session-Id` başlığı | Kaldırıldı — sunucunun ürettiği açık tanıtıcılar (handle) sıradan araç parametresi olarak taşınır |
| `initialize` + `notifications/initialized` | Kaldırıldı — her istek `_meta` içinde sürüm ve yetenek taşır |
| Yetenek keşfi el sıkışmada | `server/discover` RPC'si (sunucular uygulamak _zorunda_) |
| Sunucudan istemciye istek (`sampling/createMessage`, `roots/list`, `elicitation/create`) | MRTR — `resultType: "input_required"` ile ara sonuç |
| HTTP GET akışı + `resources/subscribe` | Tek bir `subscriptions/listen` akışı |
| SSE yeniden bağlanma (`Last-Event-ID`) | Kaldırıldı — kopan istek yeni istek kimliğiyle baştan gönderilir |

## Oturumlar neden kaldırıldı?

Oturum tabanlı bir protokolde sunucu, bir istemciyle kurduğu bağlamı bellekte tutar. Bu, tek süreçli bir geliştirme sunucusunda zarif görünür; üretimde üç somut soruna yol açar. Birincisi **yapışkan yönlendirme**: yük dengeleyicinin aynı istemciyi aynı düğüme göndermesi gerekir, bu da otomatik ölçeklemeyi ve mavi-yeşil dağıtımı zorlaştırır. İkincisi **dayanıklılık**: düğüm yeniden başlarsa oturum kaybolur ve istemci baştan el sıkışmak zorunda kalır. Üçüncüsü **önbelleklenebilirlik**: liste uçları bağlantıya göre değişiyorsa, aradaki hiçbir ara katman onları önbelleğe alamaz.

Yeni tasarımda durum ortadan kalkmıyor — _protokolden çıkıp uygulama katmanına iniyor_. Çağrılar arasında durum tutması gereken bir sunucu, bunu kendi ürettiği açık bir tanıtıcı ile yapıyor ve bu tanıtıcıyı sıradan bir araç parametresi olarak alıp veriyor. Yani durumu siz tasarlıyorsunuz, kapsamını siz belirliyorsunuz ve nerede sakladığınızı siz seçiyorsunuz.

<div class="callout"><strong>İpucu:</strong> Tanıtıcıyı sunucu üretmeli, istemci değil. İstemcinin gönderdiği serbest metni tanıtıcı olarak kabul eden bir sunucu, kullanıcılar arası veri sızıntısına açık kapı bırakır. Tanıtıcıyı imzalayın veya sunucu tarafında bir kimliğe bağlayın.</div>

## server/discover ve \_meta: yeni el sıkışma

El sıkışma kalktı ama sürüm anlaşması kalmadı demek değil. Her istek kendi sürümünü ve yeteneklerini `_meta` içinde taşıyor. Alan adları uzun ve alan adı (namespace) önekli — kopyalarken dikkat edin:

```text
POST /mcp HTTP/1.1
Content-Type: application/json
Mcp-Method: tools/call
Mcp-Name: search_contracts

{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "search_contracts",
    "arguments": { "query": "fesih bildirimi" },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {},
      "io.modelcontextprotocol/clientInfo": { "name": "example-client", "version": "3.1.0" }
    }
  }
}
```

`Mcp-Method` ve `Mcp-Name` başlıkları artık Streamable HTTP POST isteklerinde zorunlu. Bunun neden önemli olduğunu bir ağ geçidi (gateway) yazan herkes hemen anlar: bir kenar katmanı, JSON gövdesini hiç ayrıştırmadan yönlendirme, oran sınırlama ve ölçümleme yapabilir.

Sürüm seçimini önden yapmak isteyen istemci ise `server/discover` çağırır — ve bu RPC'yi sunucular uygulamak **zorundadır**:

```text
--> {"jsonrpc":"2.0","id":1,"method":"server/discover"}

<-- {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "protocolVersions": ["2026-07-28", "2025-11-25"],
    "capabilities": { "tools": {}, "resources": {} },
    "_meta": {
      "io.modelcontextprotocol/serverInfo": { "name": "legal-search-mcp", "version": "1.4.0" }
    }
  }
}
```

Uyumsuz sürüm artık sessizce tolere edilmiyor: sunucu `UnsupportedProtocolVersionError` döner. Hata kodları da yeniden numaralandı — `-32000`…`-32019` aralığı uygulamalara bırakıldı, `-32020`…`-32099` spesifikasyona ayrıldı. Bu revizyonda tanıtılan kodlar buna göre taşındı: `HeaderMismatch` `-32020`, `MissingRequiredClientCapability` `-32021`, `UnsupportedProtocolVersion` `-32022`. Ayrıca kaynak bulunamadı hatası JSON-RPC ile hizalanmak için `-32002`'den `-32602`'ye çekildi.

## MRTR: sunucu artık istemciyi arayamıyor

Eski modelde sunucu, işi ortasında istemciye istek gönderebiliyordu: "bana bir model tamamlaması üret" (`sampling/createMessage`), "hangi dizinlere erişebiliyorum" (`roots/list`), "kullanıcıya şunu sor" (`elicitation/create`). Bu üç yol da kalktı. Yerine gelen desen **MRTR (Multi Round-Trip Requests, çok turlu istekler)**.

Mantığı HTTP'nin `401` + yeniden deneme akışına çok benziyor. Sunucu işi tamamlayamıyorsa _ara bir sonuç_ döner; istemci eksik bilgiyi toplar ve _aynı isteği_ bu bilgiyle yeniden gönderir:

```text
# 1. tur — sunucu kullanıcı onayına ihtiyaç duyuyor
<-- {
  "result": {
    "resultType": "input_required",
    "inputRequests": [{
      "id": "confirm-1",
      "method": "elicitation/create",
      "params": { "message": "Sözleşmeyi kalıcı olarak arşivleyeyim mi?" }
    }],
    "requestState": "arch-9f21"
  }
}

# 2. tur — istemci AYNI isteği inputResponses ile tekrar gönderir
--> {
  "method": "tools/call",
  "params": {
    "name": "archive_contract",
    "arguments": { "id": "SZL-4412" },
    "inputResponses": [{ "id": "confirm-1", "result": { "action": "accept" } }],
    "requestState": "arch-9f21"
  }
}
```

Buradaki kritik ayrıntı `requestState`. Sunucu durumsuz olduğu için, iki tur arasında neyi hatırlaması gerekiyorsa onu bu alana kendisi kodlar ve istemci geri taşır. İkinci ayrıntı: artık **her sonuç** zorunlu bir `resultType` alanı taşıyor — sıradan sonuçlar için `"complete"`, ara sonuçlar için `"input_required"`. Eski sürümdeki sunuculardan gelen ve bu alanı taşımayan sonuçlar istemci tarafından `"complete"` sayılmalı.

## Kaldırılanlar ve 12 aylık pencere

Bu revizyonla birlikte MCP resmi bir özellik yaşam döngüsü politikası benimsedi: Aktif, Kullanımdan Kaldırıldı (Deprecated) ve Kaldırıldı (Removed) durumları ile **en az on iki aylık** bir kullanımdan kaldırma penceresi. Yani aşağıdakiler bugün hâlâ çalışıyor, ama yeni uygulamalar bunlara dokunmamalı:

-   **Roots, Sampling ve Logging** kullanımdan kaldırıldı. Önerilen geçişler net: dizin/dosya bilgisini Roots yerine araç parametresi, kaynak URI'si veya sunucu yapılandırmasıyla verin; Sampling yerine doğrudan model sağlayıcısının API'sine bağlanın; Logging yerine stdio'da `stderr`'a yazın veya OpenTelemetry kullanın.
-   **HTTP+SSE taşıması** (zaten `2025-03-26`'dan beri eski) resmen Deprecated sınıfına alındı. Streamable HTTP'ye geçin.
-   **OAuth 2.0 Dinamik İstemci Kaydı (RFC 7591)** kullanımdan kaldırıldı; yerine _Client ID Metadata Documents_ geliyor. DCR yalnızca CIMD desteklemeyen yetkilendirme sunucularıyla geriye dönük uyumluluk için duruyor.

Kullanımdan kaldırılmak yerine _doğrudan silinenler_ ayrı bir liste: `ping`, `logging/setLevel`, `notifications/roots/list_changed`, SSE akış devamlılığı ve `Last-Event-ID` ile mesaj yeniden gönderimi, ve `2025-11-25`'te gelen `notifications/elicitation/complete`. Günlük seviyesi artık istek başına `_meta` içindeki `io.modelcontextprotocol/logLevel` ile veriliyor; sunucular bu alanı içermeyen isteklere `notifications/message` yayınlamamalı.

Bir de yer değiştirenler var: deneysel görev (task) desteği çekirdek protokolden çıkıp `io.modelcontextprotocol/tasks` uzantısına taşındı. Bloklayan `tasks/result` yerine `tasks/get` ile yoklama, istemciden sunucuya girdi için `tasks/update` geldi; `tasks/list` kaldırıldı.

## Göç planı: sunucunuzda sırayla ne değişmeli?

Sırayı bozmayın; her adım bir öncekine dayanıyor.

1.  **Oturum belleğini tanıtıcıya çevirin.** Sunucunuzda `sessions[session_id]` gibi bir sözlük varsa, oradaki her alanı ya isteğe taşıyın ya da sunucunun ürettiği bir tanıtıcının arkasına koyun.
2.  **`server/discover` uygulayın.** Zorunlu. Desteklediğiniz sürüm listesini ve yeteneklerinizi burada yayınlayın.
3.  **`_meta` okuyun, `_meta` yazın.** Gelen sürümü doğrulayın, uyumsuzsa `UnsupportedProtocolVersionError` dönün; her sonuca `io.modelcontextprotocol/serverInfo` ekleyin.
4.  **Her sonuca `resultType` koyun.** Bu alanı unutmak, göçte en sık yapılan hata.
5.  **Sunucudan istemciye çağrılarınızı MRTR'ye çevirin.** Onay ve kullanıcı sorusu akışlarını `input_required` + `requestState` ile yeniden yazın.
6.  **Liste sonuçlarına `ttlMs` ve `cacheScope` ekleyin.** Kullanıcıya özel araç listeleri için `"private"`, herkese aynı olan listeler için `"public"`. Ayrıca `tools/list` çıktısını _belirlenimci_ bir sırada dönün: sıra sabit olursa istemci tarafındaki prompt önbelleği tutar.
7.  **Yeniden bağlanma varsayımını silin.** Akış koparsa istek kaybolur; istemci yeni bir istek kimliğiyle baştan gönderir. Bu yüzden araçlarınızı _idempotent_ yazın.

Durumsuzluğun sessiz ödülü şu: bu yedi adımı tamamladığınızda sunucunuz herhangi bir HTTP servisi gibi davranır — sağlık yoklaması, otomatik ölçekleme, önbellek, ağ geçidi ölçümleme, hepsi bedava gelir.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li><code>2026-07-28</code> revizyonu oturumları, <code>Mcp-Session-Id</code> başlığını ve <code>initialize</code> el sıkışmasını kaldırdı; durum protokolden uygulamaya indi.</li><li>Sürüm ve yetenekler artık her istekte <code>_meta</code> ile taşınıyor; <code>server/discover</code> uygulamak zorunlu.</li><li>Sunucudan istemciye istek yok: onay ve girdi akışları MRTR ile <code>resultType: "input_required"</code> + <code>requestState</code> üzerinden yürüyor.</li><li>Roots, Sampling, Logging ve OAuth DCR en az 12 aylık pencereyle kullanımdan kaldırıldı; SSE devamlılığı doğrudan silindi.</li></ul></div>

<div class="faq"><details><summary>MCP sunucum eski sürümde kalırsa ne olur?</summary><p>Hemen bozulmaz. <code>server/discover</code> geriye dönük uyumluluk yoklaması olarak da kullanılabiliyor ve istemciler <code>resultType</code> alanı olmayan sonuçları <code>"complete"</code> saymak zorunda. Ama kullanımdan kaldırma penceresi en az on iki ay olarak tanımlandı; bu bir erteleme takvimi, kalıcı bir güvence değil.</p></details><details><summary>Durumsuz protokolde çok adımlı bir işi nasıl yürütürüm?</summary><p>İki yol var. Kısa akışlar için MRTR: sunucu <code>input_required</code> döner, gerekli durumu <code>requestState</code> içine kodlar, istemci aynı isteği yeniden gönderir. Uzun süren işler için <code>io.modelcontextprotocol/tasks</code> uzantısı: sunucu bir görev tanıtıcısı döner, istemci <code>tasks/get</code> ile yoklar, ara girdiyi <code>tasks/update</code> ile verir.</p></details><details><summary>Streamable HTTP mi stdio mu kullanmalıyım?</summary><p>Sunucu yerel makinede tek kullanıcı için çalışıyorsa stdio en basitidir. Ağ üzerinden birden çok istemciye hizmet veriyorsanız Streamable HTTP kullanın — durumsuzluğun bütün ölçekleme kazancı orada. HTTP+SSE taşıması artık Deprecated; yeni bir projede tercih etmeyin.</p></details></div>

---

Özetle: MCP, bir oturum protokolü olmaktan çıkıp sıradan bir istek-yanıt protokolüne dönüştü ve bu, sunucunuzu üretimde çalıştırmayı belirgin biçimde kolaylaştırdı. Protokolün temellerini hatırlamak isterseniz [MCP'ye giriş yazısı](/posts/mcp-model-baglam-protokolu/) hâlâ geçerli bir başlangıç; araçların modele nasıl tarif edildiğini [fonksiyon çağırma](/posts/fonksiyon-cagirma/) yazısında, bu araçları çağıran döngünün nasıl kurulduğunu ise [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/) yazısında bulabilirsiniz.
