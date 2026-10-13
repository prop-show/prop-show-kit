<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <h3
    data-slot="frame-title"
    :class="cn('text-sm font-medium leading-6 [overflow-wrap:anywhere]', $props.class)"
  >
    <slot />
  </h3>
</template>
