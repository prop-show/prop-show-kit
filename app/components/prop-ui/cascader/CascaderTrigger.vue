<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { ChevronDownIcon, XIcon } from '@lucide/vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

import type { CascaderValue } from './index'

interface Props {
  open: boolean
  disabled: boolean
  allowClear: boolean
  hasValue: boolean
  displayValue: CascaderValue | null
  placeholder: string
  triggerClass?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const emit = defineEmits<{
  clear: []
}>()

const triggerLabel = computed(() => props.displayValue ?? props.placeholder)

function handleKeydown(event: KeyboardEvent) {
  if (!props.allowClear || !props.hasValue)
    return

  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
    event.stopPropagation()
    emit('clear')
  }
}
</script>

<template>
  <button
    type="button"
    role="combobox"
    :aria-expanded="open"
    aria-haspopup="listbox"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex h-10 w-50 cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-colors',
        'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        !hasValue && 'text-muted-foreground',
        disabled && 'pointer-events-none opacity-50',
        triggerClass,
      )
    "
    @keydown="handleKeydown"
  >
    <span class="min-w-0 flex-1 truncate text-left font-normal">
      {{ triggerLabel }}
    </span>
    <span class="flex shrink-0 items-center gap-1">
      <span
        v-if="allowClear && hasValue && !disabled"
        aria-hidden="true"
        class="cursor-pointer"
        @click.stop.prevent="emit('clear')"
      >
        <XIcon class="h-4 w-4 opacity-50 hover:opacity-100" />
      </span>
      <ChevronDownIcon aria-hidden="true" class="h-4 w-4 opacity-50" />
    </span>
    <span v-if="allowClear && hasValue" class="sr-only">
      Press Backspace or Delete to clear the selection.
    </span>
  </button>
</template>
