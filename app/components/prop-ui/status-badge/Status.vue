<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'

import { cn } from '@/lib/utils'

import type { StatusVariants } from '.'

import { statusVariants } from '.'

interface Props {
  color?: StatusVariants['color']
  rounded?: StatusVariants['rounded']
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const dotClass = computed(() => statusVariants({
  color: props.color,
  rounded: props.rounded,
}))
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('relative mr-1 inline-flex size-2', props.class)"
  >
    <span
      :class="cn(dotClass, 'absolute inset-0 inline-flex animate-ping opacity-75 motion-reduce:animate-none')"
    />
    <span :class="cn(dotClass, 'relative inline-flex')" />
  </span>
</template>
