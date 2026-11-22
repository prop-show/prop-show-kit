<script setup lang="ts">
import { SelectSeparator } from "@ui-sdk/vue/select";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <SelectSeparator :class="cn('pointer-events-none -mx-1 my-1 h-px bg-border', props.class)" />
</template>
