<script setup lang="ts">
import { ref, watch } from 'vue'

import { Copy } from '@/components/prop-ui/copy'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useShiki } from '~/composables/use-shiki'

const props = defineProps<{
    files: { name: string, content: string, language: string, icon: string }[]
}>()

const activeTab = ref<string | undefined>(undefined)
const highlightedContent = ref<Record<string, string>>({})
const isLoading = ref(true)
const { initHighlighter } = useShiki()

watch(() => props.files, async (newFiles) => {
    isLoading.value = true
    if (newFiles && newFiles.length > 0) {
    // If activeTab is not set or not in the new files list, set it to the first file
        if (!activeTab.value || !newFiles.find(f => f.name === activeTab.value)) {
            activeTab.value = newFiles[0]?.name
        }

        const highlighter = await initHighlighter()
        for (const file of newFiles) {
            highlightedContent.value[file.name] = highlighter.codeToHtml(file.content, {
                lang: file.language,
                theme: 'vesper',
            })
        }
    }
    isLoading.value = false
}, { immediate: true })
</script>

<template>
    <ClientOnly>
        <div v-if="isLoading" class="p-4 space-y-2 rounded-b-lg min-h-25">
            <Skeleton class="h-4 w-62.5 " />
            <Skeleton class="h-4 w-50 " />
            <Skeleton class="h-4 w-75 " />
        </div>
        <div v-else-if="files.length === 1" class="group w-[calc(100vw-3rem)] md:w-full">
            <Copy
                :content="files?.[0]?.content || ''"
                :copy-tooltip-text="$t('common.copy')"
                :copied-tooltip-text="$t('common.copied')"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div class="prose dark:prose-invert mx-auto " v-html="highlightedContent[files[0]!.name]" />
        </div>
        <div v-else-if="files.length > 1" class="w-[calc(100vw-3rem)] md:w-full ">
            <Tabs v-model="activeTab">
                <div class="flex items-center justify-between border-b bg-muted/50 p-2">
                    <TabsList>
                        <TabsTrigger
                            v-for="file in files"
                            :key="file.name"
                            :value="file.name"
                        >
                            <Icon :name="file.icon" class="size-4 mr-2" />
                            {{ file.name }}
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent
                    v-for="file in files"
                    :key="file.name"
                    :value="file.name"
                    class="relative group w-[calc(100vw-3rem)] md:w-full "
                    :class="{ hidden: activeTab !== file.name }"
                    :force-mount="true"
                >
                    <Copy
                        :content="file.content"
                        :copy-tooltip-text="$t('common.copy')"
                        :copied-tooltip-text="$t('common.copied')"
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div class="prose dark:prose-invert mx-auto " v-html="highlightedContent[file.name]" />
                </TabsContent>
            </Tabs>
        </div>
        <template #fallback>
            <div class="p-4 space-y-2 rounded-b-lg min-h-25">
                <Skeleton class="h-4 w-62.5 " />
                <Skeleton class="h-4 w-50 " />
                <Skeleton class="h-4 w-75 " />
            </div>
        </template>
    </ClientOnly>
</template>
