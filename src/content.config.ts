import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Posts live in src/content/blog/<lang>/<slug>.md
// TR posts are served at /posts/<slug>/, EN posts at /en/posts/<slug>/
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lang: z.enum(['tr', 'en']),
      /** Main topic shown on cards (e.g. "RAG", "Güvenlik") */
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /** Slug of the same post in the other language */
      translation: z.string().optional(),
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional(),
          color: z.string().optional()
        })
        .optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false)
    })
})

// Simple standalone pages (privacy policy etc.)
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      lang: z.enum(['tr', 'en']),
      updatedDate: z.coerce.date().optional()
    })
})

export const collections = { blog, pages }
