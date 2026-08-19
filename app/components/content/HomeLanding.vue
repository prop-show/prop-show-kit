<script setup lang="ts">
import HomeComponentArchive from './home/HomeComponentArchive.vue'
import HomeHero from './home/HomeHero.vue'
import HomeInstallStrip from './home/HomeInstallStrip.vue'

const { socialMedia, components } = useAppConfig()
const { t, localePath } = useDocusI18n()

const installCommand = 'npx shadcn-vue@latest add https://kit.prop.show/r/copy.json'
const localizedComponents = computed(() => components.map((component) => {
  const slug = component.href.split('/').pop()
  return {
    ...component,
    name: t(`home.components.${slug}.name`) || component.name,
    description: t(`home.components.${slug}.description`) || component.description,
    tag: t(`home.components.${slug}.tag`) || component.tag,
    href: localePath(component.href),
  }
}))
const quickStartPath = computed(() => localePath('/getting-started/quick-start'))
const installationPath = computed(() => localePath('/getting-started/installation'))
</script>

<template>
  <main class="prop-home mx-auto max-w-[90rem] border-x border-default bg-default">
    <HomeHero
      :component-count="components.length"
      :quick-start-path="quickStartPath"
      :source-url="socialMedia.github"
    />
    <HomeComponentArchive :items="localizedComponents" />
    <HomeInstallStrip :command="installCommand" :installation-path="installationPath" />
  </main>
</template>
