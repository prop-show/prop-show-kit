<script setup lang="ts">
const i18nHead = useLocaleHead({
    dir: true,
    seo: true,
})

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - PropShow Kit` : 'PropShow Kit'
    },
    htmlAttrs: {
        lang: i18nHead.value.htmlAttrs!.lang,
    },
    link: [...(i18nHead.value.link || [])],
    meta: [...(i18nHead.value.meta || [])],
})
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />

        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
