<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'

import { cn } from '@/lib/utils'

import type { InlineTipVariants } from '.'

import { inlineTipVariants } from '.'

interface Props {
  label: string
  variant?: InlineTipVariants['variant']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
})

const rootClass = computed(() => cn(
  'inline-grid grid-cols-[4px_1fr] items-start gap-3 rounded-md border bg-secondary p-3 text-sm text-secondary-foreground',
  props.class,
))
const indicatorClass = computed(() => cn(
  'h-full w-1 rounded-full',
  inlineTipVariants({ variant: props.variant }),
))
</script>

<template>
  <div role="note" :class="rootClass">
    <div :class="indicatorClass" />

    <div class="text-muted-foreground">
      <strong class="mr-2 text-sm font-semibold text-foreground">{{ props.label }}:</strong>
      <slot />
    </div>
  </div>
</template>
