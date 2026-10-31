<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { computed } from "vue";

import { cn } from "@/lib/utils";

import { metricColumnClass } from "./metric";

const props = withDefaults(
  defineProps<{
    label?: string;
    columns?: number;
    class?: HTMLAttributes["class"];
  }>(),
  {
    label: "Metrics",
    columns: 3,
  },
);

const columnsClass = computed(() => metricColumnClass(props.columns));
</script>

<template>
  <div
    data-slot="metric-cards"
    role="group"
    :aria-label="props.label"
    :class="cn('grid gap-3', columnsClass, props.class)"
  >
    <slot />
  </div>
</template>
