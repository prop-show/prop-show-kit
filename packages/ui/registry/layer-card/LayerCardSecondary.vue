<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="layer-card-secondary"
    :class="
      cn(
        '-my-2 flex min-w-0 items-center gap-2 bg-muted p-4 text-base font-medium text-muted-foreground',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>
