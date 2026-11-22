<script setup lang="ts">
import { SelectGroupLabel } from "@ui-sdk/vue/select";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <SelectGroupLabel :class="cn('px-2 py-1.5 text-xs text-muted-foreground', props.class)">
    <slot />
  </SelectGroupLabel>
</template>
