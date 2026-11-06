# tariksenkal.com — İsmail Tarık Şenkal · Kişisel Blog & Portföy

Modern, açık/koyu temalı, tek sayfa + blog yapısında **statik** bir kişisel site.
İsmail Tarık Şenkal'ı (Hatson Teknoloji A.Ş. kurucu ortağı) tanıtmak ve yapay zeka /
Türkçe NLP üzerine yazılar yayımlamak için tasarlandı.

> **Slogan:** *Veriden zekâya, araştırmadan ürüne.*

---

## ⚡ Hızlı başlangıç

Kurulum gerektirmez — saf HTML/CSS/JS. Yerelde görmek için:

```bash
# Klasörün içinde
python -m http.server 8000
# Tarayıcı: http://localhost:8000
```

Ya da `index.html` dosyasına çift tıklayın. (Bağlantıların düzgün çalışması için yerel sunucu önerilir.)

---

## 📁 Yapı

```
tariksenkal/
├── index.html                 # Ana sayfa (hero, kimdir, ne yapıyor, uzmanlık, yazılar, yolculuk, iletişim)
├── blog.html                  # Tüm yazıların listesi
├── 404.html                   # Özel hata sayfası
├── posts/                     # Blog yazıları
│   ├── tarik-senkal-kimdir.html
│   ├── hatsontech-nedir.html
│   ├── buyuk-dil-modeli-nedir.html
│   ├── rag-nedir.html
│   └── turkce-yapay-zeka.html
├── css/style.css              # Tüm stiller + tema sistemi
├── js/main.js                 # Tema, mobil menü, scroll-reveal, okuma çubuğu
├── CNAME                      # tariksenkal.com (GitHub Pages için)
├── robots.txt · sitemap.xml   # SEO
└── README.md
```

---

## 🎨 Tasarım

- **Tema:** Açık / koyu mod (sağ üstteki ☀️/🌙 düğmesi). Tercih `localStorage`'a kaydedilir, sistem tercihini de algılar.
- **Renkler:** Site yeşili (`#7CB342`) ana aksan. Tüm renkler `css/style.css` içindeki `:root` ve `[data-theme="dark"]` bloklarında.
- **Tipografi:** Başlıklar **Sora**, gövde **Inter**, makale metni editöryel his için **Newsreader** (serif).
- **Hareket:** Scroll ile beliren `reveal` animasyonları, okuma ilerleme çubuğu, yumuşak geçişler. `prefers-reduced-motion` desteklenir.

Renkleri değiştirmek için:

```css
:root {
  --brand-600: #7CB342;   /* ana yeşil */
  --accent:    #1976D2;   /* ikincil aksan */
}
```

---

## ✍️ İçeriği düzenleme

- **Yazı metinleri:** Doğrudan `posts/*.html` içindeki `<div class="prose">…</div>` bloklarını düzenleyin.
- **Yeni yazı eklemek:** Mevcut bir yazıyı kopyalayın, içeriği değiştirin; ardından kartını hem `blog.html` hem de
  `index.html` "Yazılar" bölümüne ekleyin ve `sitemap.xml`'e satır ekleyin.
- **Menü / footer:** Her sayfada tekrarlanır (statik site). Bir bağlantıyı değiştirirken tüm sayfalarda güncelleyin.
- **Kart görseli:** Yazı kapakları CSS gradyanıdır (`thumb`, `article-hero` + `v2…v5` varyantları). İsterseniz `<img>` ile değiştirin.

### 📸 Profil fotoğrafı eklemek
Ana sayfadaki hero kartında `TŞ` baş harfleri yer alıyor. Gerçek fotoğraf için `index.html` içindeki
`<div class="portrait">…</div>` bloğundaki `.ph-ring` ve başlık kısmını bir `<img>` ile değiştirebilirsiniz.
Aynı şekilde makalelerdeki `.ava` (yazar avatarı) baş harf yerine küçük bir resimle değiştirilebilir.

---

## ⚠️ İçerik notu (önemli)

Bu sitedeki **biyografik anlatım örnek/şablon niteliğindedir** ve doğrulanmış kamu kayıtlarına dayanan kısımlarla
(HatsonTech kurucu ortaklığı, 2024 kuruluşu, ODTÜ Teknokent, NLP/LLM odağı) birlikte yazılmıştır.
Eğitim geçmişi, tarihler ve kişisel detayları yayına almadan önce **gözden geçirip kişiselleştirin**. Özellikle:

- `posts/tarik-senkal-kimdir.html` — eğitim/kariyer ayrıntıları
- `index.html` → "Yolculuk" zaman çizelgesi
- Sosyal bağlantılar: şu an **HatsonTech kurumsal** hesaplarına bağlı (LinkedIn/X/GitHub).
  Varsa **kişisel profillerinizle** değiştirin.

---

## 🚀 Yayına alma (GitHub Pages örneği)

```bash
git init
git add .
git commit -m "tariksenkal.com kişisel blog"
git branch -M main
git remote add origin https://github.com/<kullanici>/tariksenkal.git
git push -u origin main
```

Ardından repo → **Settings → Pages → Branch: main / root**. `CNAME` dosyası `tariksenkal.com`
için ayarlı; alan adı DNS kayıtlarını (A / CNAME) GitHub Pages'e yönlendirmeniz yeterli.
Netlify veya Vercel'e de klasörü sürükleyip bırakarak yayınlayabilirsiniz.

---

## ✅ Özellikler

- Tamamen responsive (mobil/tablet/masaüstü)
- Açık + koyu tema
- SEO: meta etiketler, Open Graph, `Person`/`Article` yapısal verisi (JSON-LD), sitemap, robots
- Erişilebilirlik: anlamsal HTML, klavye ile gezinme, `aria-label`'lar
- Bağımlılık yok (Bootstrap/jQuery gerektirmez) — yalnızca Google Fonts CDN

---

© 2024–2026 İsmail Tarık Şenkal · Hatson Teknoloji A.Ş. · Ankara, ODTÜ Teknokent 🌿
