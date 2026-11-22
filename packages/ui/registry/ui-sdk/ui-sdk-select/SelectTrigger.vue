<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue";
import { SelectTrigger as SelectTriggerPrimitive } from "@ui-sdk/vue/select";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const sizes = { default: "h-9", sm: "h-8" };

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    disabled?: boolean;
    size?: keyof typeof sizes;
  }>(),
  { size: "default" },
);
</script>

<template>
  <SelectTriggerPrimitive
    :data-size="props.size"
    :disabled="props.disabled"
    :class="
      cn(
        'flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none motion-safe:transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg:not([class*=text-])]:text-muted-foreground [&_svg:not([class*=size-])]:size-4',
        sizes[props.size],
        props.class,
      )
    "
  >
    <slot />
    <ChevronDownIcon aria-hidden="true" class="size-4 opacity-50" />
  </SelectTriggerPrimitive>
</template>
