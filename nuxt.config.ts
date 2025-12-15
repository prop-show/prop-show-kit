import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: [
        '~/assets/css/tailwind.css',
    ],

    vite: {
        plugins: [tailwindcss()],
    },

    shadcn: {
        prefix: 'Ui',
        componentDir: '@/components/ui',
    },

    modules: ['shadcn-nuxt', '@nuxt/content', '@nuxtjs/color-mode', '@nuxt/eslint', '@nuxtjs/mdc', '@nuxtjs/i18n', '@nuxtjs/seo', '@nuxt/icon'],

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
                { rel: 'icon', href: '/favicon.svg' },
                { rel: 'canonical', href: 'https://kit.prop.show' },
            ],
        },
    },

    i18n: {
        baseUrl: 'https://kit.prop.show',
        locales: [
            { code: 'en', file: 'en.json', name: 'English' },
            { code: 'zh', file: 'zh.json', name: '中文' },
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
    },

    colorMode: {
        classSuffix: '',
    },

    eslint: {
        config: {
            standalone: false,
        },
    },

    mdc: {
        highlight: {
            theme: {
                default: 'vesper',
                dark: 'vesper',
                sepia: 'vesper',
            },
            preload: ['vue', 'ts', 'tsx', 'js', 'json'],
        },
    },

    content: {
        build: {
            markdown: {
                toc: {
                    depth: 3,
                },
                highlight: {
                    theme: {
                        default: 'vesper',
                        dark: 'vesper',
                        sepia: 'vesper',
                    },
                    preload: ['vue', 'ts', 'tsx', 'js', 'json'],
                },
            },
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
})
