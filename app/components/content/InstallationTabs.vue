<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Copy } from '@/components/prop-ui/copy'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useShiki } from '~/composables/use-shiki'

interface Props {
    componentName: string
}

const props = defineProps<Props>()

const { initHighlighter } = useShiki()
const isLoading = ref(true)
const highlightedContent = ref<Record<string, string>>({})
const activeTab = ref('pnpm')

const commands = computed(() => {
    const args = `shadcn-vue@latest add https://kit.prop.show/r/`
    const componentName = props.componentName.trim()
    const result = {
        pnpm: `pnpm dlx ${args}${componentName}.json`,
        npm: `npx ${args}${componentName}.json`,
        yarn: `yarn dlx ${args}${componentName}.json`,
        bun: `bux ${args}${componentName}.json`,
    }

    return result
})

const tabs = computed(() => [
    { name: 'pnpm', content: commands.value.pnpm, icon: 'vscode-icons:file-type-pnpm' },
    { name: 'npm', content: commands.value.npm, icon: 'vscode-icons:file-type-npm' },
    { name: 'yarn', content: commands.value.yarn, icon: 'vscode-icons:file-type-yarn' },
    { name: 'bun', content: commands.value.bun, icon: 'vscode-icons:file-type-bun' },
])

watch(() => commands.value, async () => {
    isLoading.value = true
    try {
        const highlighter = await initHighlighter()

        for (const tab of tabs.value) {
            highlightedContent.value[tab.name] = highlighter.codeToHtml(tab.content, {
                lang: 'bash',
                theme: 'vesper',
            })
        }
    }
    catch (e) {
        console.error('Failed to highlight code', e)
        // Fallback to plain text if highlighting fails
        for (const tab of tabs.value) {
            highlightedContent.value[tab.name] = `<pre><code>${tab.content}</code></pre>`
        }
    }
    finally {
        isLoading.value = false
    }
}, { immediate: true })
</script>

<template>
    <ClientOnly>
        <div class="mt-6 overflow-hidden rounded-lg border bg-background">
            <Tabs v-model="activeTab" class="w-full">
                <div class="flex items-center justify-between border-b bg-muted/50 p-2">
                    <TabsList>
                        <TabsTrigger
                            v-for="tab in tabs"
                            :key="tab.name"
                            :value="tab.name"
                        >
                            <Icon :name="tab.icon" class="size-4" />
                            {{ tab.name }}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div v-if="isLoading" class="p-4 space-y-2 min-h-20">
                    <Skeleton class="h-4 w-3/4" />
                    <Skeleton class="h-4 w-1/2" />
                </div>

                <TabsContent
                    v-for="tab in tabs"
                    v-else
                    :key="tab.name"
                    :value="tab.name"
                    class="relative group mt-0"
                >
                    <div class="relative bg-black p-4">
                        <Copy
                            :content="tab.content"
                            :copy-tooltip-text="$t('common.copy')"
                            :copied-tooltip-text="$t('common.copied')"
                            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        />
                        <div class="prose dark:prose-invert" v-html="highlightedContent[tab.name]" />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
        <template #fallback>
            <div class="mt-6 rounded-lg border bg-background p-4 space-y-2">
                <Skeleton class="h-8 w-full mb-4" />
                <Skeleton class="h-4 w-3/4" />
            </div>
        </template>
    </ClientOnly>
</template>
