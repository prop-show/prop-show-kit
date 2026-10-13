<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
withDefaults(
  defineProps<{ patterned?: boolean; fit?: boolean; class?: HTMLAttributes["class"] }>(),
  { patterned: false, fit: false },
);
</script>

<template>
  <div
    data-slot="frame-panel"
    :class="
      cn(
        'relative isolate min-w-0 rounded-[max(0px,calc(var(--frame-radius,0.5rem)-2px))] border bg-background p-4 [overflow-wrap:anywhere] group-data-[tone=info]/frame:border-blue-500/20 group-data-[tone=destructive]/frame:border-destructive/20',
        !fit && 'flex-1',
        $props.class,
      )
    "
  >
    <div
      v-if="patterned"
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/3 rounded-[inherit] opacity-[0.04] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:6px_6px]"
    />
    <slot />
  </div>
</template>
