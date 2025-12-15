import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
    collections: {
        docs_en: defineCollection(asSeoCollection({
            type: 'page',
            source: 'en/docs/**/*.md',
        })),
        docs_zh: defineCollection(asSeoCollection({
            type: 'page',
            source: 'zh/docs/**/*.md',
        })),
    },
})
