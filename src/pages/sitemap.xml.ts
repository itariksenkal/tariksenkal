// Generated on every build from the content collections, so posts moved out of queue/
// by the daily workflow show up here automatically. Linked from robots.txt and <head>.
import type { APIContext } from 'astro'

import { site } from '@/data/profile'
import { getPosts, paths, postSlug, postUrl, tagCounts, type Lang, type Post } from '@/i18n'

interface Entry {
  loc: string
  lastmod?: Date
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: number
  alternates?: Partial<Record<Lang, string>>
  image?: { loc: string; title: string }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const modified = (p: Post) => p.data.updatedDate ?? p.data.publishDate

export async function GET(context: APIContext) {
  const base = context.site ?? new URL(site.url)
  const abs = (path: string) => new URL(path, base).href
  const posts: Record<Lang, Post[]> = { tr: await getPosts('tr'), en: await getPosts('en') }
  const latest = (lang: Lang) => (posts[lang][0] ? modified(posts[lang][0]) : undefined)
  const newest = [latest('tr'), latest('en')].filter(Boolean).sort((a, b) => b!.valueOf() - a!.valueOf())[0]
  const both = (fn: (l: Lang) => string) => ({ tr: abs(fn('tr')), en: abs(fn('en')) })

  const entries: Entry[] = []
  const pair = (fn: (l: Lang) => string, extra: Omit<Entry, 'loc' | 'alternates'>) => {
    const alternates = both(fn)
    entries.push({ loc: alternates.tr, alternates, ...extra }, { loc: alternates.en, alternates, ...extra })
  }

  pair(paths.home, { lastmod: newest, changefreq: 'daily', priority: 1 })
  pair(paths.blog, { lastmod: newest, changefreq: 'daily', priority: 0.9 })
  pair(paths.tags, { lastmod: newest, changefreq: 'weekly', priority: 0.4 })
  pair(paths.privacy, { changefreq: 'yearly', priority: 0.2 })

  for (const lang of ['tr', 'en'] as Lang[]) {
    // Tag pages with a single post are thin; leave them to normal link discovery.
    for (const [tag] of tagCounts(posts[lang]).filter(([, n]) => n >= 2)) {
      const tagged = posts[lang].filter((p) => p.data.tags.includes(tag))
      entries.push({
        loc: abs(paths.tag(lang, tag)),
        lastmod: tagged.map(modified).sort((a, b) => b.valueOf() - a.valueOf())[0],
        changefreq: 'weekly',
        priority: 0.3
      })
    }

    const other: Lang = lang === 'tr' ? 'en' : 'tr'
    for (const post of posts[lang]) {
      const twin = post.data.translation
        ? posts[other].find((p) => postSlug(p) === post.data.translation)
        : undefined
      const hero = post.data.heroImage
      entries.push({
        loc: abs(postUrl(post)),
        lastmod: modified(post),
        changefreq: 'monthly',
        priority: 0.8,
        alternates: twin ? ({ [lang]: abs(postUrl(post)), [other]: abs(postUrl(twin)) } as Record<Lang, string>) : undefined,
        image: hero ? { loc: abs(hero.src.src), title: hero.alt ?? post.data.title } : undefined
      })
    }
  }

  const body = entries
    .map((e) => {
      const lines = [`<loc>${esc(e.loc)}</loc>`]
      if (e.lastmod) lines.push(`<lastmod>${e.lastmod.toISOString()}</lastmod>`)
      if (e.changefreq) lines.push(`<changefreq>${e.changefreq}</changefreq>`)
      if (e.priority !== undefined) lines.push(`<priority>${e.priority.toFixed(1)}</priority>`)
      if (e.alternates) {
        for (const [l, href] of Object.entries(e.alternates))
          lines.push(`<xhtml:link rel="alternate" hreflang="${l}" href="${esc(href!)}"/>`)
        if (e.alternates.tr) lines.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${esc(e.alternates.tr)}"/>`)
      }
      if (e.image)
        lines.push(`<image:image><image:loc>${esc(e.image.loc)}</image:loc><image:title>${esc(e.image.title)}</image:title></image:image>`)
      return `  <url>\n    ${lines.join('\n    ')}\n  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
