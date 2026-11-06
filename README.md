# tariksenkal.com

İsmail Tarık Şenkal'ın kişisel sitesi ve blogu. [Astro](https://astro.build) ile yazılmıştır ve
[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) (Apache-2.0) temel alınarak
iki dilli (TR/EN) olacak şekilde genişletilmiştir.

## Çalıştırma

```bash
npm install
npm run dev       # http://localhost:4321 (arama yalnızca derlenmiş sitede çalışır)
npm run build     # tip kontrolü + statik çıktı (dist/)
npm run preview   # derlenmiş siteyi yerelde aç
```

## Nerede ne var?

| Ne | Dosya |
|---|---|
| Kişisel bilgiler, biyografi, zaman çizelgesi, sosyal linkler (TR+EN) | `src/data/profile.ts` |
| Arayüz metinleri ve URL yapısı | `src/i18n.ts` |
| Yazılar | `src/content/blog/tr/*.md`, `src/content/blog/en/*.md` |
| Yazı kapak görselleri | `src/assets/blog/` |
| Gizlilik sayfası | `src/content/pages/{tr,en}/privacy.md` |
| Profil fotoğrafı | `src/assets/avatar.jpeg` (kare), `src/assets/portrait.jpeg` |
| Renk, kart ve yazı içi blok stilleri | `src/assets/styles/site.css` |
| Sayfa bileşenleri | `src/components/site/` |

## Yeni yazı eklemek

`src/content/blog/tr/yeni-yazi.md` oluşturun (dosya adı URL olur: `/posts/yeni-yazi/`):

```md
---
title: "Başlık"
description: "Bir-iki cümlelik özet (arama sonuçlarında görünür)."
publishDate: "2026-11-20T10:00:00+03:00"
lang: tr
category: "RAG"
tags: ["RAG", "Yapay Zeka"]
translation: "new-post"        # varsa İngilizce karşılığının dosya adı
heroImage:
  src: "../../../assets/blog/kapak.jpg"
  alt: "Görsel açıklaması"
---

Yazı metni (Markdown)...
```

İngilizce karşılığı `src/content/blog/en/new-post.md` olur ve `translation` alanında Türkçe dosya adını gösterir.
Yazı içinde şu hazır bloklar kullanılabilir:

```html
<div class="callout"><strong>İpucu:</strong> ...</div>
<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>...</li></ul></div>
<div class="faq"><details><summary>Soru?</summary><p>Cevap.</p></details></div>
```

## URL'ler

| Sayfa | TR | EN |
|---|---|---|
| Ana sayfa | `/` | `/en/` |
| Yazılar | `/blog/` | `/en/blog/` |
| Yazı | `/posts/<slug>/` | `/en/posts/<slug>/` |
| Etiketler | `/etiketler/` | `/en/tags/` |
| Arama | `/ara/` | `/en/search/` |
| Gizlilik | `/gizlilik/` | `/en/privacy/` |
| RSS | `/rss.xml` | `/en/rss.xml` |

Eski statik sitedeki tüm URL'ler korunmuştur.

## Günlük yazı yayını

Zamanlanmış yazılar `queue/tr/` ve `queue/en/` klasörlerinde bekler. Her yazının `publishDate` alanı yayın saatidir
(TR ve EN eşi aynı tarihi taşır). Kapak görselleri baştan `src/assets/blog/covers/` içindedir.

`.github/workflows/publish-scheduled.yml` her sabah **09:17 (İstanbul)** çalışır:
`scripts/publish-due.mjs` vakti gelen dosyaları `src/content/blog/` altına taşır, site derlenerek kontrol edilir,
değişiklik commit + push edilir. Push'tan sonra Cloudflare siteyi yeniden yayınlar.

```bash
node scripts/publish-due.mjs --list     # kuyruğu ve yayın tarihlerini göster
node scripts/publish-due.mjs            # vakti gelenleri şimdi yayınla
python scripts/make-covers.py           # eksik kapak görsellerini üret (Pillow gerekir)
```

Yeni yazı eklemek için dosyayı `queue/<dil>/` içine koyup `publishDate` verin, `make-covers.py` ile kapağını üretip commit'leyin.
Hemen yayınlamak için doğrudan `src/content/blog/<dil>/` içine koymanız yeterli.
GitHub'da **Actions → Publish scheduled post → Run workflow** ile iş akışı elle de tetiklenebilir.

## Yayın (Cloudflare)

Site, HatsonTech ile aynı şekilde **Cloudflare Workers + Git entegrasyonu (Workers Builds)** ile yayınlanır.
`wrangler.jsonc` yalnızca statik `dist/` klasörünü sunar (Worker kodu yok).

| Ayar | Değer |
| --- | --- |
| Repo | `itariksenkal/tariksenkal` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node sürümü | `NODE_VERSION` = `24` |
| Alan adı | `tariksenkal.com` (+ `www.tariksenkal.com` → 301 yönlendirme) |

`main`'e gelen her push (günlük yayın commit'leri dahil) otomatik olarak yayına çıkar.
