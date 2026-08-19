<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import type { CascaderOption, CascaderProps, CascaderValue } from './index'

import { getCascaderColumns, getSelectedOptions } from './cascader-core'
import CascaderPanel from './CascaderPanel.vue'
import CascaderTrigger from './CascaderTrigger.vue'

const props = withDefaults(defineProps<CascaderProps>(), {
  placeholder: 'Please select',
  disabled: false,
  allowClear: true,
  expandTrigger: 'click',
  class: undefined,
  popupClass: undefined,
  displayRender: undefined,
})

const emit = defineEmits<{
  change: [value: CascaderValue[], selectedOptions: CascaderOption[]]
}>()

const modelValue = defineModel<CascaderValue[]>({ default: () => [] })
const isMobile = useMediaQuery('(max-width: 768px)')
const open = shallowRef(false)
const expandedPath = shallowRef<CascaderValue[]>([])

const columns = computed(() => getCascaderColumns(props.options, expandedPath.value))
const selectedOptions = computed(() => getSelectedOptions(props.options, modelValue.value))
const displayLabels = computed(() => selectedOptions.value.map(option => option.label))
const hasValue = computed(() => modelValue.value.length > 0)
const displayValue = computed(() => {
  if (!hasValue.value)
    return null

  return props.displayRender
    ? props.displayRender(displayLabels.value, selectedOptions.value)
    : displayLabels.value.join(' / ')
})

function handleSelect(option: CascaderOption, columnIndex: number) {
  if (option.disabled)
    return

  const nextPath = [...expandedPath.value.slice(0, columnIndex), option.value]
  if (option.children?.length) {
    expandedPath.value = nextPath
    return
  }

  const nextOptions = getSelectedOptions(props.options, nextPath)
  modelValue.value = nextPath
  emit('change', nextPath, nextOptions)
  handleOpenChange(false)
}

function handleExpand(option: CascaderOption, columnIndex: number) {
  if (!option.disabled)
    expandedPath.value = [...expandedPath.value.slice(0, columnIndex), option.value]
}

function handleClear() {
  modelValue.value = []
  emit('change', [], [])
  handleOpenChange(false)
}

function handleOpenChange(nextOpen: boolean) {
  if (nextOpen && props.disabled)
    return

  open.value = nextOpen
  expandedPath.value = nextOpen ? modelValue.value.slice(0, -1) : []
}
</script>

<template>
  <Popover v-if="!isMobile" :open="open" @update:open="handleOpenChange">
    <PopoverTrigger as-child>
      <CascaderTrigger
        :open="open"
        :disabled="disabled"
        :allow-clear="allowClear"
        :has-value="hasValue"
        :display-value="displayValue"
        :placeholder="placeholder"
        :trigger-class="props.class"
        @clear="handleClear"
      />
    </PopoverTrigger>
    <PopoverContent :class="cn('w-auto p-0', popupClass)" align="start">
      <CascaderPanel
        :columns="columns"
        :expanded-path="expandedPath"
        :selected-value="modelValue"
        :open="open"
        :expand-trigger="expandTrigger"
        :aria-label="placeholder"
        @select="handleSelect"
        @expand="handleExpand"
        @collapse="expandedPath = $event"
        @close="handleOpenChange(false)"
      />
    </PopoverContent>
  </Popover>

  <Drawer v-else :open="open" @update:open="handleOpenChange">
    <DrawerTrigger as-child>
      <CascaderTrigger
        :open="open"
        :disabled="disabled"
        :allow-clear="allowClear"
        :has-value="hasValue"
        :display-value="displayValue"
        :placeholder="placeholder"
        :trigger-class="props.class"
        @clear="handleClear"
      />
    </DrawerTrigger>
    <DrawerContent :class="cn('px-0', popupClass)">
      <DrawerHeader class="pb-2">
        <DrawerTitle class="text-sm font-medium">
          {{ placeholder }}
        </DrawerTitle>
      </DrawerHeader>
      <div class="px-4 pb-6">
        <CascaderPanel
          :columns="columns"
          :expanded-path="expandedPath"
          :selected-value="modelValue"
          :open="open"
          :expand-trigger="expandTrigger"
          :aria-label="placeholder"
          @select="handleSelect"
          @expand="handleExpand"
          @collapse="expandedPath = $event"
          @close="handleOpenChange(false)"
        />
      </div>
    </DrawerContent>
  </Drawer>
</template>
