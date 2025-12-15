<script setup lang="ts">
import { Icon } from '@iconify/vue'

import Toc from '@/components/content/Toc.vue'

const { locale } = useI18n()

const { data: currentDoc } = await useAsyncData(`docs-intro-${locale.value}`, () => {
    const path = `/${locale.value}/docs/introduction`
    return queryCollection(`docs_${locale.value}` as any).path(path).first()
})

definePageMeta({
    layout: 'docs',
})
useSeoMeta(currentDoc.value.seo || {})
</script>

<template>
    <div v-if="currentDoc" class="flex flex-col lg:flex-row gap-10 relative items-start">
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
    <div v-else class="flex items-center justify-center py-20">
        <div class="text-center space-y-4">
            <Icon icon="radix-icons:file-text" class="w-16 h-16 mx-auto text-muted-foreground" />
            <p class="text-muted-foreground">
                暂无文档内容
            </p>
        </div>
    </div>
</template>
