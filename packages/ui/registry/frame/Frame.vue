<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

withDefaults(
  defineProps<{
    variant?: "default" | "ghost";
    tone?: "default" | "info" | "destructive";
    spacing?: "sm" | "default" | "lg";
    dense?: boolean;
    stacked?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { variant: "default", tone: "default", spacing: "default", dense: false, stacked: false },
);
</script>

<template>
  <div
    data-slot="frame"
    :data-tone="tone"
    :data-dense="dense"
    :data-stacked="stacked"
    :class="
      cn(
        'group/frame flex min-w-0 flex-col rounded-[var(--frame-radius)] border bg-muted/50 text-foreground [--frame-radius:0.5rem]',
        spacing === 'sm' && 'gap-0.5 p-0.5',
        spacing === 'default' && 'gap-1 p-1',
        spacing === 'lg' && 'gap-2 p-2',
        stacked && 'gap-0',
        dense && 'gap-0 overflow-hidden p-0',
        tone === 'info' && 'border-blue-500/20 bg-blue-500/10',
        tone === 'destructive' && 'border-destructive/20 bg-destructive/10',
        variant === 'ghost' && 'border-transparent',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>

<style scoped>
[data-stacked="true"] > :deep([data-slot="frame-panel"] + [data-slot="frame-panel"]) {
  margin-top: -1px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
[data-stacked="true"] > :deep([data-slot="frame-panel"]:has(+ [data-slot="frame-panel"])) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
[data-dense="true"] > :deep([data-slot="frame-panel"]) {
  border-inline: 0;
  border-radius: 0;
}
[data-dense="true"] > :deep([data-slot="frame-panel"]:first-child) {
  border-top: 0;
}
[data-dense="true"] > :deep([data-slot="frame-panel"]:last-child) {
  border-bottom: 0;
}
[data-dense="true"] > :deep([data-slot="frame-panel"] + [data-slot="frame-panel"]) {
  margin-top: -1px;
}
</style>
