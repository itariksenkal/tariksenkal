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
  company: { name: 'HatsonTech', legal: 'Hatson Teknoloji A.Ş.', url: 'https://hatsontech.com/' }
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
  process: { title: string; steps: { title: string; text: string }[] }
  now: string
  expertise: { icon: string; title: string; text: string }[]
  timeline: { when: string; title: string; text: string }[]
  stats: { value: string; label: string }[]
  contact: { title: string; text: string; cta: string }
  sections: Record<'about' | 'expertise' | 'journey' | 'writing' | 'contact' | 'process', string>
}> = {
  tr: {
    metaTitle: 'İsmail Tarık Şenkal — Yapay zeka geliştiricisi',
    metaDescription:
      'İsmail Tarık Şenkal: Türkçe odaklı yapay zeka, büyük dil modelleri, RAG ve doğal dil işleme üzerine çalışan geliştirici. HatsonTech kurucu ortağı.',
    role: 'Yapay zeka geliştiricisi · HatsonTech kurucu ortağı',
    eyebrow: 'Yapay zeka · NLP · Türkçe',
    headline: 'Araştırmadan çıkan yapay zekayı, güvenilir ürünlere çeviriyorum.',
    intro:
      'Doğal dil işleme ve büyük dil modelleriyle Türkçe’de gerçekten işe yarayan ürünler kuruyorum. Bir modeli probleme uyarlamak, onu doğru bilgiye bağlamak ve hepsini üretime taşımak — işim çoğunlukla bu üç adımdan geçiyor.',
    status: 'Yeni yazı',
    about: {
      lead: 'Kısaca: araştırmadan çıkan yapay zekayı, insanların günlük işinde güvenebileceği ürünlere çeviriyorum.',
      points: [
        {
          title: 'Fikirden ürüne',
          text: 'Bir modeli denemekten, onu gerçek kullanıcıların güvendiği bir ürüne taşımaya kadar işin tamamıyla ilgileniyorum.'
        },
        {
          title: 'Doğal dil işleme',
          text: 'Dil modelleriyle çalışıyor, cevapları gerçek kaynaklara dayandıran güvenilir sistemler kuruyorum.'
        },
        {
          title: 'Türkçe’nin tarafında',
          text: 'Türkçe konuşan herkesin kendi ana dilinde güçlü ve doğru yapay zekaya erişebilmesini istiyorum.'
        }
      ]
    },
    focus: [
      'Büyük Dil Modelleri',
      'Doğal Dil İşleme',
      'RAG & Semantik Arama',
      'Ajan Sistemleri',
      'MLOps',
      'Hukuk Teknolojisi',
      'Girişimcilik'
    ],
    process: {
      title: 'Fikirden ürüne, üç adımda',
      steps: [
        { title: 'Uyarla', text: 'Dil modelini ele aldığım probleme ve Türkçe’ye uyarlıyorum.' },
        { title: 'Bağla', text: 'RAG ile gerçek kaynaklara bağlayıp “uydurmasını” engelliyorum.' },
        { title: 'Taşı', text: 'Hepsini üretime taşıyıp ölçeklenebilir ve güvenilir hâle getiriyorum.' }
      ]
    },
    now: 'Bugünlerde bunu HatsonTech’te yapıyorum — en çok da Türkçe hukuk dili için yapay zeka çözümleri üzerinde çalışıyorum.',
    expertise: [
      {
        icon: 'brain',
        title: 'Büyük Dil Modelleri',
        text: 'Türkçe hukuk diline göre ince ayar yapılmış modeller eğitiyor ve üretime alıyorum.'
      },
      {
        icon: 'text',
        title: 'Doğal Dil İşleme',
        text: 'Türkçe ve çok dilli metni anlama: sınıflandırma, çıkarım ve anlam temelli işleme.'
      },
      {
        icon: 'layers',
        title: 'RAG',
        text: 'Cevapları gerçek belgelere dayandıran, modelin uydurmasını engelleyen getirim mimarileri.'
      },
      {
        icon: 'search',
        title: 'Semantik Arama & Vektör DB',
        text: 'Anahtar kelime değil anlam temelli, geniş arşivlerde isabetli ve hızlı arama.'
      },
      {
        icon: 'network',
        title: 'MCP & Ajan Sistemleri',
        text: 'Model Context Protocol ile araç kullanan ve akıllı yönlendirme yapan ajan mimarileri.'
      },
      {
        icon: 'server',
        title: 'Model Eğitimi & MLOps',
        text: 'Büyük ölçekli altyapıda eğitim, ince ayar ve sürekli dağıtım. TRUBA ve HPC deneyimi.'
      },
      {
        icon: 'leaf',
        title: 'Hava Kalitesi Modellemesi',
        text: 'Çevre mühendisliği geçmişiyle hava kirleticilerinin modellenmesi ve hava kalitesi tahmini.'
      }
    ],
    timeline: [
      {
        when: 'Eğitim',
        title: 'Mühendislik ve yapay zekaya ilgi',
        text: 'Yazılım ve yapay zekaya olan ilgimi akademik ve uygulamalı çalışmalarla derinleştirdim; doğal dil işlemeye odaklandım.'
      },
      {
        when: 'Araştırma',
        title: 'Türkçe NLP ve büyük ölçekli modeller',
        text: 'TÜBİTAK etkinlikleri, TRUBA (Ulusal e-Bilim altyapısı) ve EUMaster4HPC gibi ortamlarda büyük ölçekli yapay zeka çalışmalarına katıldım.'
      },
      {
        when: '2024',
        title: 'HatsonTech’in kuruluşu',
        text: 'Ankara ODTÜ Teknokent’te Hatson Teknoloji A.Ş.’yi kurucu ortak olarak hayata geçirdim. Hedef: Türkçe’ye odaklı yapay zeka ürünleri.'
      },
      {
        when: 'Bugün',
        title: 'Hukuki dil modeli',
        text: 'Türkçe hukuk diline özel LLM ve RAG mimarileri geliştiriyor, kamu kurumlarıyla yapay zeka projeleri yürütüyorum.'
      }
    ],
    stats: [
      { value: '2024', label: 'HatsonTech kuruluşu' },
      { value: 'TR · EN', label: 'iki dilde yazılar' },
      { value: 'ODTÜ', label: 'Teknokent, Ankara' }
    ],
    contact: {
      title: 'Yapay zeka, ürün ya da iş birliği konuşalım',
      text: 'Yapay zeka, ürün ya da olası bir iş birliği hakkında konuşmak isterseniz yazmaktan çekinmeyin.',
      cta: 'E-posta gönder'
    },
    sections: {
      about: 'Hakkımda',
      process: 'Nasıl çalışıyorum',
      expertise: 'Uzmanlık alanları',
      journey: 'Yolculuk',
      writing: 'Yazılar',
      contact: 'İletişim'
    }
  },
  en: {
    metaTitle: 'İsmail Tarık Şenkal — AI developer',
    metaDescription:
      'İsmail Tarık Şenkal: developer working on Turkish-focused artificial intelligence, large language models, RAG and natural language processing. Co-founder of HatsonTech.',
    role: 'AI developer · Co-founder at HatsonTech',
    eyebrow: 'AI · NLP · Turkish',
    headline: 'I turn AI that comes out of research into products people can trust.',
    intro:
      'I build products with natural language processing and large language models that genuinely work in Turkish. Adapting a model to the problem, grounding it in the right information, and carrying it all into production — most of my work goes through those three steps.',
    status: 'New post',
    about: {
      lead: 'In short: I turn artificial intelligence that comes out of research into products people can rely on day to day.',
      points: [
        {
          title: 'From idea to product',
          text: 'I care about the whole path — from experimenting with a model to shipping something real users trust.'
        },
        {
          title: 'Natural language processing',
          text: 'I work with language models and build reliable systems that ground their answers in real sources.'
        },
        {
          title: 'On the side of Turkish',
          text: 'I want everyone who speaks Turkish to have powerful, accurate AI in their own native language.'
        }
      ]
    },
    focus: [
      'Large Language Models',
      'Natural Language Processing',
      'RAG & Semantic Search',
      'Agent Systems',
      'MLOps',
      'Legal Technology',
      'Entrepreneurship'
    ],
    process: {
      title: 'From idea to product, in three steps',
      steps: [
        { title: 'Adapt', text: 'I adapt a language model to the problem at hand and to Turkish.' },
        { title: 'Ground', text: 'I connect it to real sources with RAG so it can’t “make things up.”' },
        { title: 'Ship', text: 'I carry it into production and make it scalable and reliable.' }
      ]
    },
    now: 'These days I do this at HatsonTech — mostly on AI solutions for the Turkish legal language.',
    expertise: [
      {
        icon: 'brain',
        title: 'Large Language Models',
        text: 'I train and ship models fine-tuned for the Turkish legal language.'
      },
      {
        icon: 'text',
        title: 'Natural Language Processing',
        text: 'Understanding Turkish and multilingual text: classification, inference and meaning-based processing.'
      },
      {
        icon: 'layers',
        title: 'RAG',
        text: 'Retrieval architectures that ground answers in real documents and stop the model from making things up.'
      },
      {
        icon: 'search',
        title: 'Semantic Search & Vector DB',
        text: 'Search based on meaning rather than keywords — precise, fast retrieval across large archives.'
      },
      {
        icon: 'network',
        title: 'MCP & Agent Systems',
        text: 'Agent architectures that use tools and route intelligently via the Model Context Protocol.'
      },
      {
        icon: 'server',
        title: 'Model Training & MLOps',
        text: 'Training, fine-tuning and continuous deployment on large-scale infrastructure. TRUBA and HPC experience.'
      },
      {
        icon: 'leaf',
        title: 'Air Quality Modeling',
        text: 'With an environmental-engineering background: modeling air pollutants and forecasting air quality.'
      }
    ],
    timeline: [
      {
        when: 'Education',
        title: 'Engineering and an interest in AI',
        text: 'I deepened my interest in software and artificial intelligence through academic and applied work, focusing on natural language processing.'
      },
      {
        when: 'Research',
        title: 'Turkish NLP and large-scale models',
        text: 'I took part in large-scale AI work in environments such as TÜBİTAK events, TRUBA (the National e-Science infrastructure) and EUMaster4HPC.'
      },
      {
        when: '2024',
        title: 'Founding HatsonTech',
        text: 'I co-founded Hatson Teknoloji A.Ş. at METU Technopark in Ankara, with one goal: AI products focused on Turkish.'
      },
      {
        when: 'Today',
        title: 'Legal language model',
        text: 'I develop LLM and RAG architectures built for the Turkish legal language and run AI projects with public institutions.'
      }
    ],
    stats: [
      { value: '2024', label: 'HatsonTech founded' },
      { value: 'TR · EN', label: 'writing in two languages' },
      { value: 'METU', label: 'Technopark, Ankara' }
    ],
    contact: {
      title: 'Let’s talk AI, products or collaboration',
      text: 'If you’d like to talk about artificial intelligence, products or a possible collaboration, don’t hesitate to write.',
      cta: 'Send an email'
    },
    sections: {
      about: 'About',
      process: 'How I work',
      expertise: 'Expertise',
      journey: 'Journey',
      writing: 'Writing',
      contact: 'Contact'
    }
  }
}
