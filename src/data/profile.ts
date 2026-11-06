// Everything that is specific to this person lives here.
// The rest of the site (layouts, components, pages) is shared between personal sites.
import type { Lang } from '@/i18n'

type L<T> = Record<Lang, T>

export const site = {
  url: 'https://tariksenkal.com',
  name: 'İsmail Tarık Şenkal',
  shortName: 'Tarık Şenkal',
  initials: 'TŞ',
  /** Accent used by the highlight gradient and small details */
  accent: '#3B6BF6',
  email: 'itarik.senkal@hatsontech.com',
  location: { tr: 'Ankara, Türkiye', en: 'Ankara, Türkiye' } as L<string>,
  socials: [
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      href: 'https://www.linkedin.com/in/tar%C4%B1k-%C5%9Fenkal-776b98257'
    },
    { label: 'GitHub', icon: 'github', href: 'https://github.com/itariksenkal' },
    { label: 'X', icon: 'x', href: 'https://x.com/hatsontech' }
  ],
  companies: [
    { name: 'HatsonTech', legal: 'Hatson Teknoloji Ltd. Şti.', url: 'https://hatsontech.com/' },
    { name: 'Caseon AI', legal: 'Caseon Teknoloji A.Ş.', url: 'https://caseon.ai/' }
  ]
}

