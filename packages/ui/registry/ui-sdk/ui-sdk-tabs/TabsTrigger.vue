<script setup lang="ts">
import { TabsTab } from "@ui-sdk/vue/tabs";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ value: string; disabled?: boolean; class?: HTMLAttributes["class"] }>();
</script>

<template>
  <TabsTab
    :value="props.value"
    :disabled="props.disabled"
    :class="
      cn(
        'inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground outline-none motion-safe:transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:opacity-50 data-selected:bg-background data-selected:shadow-sm dark:text-muted-foreground dark:data-selected:border-input dark:data-selected:bg-input/30 dark:data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
        props.class,
      )
    "
  >
    <slot />
  </TabsTab>
</template>
