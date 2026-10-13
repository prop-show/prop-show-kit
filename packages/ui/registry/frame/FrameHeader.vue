<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="frame-header"
    :class="cn('flex min-w-0 flex-col gap-1 px-3 py-2 [overflow-wrap:anywhere]', $props.class)"
  >
    <slot />
  </div>
</template>
