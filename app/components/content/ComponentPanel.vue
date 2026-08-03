<script setup lang="ts">
import type { Component } from 'vue'

import { computed, shallowRef } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import SourceCodeViewer from './SourceCodeViewer.vue'

interface Props {
  component: string
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPreview: true,
})

const currentTab = shallowRef('preview')

const componentModules = import.meta.glob<{ default: Component }>(['../prop-ui/**/*.vue', '../prop-ui-example/**/*.vue'], { eager: true })
const rawModules = import.meta.glob<string>(['../prop-ui/**/*.{vue,ts}', '../prop-ui-example/**/*.{vue,ts}'], { query: '?raw', import: 'default', eager: true })

const targetComponent = computed(() => {
  const name = props.component
  for (const [path, module] of Object.entries(componentModules)) {
    if (path.endsWith(`/${name}.vue`)) {
      return {
        component: module.default,
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
  const files: { name: string, content: string, language: string, icon: string }[] = []

  // If it's in prop-ui, we want to show all files in the same directory
  if (mainPath.includes('/prop-ui/')) {
    const dir = mainPath.substring(0, mainPath.lastIndexOf('/'))
    for (const [path, content] of Object.entries(rawModules)) {
      if (path.startsWith(`${dir}/`)) {
        const fileName = path.slice(path.lastIndexOf('/') + 1)
        files.push({
          name: fileName,
          content,
          language: fileName.endsWith('.vue') ? 'vue' : 'ts',
          icon: fileName.endsWith('.vue') ? 'i-catppuccin-vue' : 'i-catppuccin-typescript',
        })
      }
    }
  }
  else {
    const content = rawModules[mainPath]
    if (content) {
      const fileName = mainPath.slice(mainPath.lastIndexOf('/') + 1)
      files.push({
        name: fileName,
        content,
        language: fileName.endsWith('.vue') ? 'vue' : 'ts',
        icon: fileName.endsWith('.vue') ? 'i-catppuccin-vue' : 'i-catppuccin-typescript',
      })
    }
  }

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
    <Tabs v-if="showPreview" v-model="currentTab" class="w-full">
      <div class="flex items-center justify-between border-b bg-muted/50 p-2">
        <TabsList>
          <TabsTrigger value="preview">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview" class="data-[state=active]:block data-[state=inactive]:hidden">
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
