import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

import { profile, site } from '@/data/profile'
import { getPosts, postUrl } from '@/i18n'

export async function GET(context: APIContext) {
  const posts = await getPosts('en')
  return rss({
    title: site.name,
    description: profile.en.metaDescription,
    site: context.site ?? site.url,
    customData: '<language>en</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: postUrl(post),
      categories: post.data.tags
    }))
  })
}
