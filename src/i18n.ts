import { getCollection, type CollectionEntry } from 'astro:content'

export type Lang = 'tr' | 'en'
export const LANGS: Lang[] = ['tr', 'en']
export type Post = CollectionEntry<'blog'>

export const ui = {
  tr: {
    htmlLang: 'tr',
    ogLocale: 'tr_TR',
    dateLocale: 'tr-TR',
    nav: { home: 'Ana sayfa', blog: 'Yazılar', about: 'Hakkımda', tags: 'Etiketler', search: 'Ara' },
    switchTo: 'English',
    switchShort: 'EN',
    theme: { system: 'Sistem teması', light: 'Açık tema', dark: 'Koyu tema', set: 'Tema' },
    menu: 'Menü',
    back: 'Geri',
    readMore: 'Devamını oku',
    allPosts: 'Tüm yazılar',
    latest: 'Son yazılar',
    featured: 'Öne çıkanlar',
    minRead: (n: number) => `${n} dk okuma`,
    minShort: (n: number) => `${n} dk`,
    toc: 'İçindekiler',
    updated: 'Güncellendi',
    published: 'Yayın',
    prev: 'Önceki yazı',
    next: 'Sonraki yazı',
    related: 'Benzer yazılar',
    readIn: 'Bu yazıyı İngilizce oku',
    share: 'Paylaş',
    copyLink: 'Bağlantıyı kopyala',
    copied: 'Bağlantı kopyalandı',
    all: 'Tümü',
    postsCount: (n: number) => `${n} yazı`,
    tagTitle: (t: string) => `“${t}” etiketli yazılar`,
    tagsTitle: 'Etiketler',
    tagsDesc: 'Yazıların konu başlıkları',
    searchTitle: 'Ara',
    searchDesc: 'Bütün yazılarda başlık ve içerik araması',
    searchHint: 'Bir kelime ya da ifade yazın.',
    blogTitle: 'Yazılar',
    blogDesc:
      'Yapay zeka, büyük dil modelleri, RAG, ajanlar ve yapay zekayı üretime taşımak üzerine sade, araştırmaya dayalı yazılar.',
    filterBy: 'Konuya göre filtrele',
    privacy: 'Gizlilik ve çerezler',
    rights: 'Tüm hakları saklıdır.',
    notFoundTitle: 'Sayfa bulunamadı',
    notFoundText: 'Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.',
    goHome: 'Ana sayfaya dön',
    skip: 'İçeriğe geç',
    rss: 'RSS',
    writtenBy: 'Yazar',
    email: 'E-posta'
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    dateLocale: 'en-GB',
    nav: { home: 'Home', blog: 'Writing', about: 'About', tags: 'Tags', search: 'Search' },
    switchTo: 'Türkçe',
    switchShort: 'TR',
    theme: { system: 'System theme', light: 'Light theme', dark: 'Dark theme', set: 'Theme' },
    menu: 'Menu',
    back: 'Back',
    readMore: 'Read more',
    allPosts: 'All posts',
    latest: 'Latest writing',
    featured: 'Featured',
    minRead: (n: number) => `${n} min read`,
    minShort: (n: number) => `${n} min`,
    toc: 'Contents',
    updated: 'Updated',
    published: 'Published',
    prev: 'Previous post',
    next: 'Next post',
    related: 'Related posts',
    readIn: 'Read this post in Turkish',
    share: 'Share',
    copyLink: 'Copy link',
    copied: 'Link copied',
    all: 'All',
    postsCount: (n: number) => `${n} posts`,
    tagTitle: (t: string) => `Posts tagged “${t}”`,
    tagsTitle: 'Tags',
    tagsDesc: 'Topics across all posts',
    searchTitle: 'Search',
    searchDesc: 'Search titles and content across every post',
    searchHint: 'Type a word or phrase.',
    blogTitle: 'Writing',
    blogDesc:
      'Plain, research-based writing on artificial intelligence, large language models, RAG, agents and taking AI to production.',
    filterBy: 'Filter by topic',
    privacy: 'Privacy & cookies',
    rights: 'All rights reserved.',
    notFoundTitle: 'Page not found',
    notFoundText: 'The page you are looking for may have moved or never existed.',
    goHome: 'Back to home',
    skip: 'Skip to content',
    rss: 'RSS',
    writtenBy: 'Author',
    email: 'Email'
  }
} as const