export const profile: L<{
  metaTitle: string
  metaDescription: string
  role: string
  eyebrow: string
  headline: string
  intro: string
  status: string
  about: { lead: string; points: { title: string; text: string }[] }
  focus: string[]
  ventures: {
    title: string
    items: { name: string; legal: string; since: string; tag: string; text: string; url: string }[]
  }
  now: string
  expertise: { icon: string; title: string; text: string }[]
  timeline: { when: string; title: string; text: string }[]
  stats: { value: string; label: string }[]
  contact: { title: string; text: string; cta: string }
  sections: Record<'about' | 'expertise' | 'journey' | 'writing' | 'contact' | 'ventures', string>
}> = {
  tr: {
    metaTitle: 'İsmail Tarık Şenkal — HatsonTech ve Caseon AI kurucu ortağı',
    metaDescription:
      'İsmail Tarık Şenkal: HatsonTech ve Caseon AI’ın kurucu ortaklarından. Yapay zeka, yazılım ve girişimcilik üzerine öğrendiklerini burada yazıyor.',
    role: 'Girişimci · HatsonTech ve Caseon AI kurucu ortağı',
    eyebrow: 'Girişimcilik · Yapay zeka · Yazılım',
    headline: 'Yapay zeka ve yazılım alanında şirketler kuruyor, yol boyunca öğrendiklerimi paylaşıyorum.',
    intro:
      'HatsonTech ve Caseon AI’ın kurucu ortaklarındanım. Lisansımı Hacettepe Üniversitesi’nde, yüksek lisansımı ODTÜ’de yaptım. Bu sitede yapay zeka, yazılım ve girişimcilik üzerine notlarımı paylaşıyorum.',
    status: 'Yeni yazı',
    about: {
      lead: 'Kısaca: iki teknoloji şirketinin kurucu ortağıyım. Ekiplerimizle birlikte, yapay zekayı kurumların gündelik işinde kullanılabilir hâle getiren ürünler ve projeler üzerinde çalışıyoruz.',
      points: [
        {
          title: 'Girişimcilik',
          text: 'Bir ekibi ortak bir hedef etrafında toplamayı ve bir fikri sürdürülebilir bir işe dönüştürmeyi önemsiyorum.'
        },
        {
          title: 'Ürün ve teknoloji',
          text: 'Dil modelleri, RAG ve yazılım altyapısı tarafındaki ürün kararlarına yakından dahil oluyorum.'
        },
        {
          title: 'Uzun soluklu ilişkiler',
          text: 'Kısa süreli işlerden çok, kurumlarla birlikte büyüyebileceğimiz uzun soluklu iş birliklerini tercih ediyoruz.'
        }
      ]
    },
    focus: [
      'Girişimcilik',
      'Büyük Dil Modelleri',
      'Doğal Dil İşleme',
      'RAG & Semantik Arama',
      'Ajan Sistemleri',
      'Hukuk Teknolojisi',
      'Web & Mobil Yazılım'
    ],
    ventures: {
      title: 'Kurucu ortağı olduğum şirketler',
      items: [
        {
          name: 'HatsonTech',
          legal: 'Hatson Teknoloji Ltd. Şti.',
          since: 'Ağustos 2026, Ankara',
          tag: 'Yazılım ve yapay zeka',
          text: 'Kurumlar için yapay zeka ajanları, kaynak gösteren RAG asistanları, dil modeli ince ayarı, görüntü işleme, veri mühendisliği ile web ve mobil yazılım geliştiriyoruz.',
          url: 'https://hatsontech.com/'
        },
        {
          name: 'Caseon AI',
          legal: 'Caseon Teknoloji A.Ş.',
          since: '2026',
          tag: 'Hukuk teknolojisi',
          text: 'Avukatların durum tespiti (due diligence) ve sözleşme inceleme işleri için bir yazılım geliştiriyoruz. Her cevap dayandığı belge paragrafıyla birlikte gösteriliyor; son kontrol her zaman avukatta.',
          url: 'https://caseon.ai/'
        }
      ]
    },
    now: 'Bugün zamanımı bu iki şirketin büyümesine, ürünlerine ve ekiplerine ayırıyorum.',
    expertise: [
      {
        icon: 'brain',
        title: 'Büyük Dil Modelleri',
        text: 'Dil modellerini Türkçe’ye ve belirli alanlara uyarlamak için ince ayar ve değerlendirme çalışmaları.'
      },
      {
        icon: 'text',
        title: 'Doğal Dil İşleme',
        text: 'Türkçe ve çok dilli metinlerde sınıflandırma, bilgi çıkarımı ve anlam temelli işleme.'
      },
      {
        icon: 'layers',
        title: 'RAG',
        text: 'Cevapları ilgili belgelere dayandıran ve kaynağını gösteren getirim mimarileri.'
      },
      {
        icon: 'search',
        title: 'Semantik Arama & Vektör DB',
        text: 'Anahtar kelimenin yanında anlamı da gözeten arama sistemleri.'
      },
      {
        icon: 'network',
        title: 'MCP & Ajan Sistemleri',
        text: 'Araç kullanan ve önemli adımlarda insan onayı bekleyen ajan iş akışları.'
      },
      {
        icon: 'book',
        title: 'Hukuk Yazılımları',
        text: 'Durum tespiti (due diligence) ve sözleşme inceleme gibi hukuk iş akışları için yazılım.'
      },
      {
        icon: 'server',
        title: 'Yazılım & MLOps',
        text: 'Web, mobil ve arka uç yazılımlar; modellerin eğitimi, dağıtımı ve izlenmesi. TRUBA ve HPC altyapılarında çalışma deneyimi.'
      },
      {
        icon: 'leaf',
        title: 'Hava Kalitesi Modellemesi',
        text: 'Çevre mühendisliğine olan ilgimle hava kirleticilerinin modellenmesi ve hava kalitesi tahmini.'
      }
    ],
    timeline: [
      {
        when: 'Lisans',
        title: 'Hacettepe Üniversitesi',
        text: 'Mühendislik temelimi Hacettepe Üniversitesi’nde attım.'
      },
      {
        when: 'Yüksek lisans',
        title: 'ODTÜ',
        text: 'Yüksek lisansımı Orta Doğu Teknik Üniversitesi’nde yaptım; bu dönemde yapay zeka ve doğal dil işlemeye yöneldim.'
      },
      {
        when: 'Araştırma',
        title: 'Büyük ölçekli yapay zeka çalışmaları',
        text: 'TÜBİTAK etkinlikleri, TRUBA (Ulusal e-Bilim altyapısı) ve EUMaster4HPC gibi ortamlarda büyük ölçekli model eğitimi üzerine çalışmalara katılma fırsatım oldu.'
      },
      {
        when: '2024',
        title: 'İlk girişim',
        text: 'Ankara’da bir yapay zeka Ar-Ge şirketini kurucu ortak olarak kurduk; Türkçe dil modelleri ve kaynak gösteren arama sistemleri üzerine ürünler geliştirdik.'
      },
      {
        when: 'Temmuz 2026',
        title: 'Yeni bir sayfa',
        text: 'Bu şirketteki görevimden ayrıldım; orada edindiğim ürün ve şirket kurma deneyimini yeni şirketlerimize taşıdım.'
      },
      {
        when: 'Ağustos 2026',
        title: 'HatsonTech',
        text: 'Hatson Teknoloji’yi Ankara’da kurduk. Kurumlar için yapay zeka ajanları, kaynak gösteren RAG asistanları, dil modeli ince ayarı, görüntü işleme, veri mühendisliği ile web ve mobil yazılım geliştiriyoruz.'
      },
      {
        when: '2026',
        title: 'Caseon AI',
        text: 'Hukuk teknolojisine odaklanan ayrı bir şirket olarak Caseon AI’ı kurduk. Avukatların durum tespiti ve sözleşme inceleme işlerinde belgelerle daha rahat çalışabilmesi için bir yazılım geliştiriyoruz; her cevap dayandığı kaynakla birlikte gösteriliyor.'
      }
    ],
    stats: [
      { value: '2026', label: 'HatsonTech ve Caseon AI' },
      { value: 'ODTÜ', label: 'yüksek lisans' },
      { value: 'TR · EN', label: 'iki dilde yazılar' }
    ],
    contact: {
      title: 'İş birliği için iletişim',
      text: 'Projeleriniz, olası iş birlikleri ya da şirketlerimiz hakkında konuşmak isterseniz e-postayla ulaşabilirsiniz; en kısa sürede dönmeye çalışırım.',
      cta: 'E-posta gönder'
    },
    sections: {
      about: 'Hakkımda',
      ventures: 'Şirketler',
      expertise: 'İlgi ve çalışma alanları',
      journey: 'Yolculuk',
      writing: 'Yazılar',
      contact: 'İletişim'
    }
  },
  en: {
    metaTitle: 'İsmail Tarık Şenkal — Co-founder of HatsonTech and Caseon AI',
    metaDescription:
      'İsmail Tarık Şenkal: one of the co-founders of HatsonTech and Caseon AI, writing about what he learns on AI, software and entrepreneurship.',
    role: 'Entrepreneur · Co-founder of HatsonTech and Caseon AI',
    eyebrow: 'Entrepreneurship · AI · Software',
    headline: 'I build companies in AI and software, and share what I learn along the way.',
    intro:
      'I’m one of the co-founders of HatsonTech and Caseon AI. I studied at Hacettepe University and did my master’s at METU. On this site I share notes on AI, software and entrepreneurship.',
    status: 'New post',
    about: {
      lead: 'In short: I co-founded two technology companies. Together with our teams, we work on products and projects that make AI usable in organisations’ everyday work.',
      points: [
        {
          title: 'Entrepreneurship',
          text: 'I care about bringing a team together around a shared goal and turning an idea into a sustainable business.'
        },
        {
          title: 'Product and technology',
          text: 'I stay closely involved in product decisions around language models, RAG and software infrastructure.'
        },
        {
          title: 'Long-term relationships',
          text: 'Rather than short engagements, we prefer long-term partnerships where we can grow together with organisations.'
        }
      ]
    },
    focus: [
      'Entrepreneurship',
      'Large Language Models',
      'Natural Language Processing',
      'RAG & Semantic Search',
      'Agent Systems',
      'Legal Technology',
      'Web & Mobile Software'
    ],
    ventures: {
      title: 'Companies I co-founded',
      items: [
        {
          name: 'HatsonTech',
          legal: 'Hatson Teknoloji Ltd. Şti.',
          since: 'August 2026, Ankara',
          tag: 'Software and AI',
          text: 'We build AI agents, source-citing RAG assistants, language-model fine-tuning, computer vision, data engineering, and web and mobile software for organisations.',
          url: 'https://hatsontech.com/'
        },
        {
          name: 'Caseon AI',
          legal: 'Caseon Teknoloji A.Ş.',
          since: '2026',
          tag: 'Legal technology',
          text: 'We are building software for lawyers’ due diligence and contract review work. Every answer is shown with the document paragraph it relies on, and the final check always stays with the lawyer.',
          url: 'https://caseon.ai/en/'
        }
      ]
    },
    now: 'Today I spend my time on the growth, products and teams of these two companies.',
    expertise: [
      {
        icon: 'brain',
        title: 'Large Language Models',
        text: 'Fine-tuning and evaluation work to adapt language models to Turkish and to specific domains.'
      },
      {
        icon: 'text',
        title: 'Natural Language Processing',
        text: 'Classification, information extraction and meaning-based processing of Turkish and multilingual text.'
      },
      {
        icon: 'layers',
        title: 'RAG',
        text: 'Retrieval architectures that ground answers in the relevant documents and show their sources.'
      },
      {
        icon: 'search',
        title: 'Semantic Search & Vector DB',
        text: 'Search systems that consider meaning as well as keywords.'
      },
      {
        icon: 'network',
        title: 'MCP & Agent Systems',
        text: 'Agent workflows that use tools and wait for human approval at important steps.'
      },
      {
        icon: 'book',
        title: 'Legal Software',
        text: 'Software for legal workflows such as due diligence and contract review.'
      },
      {
        icon: 'server',
        title: 'Software & MLOps',
        text: 'Web, mobile and backend software; training, deploying and monitoring models. Experience on TRUBA and HPC infrastructure.'
      },
      {
        icon: 'leaf',
        title: 'Air Quality Modeling',
        text: 'Out of an interest in environmental engineering: modeling air pollutants and forecasting air quality.'
      }
    ],
    timeline: [
      {
        when: 'Bachelor’s',
        title: 'Hacettepe University',
        text: 'I laid my engineering foundations at Hacettepe University.'
      },
      {
        when: 'Master’s',
        title: 'METU',
        text: 'I did my master’s at Middle East Technical University, where I turned towards AI and natural language processing.'
      },
      {
        when: 'Research',
        title: 'Large-scale AI work',
        text: 'I had the chance to take part in large-scale model training work through TÜBİTAK events, TRUBA (the National e-Science infrastructure) and EUMaster4HPC.'
      },
      {
        when: '2024',
        title: 'A first startup',
        text: 'We co-founded an AI R&D company in Ankara, where we built products around Turkish language models and source-citing search.'
      },
      {
        when: 'July 2026',
        title: 'A new chapter',
        text: 'I left my role at that company and carried the product and company-building experience I gained there into our new companies.'
      },
      {
        when: 'August 2026',
        title: 'HatsonTech',
        text: 'We founded Hatson Teknoloji in Ankara. We build AI agents, source-citing RAG assistants, language-model fine-tuning, computer vision, data engineering, and web and mobile software for organisations.'
      },
      {
        when: '2026',
        title: 'Caseon AI',
        text: 'We founded Caseon AI as a separate company focused on legal technology. We are building software that helps lawyers work through documents in due diligence and contract review; every answer is shown together with its source.'
      }
    ],
    stats: [
      { value: '2026', label: 'HatsonTech & Caseon AI' },
      { value: 'METU', label: 'master’s degree' },
      { value: 'TR · EN', label: 'writing in two languages' }
    ],
    contact: {
      title: 'Get in touch',
      text: 'If you’d like to talk about a project, a possible partnership or our companies, feel free to email me; I’ll reply as soon as I can.',
      cta: 'Send an email'
    },
    sections: {
      about: 'About',
      ventures: 'Companies',
      expertise: 'Interests & work',
      journey: 'Journey',
      writing: 'Writing',
      contact: 'Contact'
    }
  }
}
