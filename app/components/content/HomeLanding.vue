<script setup lang="ts">
import HomeComponentArchive from './home/HomeComponentArchive.vue'
import HomeHero from './home/HomeHero.vue'
import HomeInstallStrip from './home/HomeInstallStrip.vue'

const { socialMedia, components } = useAppConfig()
const { locale, localePath } = useDocusI18n()

const installCommand = 'npx shadcn-vue@latest add https://kit.prop.show/r/copy.json'
const componentTranslations = {
  'Cascader': { name: 'Cascader 级联选择器', description: '在多层选项中逐级导航，同时保留上下文。', tag: '导航' },
  'Copy': { name: 'Copy 复制按钮', description: '复制文本，并提供清晰即时的操作反馈。', tag: '工具' },
  'Filters': { name: 'Filters 筛选器', description: '轻松筛选和排序数据。', tag: '筛选' },
  'Inline Tip': { name: 'Inline Tip 行内提示', description: '在最需要的位置提供恰当的上下文。', tag: '反馈' },
  'Status Badge': { name: 'Status Badge 状态徽章', description: '让状态信息一目了然。', tag: '数据展示' },
}
const localizedComponents = computed(() => components.map(component => ({
  ...component,
  ...(locale.value === 'zh-CN' ? componentTranslations[component.name as keyof typeof componentTranslations] : undefined),
  href: localePath(component.href),
})))
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
