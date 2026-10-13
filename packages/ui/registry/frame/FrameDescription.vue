<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <p
    data-slot="frame-description"
    :class="cn('text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]', $props.class)"
  >
    <slot />
  </p>
</template>
