---
title: "MCP (Model Context Protocol): Yapay Zekâ Araçları İçin Ortak Dil"
description: "MCP, modellerin araçlara ve veri kaynaklarına standart bir arayüzle bağlanmasını sağlar. Sunucu-istemci modeli, N-kere-M problemi, güvenlik sınırları ve pratik kullanım."
publishDate: "2026-08-09T23:30:00+03:00"
lang: tr
category: "Araçlar"
tags: ["Araçlar", "Yapay Zeka"]
translation: "model-context-protocol"
heroImage:
  src: "../../../assets/blog/bimg-16.jpg"
  alt: "MCP (Model Context Protocol): Yapay Zekâ Araçları İçin Ortak Dil"
---

Bir modeli kendi verinize bağlamak istediğinizde her seferinde aynı işi yaparsınız: bir bağlayıcı yazarsınız. Başka bir model kullanmaya karar verdiğinizde, bağlayıcıyı yeniden yazarsınız. **Model Context Protocol**, bu tekrarı ortadan kaldırmayı hedefleyen ortak bir arayüzdür.

<div class="callout"><strong>Güncelleme:</strong> Protokolün <code>2026-07-28</code> revizyonu oturumları, <code>Mcp-Session-Id</code> başlığını ve <code>initialize</code> el sıkışmasını kaldırdı. Bu yazıdaki kavramlar geçerliliğini koruyor; taşıma katmanındaki değişiklikler için <a href="/posts/mcp-durumsuz-mimari-2026/">MCP 2026: protokol neden durumsuz hâle geldi</a> yazısını okuyun.</div>

## Çözdüğü problem

Buna N-kere-M problemi denir: N farklı model ve M farklı veri kaynağınız varsa, ihtiyacınız olan bağlayıcı sayısı ikisinin çarpımıdır. Her yeni araç, her modele ayrı ayrı bağlanmalıdır. Ortak bir protokol bu çarpımı toplamaya indirir: her kaynak bir kez sunucu olarak yazılır, her model bir kez istemci olur.

## Nasıl çalışır

Mimari istemci-sunucu ayrımına dayanır. Bir **MCP sunucusu** belirli bir yeteneği dışa açar — bir dosya sistemi, bir veritabanı, bir API. Modeli barındıran uygulama ise **istemci** olarak bu sunucuya bağlanır, hangi yeteneklerin mevcut olduğunu keşfeder ve gerektiğinde çağırır.

Kritik nokta keşfedilebilirliktir: istemci, sunucunun hangi araçları sunduğunu ve hangi parametreleri beklediğini çalışma zamanında öğrenir. Böylece yeni bir yetenek eklemek istemci kodunu değiştirmeyi gerektirmez.

<div class="callout"><strong>Benzetme:</strong> Her cihaz için ayrı kablo taşımak yerine tek bir bağlantı standardı kullanmak. Cihaz da kablo da değişebilir; arayüz sabit kalır.</div>

## Ne sunar

-   **Araçlar:** Modelin çağırabileceği eylemler — sorgu çalıştırmak, dosya okumak, kayıt oluşturmak.
-   **Kaynaklar:** Modelin okuyabileceği veri parçaları — belgeler, şemalar, yapılandırma.
-   **Şablonlar:** Yeniden kullanılabilir hazır talimatlar.

## Güvenlik sınırları

Bir modele araç vermek, ona yetki vermektir. MCP bağlamında üç kural pratikte belirleyicidir: sunucular yalnızca gerçekten gereken en dar yetkiyle çalışmalı, geri alınamaz eylemler onay gerektirmeli ve araç çıktısı asla güvenilir talimat gibi işlenmemelidir.

Bu son madde önemlidir: dışarıdan gelen bir belge, modele talimat gibi görünen metin taşıyabilir. Bu, [dolaylı prompt injection](/posts/prompt-injection-guvenlik/) saldırısının tam olarak yüzeyidir.

## Ne zaman kullanmalı

| Durum | MCP |
| --- | --- |
| Tek model, tek araç | Fazladan katman |
| Birden çok kaynak, tek uygulama | Düzen kazandırır |
| Araçları başka ekiplerle paylaşma | Asıl kazanç |
| Model değiştirme ihtimali | Bağımlılığı azaltır |

## Sık sorulanlar

<div class="faq"><details><summary>Fonksiyon çağırmadan farkı ne?</summary><p>Fonksiyon çağırma, modelin bir aracı nasıl <em>talep ettiğidir</em>. MCP ise o aracın nasıl <em>tanımlandığı ve sunulduğudur</em>. Birbirinin alternatifi değil, tamamlayıcısıdır.</p></details><details><summary>Performans etkisi var mı?</summary><p>Ek bir ağ atlaması gelir. Çoğu senaryoda ihmal edilebilir, ancak çok yüksek frekanslı çağrılarda doğrudan entegrasyon daha hızlıdır.</p></details><details><summary>Kaç araç tanımlamalıyım?</summary><p>Az. Onlarca araç tanımı bağlam penceresini doldurur ve model seçimde zorlanır. Yalnızca o görev için gerekli araçları açın.</p></details></div>

---

MCP, ajan ekosisteminde tekrar eden entegrasyon işini azaltan pratik bir standarttır. Devamı için [fonksiyon çağırma](/posts/fonksiyon-cagirma/) ve [otonom ajan mimarileri](/posts/otonom-ajan-mimarileri/) yazılarına bakabilirsiniz.
