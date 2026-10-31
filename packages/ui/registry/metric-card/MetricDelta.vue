<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "@lucide/vue";
import { computed } from "vue";

import { cn } from "@/lib/utils";

import type { MetricTone, MetricTrend } from "./metric";

import {
  formatMetricDelta,
  hasMetricDelta,
  metricDirectionLabel,
  metricToneClass,
  resolveMetricTone,
  resolveMetricTrend,
} from "./metric";

const props = defineProps<{
  delta?: string | number;
  trend?: MetricTrend;
  tone?: MetricTone;
  description?: string;
  class?: HTMLAttributes["class"];
}>();

const trend = computed(() => resolveMetricTrend(props.delta, props.trend));
const text = computed(() =>
  props.delta === undefined || props.delta === null ? "" : formatMetricDelta(props.delta),
);
const visible = computed(
  () => trend.value !== null && hasMetricDelta(props.delta) && text.value !== "",
);
const toneClass = computed(() =>
  trend.value ? metricToneClass[resolveMetricTone(trend.value, props.tone)] : "",
);
const direction = computed(() => (trend.value ? metricDirectionLabel(trend.value) : ""));
const icon = computed(() => {
  if (trend.value === "up") return TrendingUpIcon;
  if (trend.value === "down") return TrendingDownIcon;
  return MinusIcon;
});
</script>

<template>
  <p
    v-if="visible && trend"
    data-slot="metric-delta"
    :data-trend="trend"
    :class="cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-xs', props.class)"
  >
    <span :class="cn('inline-flex items-center gap-1 font-medium tabular-nums', toneClass)">
      <component :is="icon" aria-hidden="true" class="size-3.5 shrink-0" />
      <span class="sr-only">{{ direction }}</span>
      <span>{{ text }}</span>
    </span>
    <span v-if="props.description || $slots.default" class="text-muted-foreground">
      <slot>{{ props.description }}</slot>
    </span>
  </p>
</template>
