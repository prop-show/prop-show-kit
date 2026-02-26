<script setup lang="ts">
import { ref, watch } from 'vue'

import { useShiki } from '~/composables/use-shiki'

const props = defineProps<{
    files: { name: string, content: string, language: string, icon: string }[]
}>()

const highlightedContent = ref<Record<string, string>>({})
const { initHighlighter } = useShiki()

function extractCodeInnerHtml(html: string) {
    const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
    return match?.[1] || ''
}

function escapeHtml(content: string) {
    return content
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
}

watch(() => props.files, async (newFiles) => {
    if (!newFiles?.length)
        return

    try {
        const highlighter = await initHighlighter()
        for (const file of newFiles) {
            const html = highlighter.codeToHtml(file.content, {
                lang: file.language,
                themes: {
                    light: 'github-light',
                    dark: 'vesper',
                },
                defaultColor: 'light-dark()',
            })
            highlightedContent.value[file.name] = extractCodeInnerHtml(html)
        }
    }
    catch (error) {
        console.error('Failed to highlight code', error)
        for (const file of newFiles) {
            highlightedContent.value[file.name] = escapeHtml(file.content)
        }
    }
}, { immediate: true })
</script>

<template>
    <template v-for="file in props.files" :key="file.name">
        <ProseCodeCollapse>
            <ProsePre
                :language="file.language"
                :code="file.content"
                :filename="file.name"
                :icon="file.icon"
            >
                <code v-html="highlightedContent[file.name] || escapeHtml(file.content)" />
            </ProsePre>
        </ProseCodeCollapse>
    </template>
</template>
