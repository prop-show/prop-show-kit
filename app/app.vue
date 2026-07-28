<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'

import * as nuxtUiLocales from '@nuxt/ui/locale'

function transformNavigation(data: ContentNavigationItem[], isI18nEnabled: boolean, locale?: string) {
    if (isI18nEnabled && locale) {
        const localeResult = data.find(item => item.path === `/${locale}`)?.children || data
        return localeResult.find(item => item.path === `/${locale}/docs`)?.children || localeResult
    }

    return data.find(item => item.path === '/docs')?.children || data
}

const route = useRoute()
const { seo } = useAppConfig()
const site = useSiteConfig()
const { locale, locales, isEnabled, switchLocalePath } = useDocusI18n()
const { isEnabled: isAssistantEnabled, panelWidth: assistantPanelWidth, shouldPushContent } = useAssistant()

const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')
const isHome = computed(() => route.path === `/${locale.value}`)

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
        { rel: 'icon', href: '/favicon.ico' },
    ],
    htmlAttrs: {
        lang,
        dir,
    },
})

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
        if (!locales.some(locale => locale.code === currentLocale)) {
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
