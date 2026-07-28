<script setup lang="ts">
import HomeComponentArchive from './home/HomeComponentArchive.vue'
import HomeHero from './home/HomeHero.vue'
import HomeInstallStrip from './home/HomeInstallStrip.vue'

interface HomeComponent {
    name: string
    description: string
    href: string
    tag: string
}

const { socialMedia } = useAppConfig()

const components: HomeComponent[] = [
    {
        name: 'Cascader',
        description: 'Navigate nested choices without losing context.',
        href: '/en/components/cascader',
        tag: 'Navigation',
    },
    {
        name: 'Copy',
        description: 'Copy text with clear, immediate feedback.',
        href: '/en/components/copy',
        tag: 'Utility',
    },
    {
        name: 'Inline Tip',
        description: 'Place useful context exactly where it matters.',
        href: '/en/components/inline-tip',
        tag: 'Feedback',
    },
    {
        name: 'Status Badge',
        description: 'Make state readable at a glance.',
        href: '/en/components/status-badge',
        tag: 'Data display',
    },
]

const installCommand = 'npx shadcn-vue@latest add https://kit.prop.show/r/copy.json'
</script>

<template>
    <main class="prop-home mx-auto max-w-[90rem] border-x border-default bg-default">
        <HomeHero
            :component-count="components.length"
            :source-url="socialMedia.github"
        />
        <HomeComponentArchive :items="components" />
        <HomeInstallStrip :command="installCommand" />
    </main>
</template>
