// llms.txt (https://llmstxt.org) generated from the site data on every build,
// so newly published posts are listed without editing this file.
import type { APIContext } from 'astro'

import { publications } from '@/data/publications'
import { profile, site } from '@/data/profile'
import { getPosts, paths, postUrl, t, type Lang, type Post } from '@/i18n'

const PROFILE_CATEGORIES = new Set(['Profil', 'Profile', 'Şirket', 'Company'])

export async function GET(context: APIContext) {
  const base = context.site ?? new URL(site.url)
  const abs = (path: string) => new URL(path, base).href
  const posts: Record<Lang, Post[]> = { tr: await getPosts('tr'), en: await getPosts('en') }
  const line = (p: Post) => `- [${p.data.title}](${abs(postUrl(p))}): ${p.data.description}`
  const isProfile = (p: Post) => PROFILE_CATEGORIES.has(p.data.category ?? '')

  const out: string[] = []
  out.push(`# ${site.name}`, '')
  out.push(`> ${profile.tr.metaDescription} — ${profile.en.metaDescription}`, '')
  out.push(`${profile.tr.intro} ${t('tr').blogDesc}`, '')
  out.push(`${profile.en.intro} ${t('en').blogDesc}`, '')
  out.push(
    `Yazar / Author: ${site.name} · ${profile.tr.role} · ${site.location.tr} · ${site.email}`,
    `Diller / Languages: Türkçe (${abs(paths.home('tr'))}), English (${abs(paths.home('en'))})`,
    ''
  )

  out.push('## Şirketler / Companies')
  profile.tr.ventures.items.forEach((v, i) => {
    const en = profile.en.ventures.items[i]
    out.push(`- [${v.name}](${v.url}) (${v.legal}, ${v.since}): ${v.text} — ${en?.text ?? ''}`)
  })
  out.push('')

  out.push('## Hakkında / About')
  out.push(`- [${site.name} — Ana sayfa](${abs(paths.home('tr'))}): ${profile.tr.metaDescription}`)
  out.push(`- [${site.name} — Home](${abs(paths.home('en'))}): ${profile.en.metaDescription}`)
  for (const lang of ['tr', 'en'] as Lang[]) posts[lang].filter(isProfile).forEach((p) => out.push(line(p)))
  out.push('')

  if (publications) {
    out.push('## Yayınlar / Publications')
    out.push(
      `Google Scholar: ${publications.scholarUrl} (${publications.metrics.citations} citations, h-index ${publications.metrics.hIndex}, as of ${publications.asOf.en})`
    )
    for (const x of publications.items)
      out.push(`- [${x.title}](https://doi.org/${x.doi}) — ${x.authors.join(', ')}. ${x.venue} ${x.details} (${x.year}). ${x.summary.en}`)
    out.push('')
  }

  out.push('## Yazılar — Türkçe')
  posts.tr.filter((p) => !isProfile(p)).forEach((p) => out.push(line(p)))
  out.push('')
  out.push('## Posts — English')
  posts.en.filter((p) => !isProfile(p)).forEach((p) => out.push(line(p)))
  out.push('')

  out.push('## Optional')
  out.push(`- [Full text of all posts](${abs('/llms-full.txt')}): every post in Markdown, one file`)
  out.push(`- [Sitemap](${abs('/sitemap.xml')})`)
  out.push(`- [RSS (TR)](${abs(paths.rss('tr'))}) · [RSS (EN)](${abs(paths.rss('en'))})`)
  out.push('')

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