export function t(lang: Lang) {
  return ui[lang]
}

export function langFromUrl(url: URL): Lang {
  return url.pathname.startsWith('/en/') || url.pathname === '/en' ? 'en' : 'tr'
}

const prefix = (lang: Lang) => (lang === 'en' ? '/en' : '')

export const paths = {
  home: (lang: Lang) => `${prefix(lang)}/`,
  blog: (lang: Lang) => `${prefix(lang)}/blog/`,
  about: (lang: Lang) => `${prefix(lang)}/#about`,
  tags: (lang: Lang) => (lang === 'en' ? '/en/tags/' : '/etiketler/'),
  tag: (lang: Lang, tag: string) => `${paths.tags(lang)}${slugify(tag)}/`,
  search: (lang: Lang) => (lang === 'en' ? '/en/search/' : '/ara/'),
  privacy: (lang: Lang) => (lang === 'en' ? '/en/privacy/' : '/gizlilik/'),
  rss: (lang: Lang) => `${prefix(lang)}/rss.xml`,
  post: (lang: Lang, slug: string) => `${prefix(lang)}/posts/${slug}/`
}

export const postSlug = (post: Post) => post.id.replace(/^(tr|en)\//, '')
export const postUrl = (post: Post) => paths.post(post.data.lang, postSlug(post))

/** Turkish-aware slug: "Yapay Zeka" -> "yapay-zeka", "Güvenlik" -> "guvenlik" */
export function slugify(s: string) {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u' }
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/i̇/g, 'i')
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.lang === lang && (import.meta.env.PROD ? !data.draft : true)
  )
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
}

/** Reading time from raw markdown (≈ 200 wpm, never below 1) */
export function readingMinutes(body = '') {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(date: Date, lang: Lang, opts?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString(ui[lang].dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
    ...opts
  })
}

/** Unique tags with counts, most used first */
export function tagCounts(posts: Post[]): [string, number][] {
  const m = new Map<string, number>()
  for (const p of posts) for (const tag of p.data.tags) m.set(tag, (m.get(tag) ?? 0) + 1)
  return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'))
}

/** Categories with counts, most used first */
export function categoryCounts(posts: Post[]): [string, number][] {
  const m = new Map<string, number>()
  for (const p of posts) if (p.data.category) m.set(p.data.category, (m.get(p.data.category) ?? 0) + 1)
  return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'))
}

/** Posts sharing the most tags / category with the given one */
export function relatedPosts(post: Post, all: Post[], n = 3) {
  const tags = new Set(post.data.tags)
  // Rare tags say more about a post than ones used everywhere (e.g. "Yapay Zeka")
  const df = new Map<string, number>()
  for (const p of all) for (const tag of p.data.tags) df.set(tag, (df.get(tag) ?? 0) + 1)
  const weight = (tag: string) => Math.log((all.length + 1) / (df.get(tag) ?? 1))
  const words = (s: string) => new Set(s.toLocaleLowerCase('tr-TR').match(/[\p{L}\d]{4,}/gu) ?? [])
  const titleWords = words(post.data.title)
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      p,
      score:
        p.data.tags.filter((x) => tags.has(x)).reduce((acc, x) => acc + weight(x), 0) +
        (p.data.category && p.data.category === post.data.category ? 1.5 : 0) +
        [...words(p.data.title)].filter((w) => titleWords.has(w)).length * 0.8
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.publishDate.valueOf() - a.p.data.publishDate.valueOf())
    .slice(0, n)
    .map((x) => x.p)
}
