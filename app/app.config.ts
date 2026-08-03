export default defineAppConfig({
  siteName: 'PropShow Kit',
  socialMedia: {
    github: 'https://github.com/prop-show/prop-show-kit',
  },
  header: {
    title: 'PROP/SHOW KIT',
    logo: {
      light: '/prop-light.svg',
      dark: '/prop-dark.svg',
      alt: 'PropShow Kit Logo',
      class: 'prop-header-logo',
    },
    favicon: '/prop-light.svg',
  },

  components: [
    {
      name: 'Cascader',
      description: 'Navigate nested choices without losing context.',
      href: '/components/cascader',
      tag: 'Navigation',
    },
    {
      name: 'Copy',
      description: 'Copy text with clear, immediate feedback.',
      href: '/components/copy',
      tag: 'Utility',
    },
    {
      name: 'Filters',
      description: 'Filter and sort data with ease.',
      href: '/components/filters',
      tag: 'Filter',
    },
    {
      name: 'Inline Tip',
      description: 'Place useful context exactly where it matters.',
      href: '/components/inline-tip',
      tag: 'Feedback',
    },
    {
      name: 'Status Badge',
      description: 'Make state readable at a glance.',
      href: '/components/status-badge',
      tag: 'Data display',
    },
  ],
})
