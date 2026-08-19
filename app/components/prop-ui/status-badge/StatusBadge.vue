<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import type { BadgeVariants } from '@/components/ui/badge'

import { Badge } from '@/components/ui/badge'

import type { StatusVariants } from '.'

import Status from './Status.vue'

const props = defineProps<{
  variant?: BadgeVariants['variant']
  rounded?: StatusVariants['rounded']
  class?: HTMLAttributes['class']
  color?: StatusVariants['color']
}>()
</script>

<template>
  <Badge :variant="props.variant" :class="props.class">
    <Status :color="props.color" :rounded="props.rounded" />
    <slot />
  </Badge>
</template>
