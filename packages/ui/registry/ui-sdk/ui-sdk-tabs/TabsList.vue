<script setup lang="ts">
import { TabsList } from "@ui-sdk/vue/tabs";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <TabsList
    :class="
      cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
