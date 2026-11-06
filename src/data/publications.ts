// Academic publications shown on the homepage. Set to `null` on sites without publications.
// Metrics are copied by hand from Google Scholar; update `asOf` when you refresh them.
import type { Lang } from '@/i18n'

type L<T> = Record<Lang, T>

export interface Publication {
  title: string
  authors: string[]
  /** Index into `authors` of the site owner, rendered in bold */
  me: number
  venue: string
  details: string
  year: number
  doi: string
  citations: number
  summary: L<string>
  tags: L<string[]>
}

export interface Publications {
  scholarUrl: string
  asOf: L<string>
  metrics: { citations: number; hIndex: number; i10: number }
  items: Publication[]
}

export const publications: Publications | null = {
  scholarUrl: 'https://scholar.google.com/citations?user=Isrnt0cAAAAJ&hl=tr',
  asOf: { tr: '6 Kasım 2026', en: '6 November 2026' },
  metrics: { citations: 10, hIndex: 1, i10: 1 },
  items: [
    {
      title:
        'Machine learning-driven regional prediction of PM2.5 concentrations in the Eastern Mediterranean: bridging spatial data gaps in air quality monitoring',
      authors: ['İ. Çetintürk Gürtepe', 'İ. T. Şenkal', 'A. Ünal', 'G. Güllü', 'Y. Aslanoğlu', 'J. D. Marshall'],
      me: 1,
      venue: 'Environmental Modelling & Software',
      details: '192, 106586',
      year: 2025,
      doi: '10.1016/j.envsoft.2025.106586',
      citations: 10,
      summary: {
        tr: 'Doğu Akdeniz’de PM2.5 konsantrasyonlarını makine öğrenmesiyle bölgesel ölçekte tahmin eden; ölçüm istasyonlarının bulunmadığı bölgelerdeki veri boşluklarını kapatmaya yönelik bir çalışma.',
        en: 'A study that predicts PM2.5 concentrations across the Eastern Mediterranean with machine learning, aiming to fill data gaps in areas without monitoring stations.'
      },
      tags: { tr: ['Makine Öğrenmesi', 'Hava Kalitesi', 'PM2.5'], en: ['Machine Learning', 'Air Quality', 'PM2.5'] }
    }
  ]
}
