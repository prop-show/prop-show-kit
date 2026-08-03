import antfu from '@antfu/eslint-config'

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    type: 'app',
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },

    typescript: true,

    ignores: [
      '**/build/**',
      '**/components/ui/**',
    ],
    vue: {
      overrides: {
        'vue/block-lang': ['warn', {
          script: { lang: ['ts', 'tsx'] },
        }],
        'vue/enforce-style-attribute': ['warn', {
          allow: ['scoped'],
        }],
      },
    },
    imports: {
      overrides: {
        'perfectionist/sort-imports': ['error', {
          tsconfig: { rootDir: '.' },
        }],
      },
    },
    rules: {
    },
  }),
)
