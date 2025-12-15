<script setup lang="ts">
import { computed, ref } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import SourceCodeViewer from './SourceCodeViewer.vue'

interface Props {
    component: string
    showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showPreview: true,
})

const currentTab = ref('preview')

// Import component instances
// Relative path from app/components/content/ to app/components/prop-ui/ is ../prop-ui/
const componentModules = import.meta.glob(['../prop-ui/**/*.vue', '../prop-ui-example/**/*.vue'], { eager: true })
// Import raw sources
const rawModules = import.meta.glob(['../prop-ui/**/*.{vue,ts}', '../prop-ui-example/**/*.{vue,ts}'], { as: 'raw', eager: true })

const targetComponent = computed(() => {
    const name = props.component
    for (const path in componentModules) {
    // Check if path ends with the component name
    // path is like ../../prop-ui/status-badge/StatusBadge.vue
        if (path.endsWith(`/${name}.vue`)) {
            return {
                component: (componentModules[path] as any).default,
                path,
            }
        }
    }
    return null
})

const sourceFiles = computed(() => {
    const target = targetComponent.value
    if (!target)
        return []

    const mainPath = target.path
    const files: { name: string, content: string, language: string }[] = []

    // If it's in prop-ui, we want to show all files in the same directory
    if (mainPath.includes('/prop-ui/')) {
        const dir = mainPath.substring(0, mainPath.lastIndexOf('/'))
        for (const path in rawModules) {
            if (path.startsWith(`${dir}/`)) {
                const fileName = path.split('/').pop() || ''
                files.push({
                    name: fileName,
                    content: rawModules[path] as string,
                    language: fileName.endsWith('.vue') ? 'vue' : 'ts',
                })
            }
        }
    }
    else {
    // For examples or other locations, just show the main file
    // We need to find the raw content for the main file.
    // Note: rawModules keys might differ slightly if glob patterns match differently,
    // but here they should be identical relative paths.
        if (rawModules[mainPath]) {
            const fileName = mainPath.split('/').pop() || ''
            files.push({
                name: fileName,
                content: rawModules[mainPath] as string,
                language: fileName.endsWith('.vue') ? 'vue' : 'ts',
            })
        }
    }

    // Sort files: index.ts last, main component first?
    // Or alphabetical?
    // Let's put the main component (matching props.component) first.
    return files.sort((a, b) => {
        if (a.name === `${props.component}.vue`)
            return -1
        if (b.name === `${props.component}.vue`)
            return 1
        return a.name.localeCompare(b.name)
    })
})
</script>

<template>
    <div class="my-6 border rounded-lg">
        <Tabs v-if="showPreview" v-model="currentTab" class="relative mr-auto w-full">
            <div class="flex items-center justify-between pb-3 pt-3 px-4 border-b">
                <TabsList class="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                    <TabsTrigger
                        value="preview"
                        class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        Preview
                    </TabsTrigger>
                    <TabsTrigger
                        value="code"
                        class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        Code
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="preview" class="relative rounded-md border-none p-0 data-[state=active]:block data-[state=inactive]:hidden">
                <div class="flex items-center justify-center p-10 min-h-50">
                    <component :is="targetComponent?.component" v-if="targetComponent" />
                    <div v-else class="text-red-500">
                        Component {{ component }} not found
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="code" class="relative rounded-md border-none p-0" :class="{ hidden: currentTab !== 'code' }" :force-mount="true">
                <SourceCodeViewer :files="sourceFiles" />
            </TabsContent>
        </Tabs>

        <div v-else class="w-full">
            <SourceCodeViewer :files="sourceFiles" />
        </div>
    </div>
</template>
