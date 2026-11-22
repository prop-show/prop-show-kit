<script setup lang="ts">
import type { Side } from "@ui-sdk/core";
import { SelectContent as SelectContentPrimitive } from "@ui-sdk/vue/select";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    side?: Side;
    sideOffset?: number;
    alignItemWithTrigger?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { sideOffset: 4 },
);
</script>

<template>
  <SelectContentPrimitive
    :align="props.align"
    :side="props.side"
    :side-offset="props.sideOffset"
    :align-item-with-trigger="props.alignItemWithTrigger"
    :class="
      cn(
        'z-50 max-h-(--available-height) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md motion-safe:data-open:animate-in motion-safe:data-open:fade-in-0 motion-safe:data-open:zoom-in-95 motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-closed:zoom-out-95',
        props.alignItemWithTrigger ? 'min-w-32' : 'min-w-[max(8rem,var(--anchor-width,0px))]',
        props.class,
      )
    "
  >
    <slot />
  </SelectContentPrimitive>
</template>
