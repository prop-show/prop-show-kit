<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

import { ChevronRightIcon } from '@lucide/vue'
import { nextTick, shallowRef, useTemplateRef, watch } from 'vue'

import { cn } from '@/lib/utils'

import type { CascaderOption, CascaderValue } from './index'

interface Props {
  columns: CascaderOption[][]
  expandedPath: CascaderValue[]
  selectedValue: CascaderValue[]
  open: boolean
  expandTrigger: 'click' | 'hover'
  ariaLabel: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [option: CascaderOption, columnIndex: number]
  expand: [option: CascaderOption, columnIndex: number]
  collapse: [path: CascaderValue[]]
  close: []
}>()

const focusedColumn = shallowRef(0)
const focusedIndex = shallowRef(0)
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainer')
const optionRefs = new Map<string, HTMLElement>()

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen)
      return

    focusedColumn.value = 0
    focusedIndex.value = 0
    await nextTick()
    focusOption(0, 0)
  },
  { immediate: true },
)

function optionRefKey(columnIndex: number, itemIndex: number) {
  return `${columnIndex}-${itemIndex}`
}

function setOptionRef(columnIndex: number, itemIndex: number) {
  return (element: Element | ComponentPublicInstance | null) => {
    const key = optionRefKey(columnIndex, itemIndex)
    if (element)
      optionRefs.set(key, element as HTMLElement)
    else
      optionRefs.delete(key)
  }
}

function focusOption(columnIndex: number, itemIndex: number) {
  optionRefs.get(optionRefKey(columnIndex, itemIndex))?.focus()
}

function focusAt(columnIndex: number, itemIndex: number) {
  focusedColumn.value = columnIndex
  focusedIndex.value = itemIndex
  focusOption(columnIndex, itemIndex)
}

async function scrollToLastColumn() {
  await nextTick()
  scrollContainerRef.value?.scrollTo({
    left: scrollContainerRef.value.scrollWidth,
    behavior: 'smooth',
  })
}

async function handleSelect(option: CascaderOption, columnIndex: number) {
  if (option.disabled)
    return

  emit('select', option, columnIndex)

  if (option.children?.length) {
    focusedColumn.value = columnIndex + 1
    focusedIndex.value = 0
    await scrollToLastColumn()
    focusOption(columnIndex + 1, 0)
  }
}

function handlePointerEnter(option: CascaderOption, columnIndex: number) {
  if (props.expandTrigger !== 'hover' || option.disabled || !option.children?.length)
    return

  emit('expand', option, columnIndex)
  scrollToLastColumn()
}

async function focusParent(columnIndex: number) {
  if (columnIndex === 0)
    return

  const parentColumnIndex = columnIndex - 1
  const parentValue = props.expandedPath[parentColumnIndex]
  const parentIndex = props.columns[parentColumnIndex]?.findIndex(
    option => option.value === parentValue,
  ) ?? -1
  const targetIndex = Math.max(parentIndex, 0)

  emit('collapse', props.expandedPath.slice(0, parentColumnIndex))
  await nextTick()
  focusAt(parentColumnIndex, targetIndex)
}

function handleKeydown(
  event: KeyboardEvent,
  option: CascaderOption,
  columnIndex: number,
  itemIndex: number,
) {
  const column = props.columns[columnIndex]
  if (!column)
    return

  const hasChildren = Boolean(option.children?.length)

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (itemIndex < column.length - 1)
        focusAt(columnIndex, itemIndex + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      if (itemIndex > 0)
        focusAt(columnIndex, itemIndex - 1)
      break
    case 'ArrowRight':
      event.preventDefault()
      if (hasChildren)
        handleSelect(option, columnIndex)
      break
    case 'Enter':
      event.preventDefault()
      handleSelect(option, columnIndex)
      break
    case 'ArrowLeft':
    case 'Backspace':
      event.preventDefault()
      focusParent(columnIndex)
      break
    case 'Escape':
      event.preventDefault()
      emit('close')
      break
    case 'Tab':
      if (!event.shiftKey && hasChildren && props.expandedPath[columnIndex] === option.value) {
        event.preventDefault()
        focusAt(columnIndex + 1, 0)
      }
      else if (event.shiftKey && columnIndex > 0) {
        event.preventDefault()
        focusParent(columnIndex)
      }
      break
  }
}
</script>

<template>
  <div
    ref="scrollContainer"
    class="flex overflow-x-auto scrollbar-thin"
    role="listbox"
    :aria-label="ariaLabel"
  >
    <div
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      role="group"
      :aria-label="`Level ${columnIndex + 1}`"
      :class="
        cn(
          'max-h-75 min-w-30 shrink-0 overflow-auto py-1',
          columnIndex !== columns.length - 1 && 'border-r border-border',
        )
      "
    >
      <div
        v-for="(option, itemIndex) in column"
        :key="option.value"
        :ref="setOptionRef(columnIndex, itemIndex)"
        role="option"
        :aria-selected="selectedValue[columnIndex] === option.value"
        :aria-disabled="option.disabled"
        :aria-expanded="option.children?.length ? expandedPath[columnIndex] === option.value : undefined"
        :tabindex="focusedColumn === columnIndex && focusedIndex === itemIndex && open ? 0 : -1"
        :class="
          cn(
            'flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm',
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
            selectedValue[columnIndex] === option.value && 'bg-accent text-accent-foreground',
            expandedPath[columnIndex] === option.value && 'bg-accent/50',
            option.disabled && 'cursor-not-allowed opacity-50',
          )
        "
        @click="handleSelect(option, columnIndex)"
        @keydown="handleKeydown($event, option, columnIndex, itemIndex)"
        @mouseenter="handlePointerEnter(option, columnIndex)"
        @focus="focusAt(columnIndex, itemIndex)"
      >
        <span class="truncate">{{ option.label }}</span>
        <ChevronRightIcon
          v-if="option.children?.length"
          aria-hidden="true"
          class="ml-2 h-4 w-4 shrink-0 opacity-50"
        />
      </div>
    </div>
  </div>
</template>
