import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

// Theme-level settings used by astro-pure internals.
// Person-specific content lives in src/data/profile.ts; UI strings in src/i18n.ts.
export const theme: ThemeUserConfig = {
  title: 'Tarık Şenkal',
  author: 'İsmail Tarık Şenkal',
  description:
    'Türkçe odaklı yapay zeka, büyük dil modelleri, RAG ve doğal dil işleme üzerine yazılar.',
  favicon: '/favicon.svg',
  socialCard: '/og-card.jpg',
  locale: {
    lang: 'tr-TR',
    attrs: 'tr_TR',
    dateLocale: 'tr-TR',
    dateOptions: { day: 'numeric', month: 'short', year: 'numeric' }
  },
  logo: { src: '/src/assets/avatar.jpeg', alt: 'İsmail Tarık Şenkal' },
  titleDelimiter: '·',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],
  // The site uses its own bilingual header/footer (src/components/site), these satisfy the schema.
  header: { menu: [{ title: 'Yazılar', link: '/blog/' }] },
  footer: {
    year: `© ${new Date().getFullYear()}`,
    links: [],
    credits: false,
    social: [{ icon: 'rss', label: 'RSS', href: '/rss.xml' }]
  },
  content: {
    externalLinks: { content: ' ↗', properties: { style: 'user-select:none' } },
    blogPageSize: 12,
    share: ['x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  pagefind: true,
  // Required by the schema; the quote widget is not rendered on this site.
  quote: { server: 'https://dummyjson.com/quotes/random', target: `(data) => data.quote` },
  typography: {
    class: 'prose text-base',
    blockquoteStyle: 'normal',
    inlineCodeBlockStyle: 'modern'
  },
  mediumZoom: { enable: true, selector: '.prose .zoomable', options: { className: 'zoomable' } },
  waline: { enable: false }
}

const config = { ...theme, integ } as Config
export default config
