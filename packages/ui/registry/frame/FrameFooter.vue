<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="frame-footer"
    :class="
      cn(
        'flex min-w-0 flex-wrap items-center gap-2 px-3 py-2 text-xs text-muted-foreground [overflow-wrap:anywhere] group-data-[tone=info]/frame:text-blue-600 group-data-[tone=info]/frame:dark:text-blue-400 group-data-[tone=destructive]/frame:text-destructive',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>
