import antfu from '@antfu/eslint-config'

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    antfu({
        formatters: true,
        vue: true,
        typescript: true,
        stylistic: {
            indent: 4,
        },

        ignores: [
            '**/build/**',
            '**/components/ui/**',
        ],

        rules: {
            'perfectionist/sort-imports': ['error', {
                tsconfigRootDir: '.',
            }],
            'yaml/indent': ['error', 2],
            'jsonc/indent': ['error', 2],
            'vue/block-lang': ['warn', {
                script: { lang: ['ts', 'tsx'] },
            }],
        },
    }),

)
