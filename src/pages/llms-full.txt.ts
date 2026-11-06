// Every published post as Markdown in a single file, for LLM tools that prefer one fetch.
import type { APIContext } from 'astro'

import { profile, site } from '@/data/profile'
import { getPosts, postUrl, type Lang } from '@/i18n'

export async function GET(context: APIContext) {
  const base = context.site ?? new URL(site.url)
  const out: string[] = [`# ${site.name} — full text`, '', `> ${profile.tr.metaDescription} — ${profile.en.metaDescription}`, '']
  for (const lang of ['tr', 'en'] as Lang[]) {
    for (const post of await getPosts(lang)) {
      const d = post.data
      out.push('---', '', `# ${d.title}`, '')
      out.push(`URL: ${new URL(postUrl(post), base).href}`)
      out.push(`Author: ${site.name}`)
      out.push(`Language: ${lang}`)
      out.push(`Published: ${d.publishDate.toISOString().slice(0, 10)}`)
      if (d.updatedDate) out.push(`Updated: ${d.updatedDate.toISOString().slice(0, 10)}`)
      if (d.tags.length) out.push(`Tags: ${d.tags.join(', ')}`)
      out.push('', `> ${d.description}`, '', (post.body ?? '').trim(), '')
    }
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
