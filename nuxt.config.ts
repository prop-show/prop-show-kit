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

    fonts: {
        preload: false,
    },

    shadcn: {
        prefix: 'Ui',
        componentDir: '@/components/ui',
    },

    modules: ['shadcn-nuxt', '@nuxt/content', '@nuxt/ui', '@nuxtjs/color-mode', '@nuxt/eslint', '@nuxtjs/mdc', '@nuxtjs/i18n', '@nuxtjs/seo', '@nuxt/icon'],

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
        defaultLocale: 'en',
        locales: [{
            code: 'en',
            name: 'English',
        }],
    },

    eslint: {
        config: {
            standalone: false,
        },
    },

    // mdc: {
    //     highlight: {
    //         theme: {
    //             default: 'vesper',
    //             dark: 'vesper',
    //             sepia: 'vesper',
    //         },
    //         preload: ['vue', 'ts', 'tsx', 'js', 'json'],
    //     },
    // },

    // content: {
    //     build: {
    //         markdown: {
    //             toc: {
    //                 depth: 3,
    //             },
    //             highlight: {
    //                 theme: {
    //                     default: 'vesper',
    //                     dark: 'vesper',
    //                     sepia: 'vesper',
    //                     light: 'github-light',
    //                 },
    //                 preload: ['vue', 'ts', 'tsx', 'js', 'json'],
    //             },
    //         },
    //     },
    // },

    icon: {
        customCollections: [
            {
                prefix: 'prop',
                dir: './app/assets/icons',
            },
        ],
    },
})
