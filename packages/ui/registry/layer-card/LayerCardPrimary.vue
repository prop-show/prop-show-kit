<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="layer-card-primary"
    :class="
      cn(
        'relative flex min-w-0 flex-col gap-2 overflow-hidden rounded-lg bg-card p-4 pr-3 text-card-foreground ring ring-border',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>
