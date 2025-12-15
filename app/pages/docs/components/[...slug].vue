<script lang="ts" setup>
import Toc from '@/components/content/Toc.vue'

const route = useRoute()
const { locale } = useI18n()

const { data: currentDoc } = await useAsyncData(route.path, () => {
    const slug = route.params.slug as string[]
    const slugStr = Array.isArray(slug) ? slug.join('/') : slug
    const path = `/${locale.value}/docs/components/${slugStr}`
    return queryCollection(`docs_${locale.value}` as any).path(path).first()
})

definePageMeta({
    layout: 'docs',
})
useSeoMeta(currentDoc.value.seo || {})
</script>

<template>
    <div v-if="currentDoc" class="flex flex-col lg:flex-row gap-10 relative items-start max-w-screen md:max-w-full ">
        <div class="prose dark:prose-invert flex-1 min-w-0 max-w-none">
            <ContentRenderer :value="currentDoc" />
        </div>
        <div v-if="currentDoc.body?.toc?.links?.length" class="hidden lg:block w-64 shrink-0 sticky top-8">
            <p class="font-semibold mb-4 text-sm">
                {{ $t('common.on_this_page') }}
            </p>
            <Toc :links="currentDoc.body.toc.links" />
        </div>
    </div>
    <div v-else>
        TODO 空状态
    </div>
</template>
