import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css',
  ],

  extends: ['docus'],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: 'Ui',
    componentDir: '@/components/ui',
  },

  modules: ['shadcn-nuxt', '@nuxt/content', '@nuxt/ui', '@nuxtjs/color-mode', '@nuxt/eslint', '@nuxtjs/mdc', '@nuxtjs/i18n', '@nuxtjs/seo', '@nuxt/icon', '@vercel/analytics'],

  site: {
    url: 'https://kit.prop.show',
    name: 'PropShow Kit',
    description: 'Extended components for shadcn-vue',
    defaultLocale: 'en',
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/prop-dark.svg', media: '(prefers-color-scheme: dark)' },
        { rel: 'icon', type: 'image/svg+xml', href: '/prop-light.svg', media: '(prefers-color-scheme: light)' },
        { rel: 'canonical', href: 'https://kit.prop.show' },
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en',
        file: 'en.json',
      },
      // {
      //   code: 'zh-CN',
      //   name: '简体中文',
      //   language: 'zh-CN',
      //   file: 'zh-CN.json',
      // },
    ],
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  icon: {
    customCollections: [
      {
        prefix: 'prop',
        dir: './app/assets/icons',
      },
    ],
  },

  ogImage: {
    // options below go here, e.g.
    defaults: {
      extension: 'png',
      emojis: 'noto',
    },
  },
})
