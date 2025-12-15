<script setup lang="ts">
interface TocLink {
    id: string
    text: string
    depth: number
    children?: TocLink[]
}

defineOptions({
    name: 'Toc',
})

defineProps<{
    links: TocLink[]
}>()
</script>

<template>
    <ul class="space-y-2 text-sm">
        <li v-for="link in links" :key="link.id">
            <a
                :href="`#${link.id}`"
                class="block text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
            >
                {{ link.text }}
            </a>
            <Toc v-if="link.children && link.children.length" :links="link.children" class="pl-4 mt-2" />
        </li>
    </ul>
</template>
