<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'

import * as nuxtUiLocales from '@nuxt/ui/locale'

function normalizeNavigationPaths(data: ContentNavigationItem[], locale: string): ContentNavigationItem[] {
  const contentPrefix = `/${locale.toLowerCase()}`
  const routePrefix = `/${locale}`

  return data.map(item => ({
    ...item,
    path: item.path.startsWith(contentPrefix) ? `${routePrefix}${item.path.slice(contentPrefix.length)}` : item.path,
    children: item.children ? normalizeNavigationPaths(item.children, locale) : undefined,
  }))
}

function transformNavigation(data: ContentNavigationItem[], isI18nEnabled: boolean, locale?: string) {
  if (isI18nEnabled && locale) {
    const localePath = `/${locale.toLowerCase()}`
    const localeResult = data.find(item => item.path === localePath)?.children || data
    const result = localeResult.find(item => item.path === `${localePath}/docs`)?.children || localeResult
    return normalizeNavigationPaths(result, locale)
  }

  return data.find(item => item.path === '/docs')?.children || data
}

const route = useRoute()
const { seo } = useAppConfig()
const site = useSiteConfig()
const { locale, locales, isEnabled, switchLocalePath } = useDocusI18n()
const { isEnabled: isAssistantEnabled, panelWidth: assistantPanelWidth, shouldPushContent } = useAssistant()

const routeLocale = computed(() => route.path.split('/')[1] || locale.value)
const nuxtUiLocale = computed(() => nuxtUiLocales[routeLocale.value.replace('-', '_').toLowerCase() as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value.replace('-', '_')}` : 'docs')
const isHome = computed(() => route.path.toLowerCase() === `/${locale.value.toLowerCase()}`)

useSeoMeta({
  titleTemplate: seo.titleTemplate,
  title: seo.title,
  description: seo.description,
  ogSiteName: site.name,
  twitterCard: 'summary_large_image',
})

if (isEnabled.value) {
  const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale!
  onMounted(() => {
    const currentLocale = route.path.split('/')[1]
    if (!locales.some(locale => locale.code.toLowerCase() === currentLocale.toLowerCase())) {
      return navigateTo(switchLocalePath(defaultLocale) as string)
    }
  })
}

const { data: navigation } = await useAsyncData(() => `navigation_${collectionName.value}`, () => queryCollectionNavigation(collectionName.value as keyof PageCollections), {
  transform: (data: ContentNavigationItem[]) => transformNavigation(data, isEnabled.value, locale.value),
  watch: [locale],
})
const { data: files } = useLazyAsyncData(`search_${collectionName.value}`, () => queryCollectionSearchSections(collectionName.value as keyof PageCollections), {
  server: false,
  watch: [locale],
})

useHead(() => ({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: routeLocale.value,
    dir: nuxtUiLocale.value.dir,
  },
}))

provide('navigation', navigation)

const { subNavigationMode } = useSubNavigation(navigation)
</script>

<template>
  <UApp :locale="nuxtUiLocale">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <div
      class="transition-[margin-right] duration-200 ease-linear will-change-[margin-right]"
      :class="{ 'docus-sub-header': subNavigationMode === 'header' }"
      :style="{ marginRight: shouldPushContent ? `${assistantPanelWidth}px` : '0' }"
    >
      <AppHeader v-if="$route.meta.header !== false" />
      <HomeLanding v-if="isHome" />
      <NuxtLayout v-else>
        <NuxtPage :key="route.fullPath" />
      </NuxtLayout>
      <AppFooter v-if="$route.meta.footer !== false" />
    </div>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
      <template v-if="isAssistantEnabled">
        <LazyAssistantPanel />
        <LazyAssistantFloatingInput />
      </template>
    </ClientOnly>
  </UApp>
</template>

<style>
@media (min-width: 1024px) {
  .docus-sub-header {
    --ui-header-height: 112px;
  }
}
</style>
