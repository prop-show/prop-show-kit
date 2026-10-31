<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";

import { computed, useId } from "vue";

import { cn } from "@/lib/utils";

import type { MetricTone, MetricTrend } from "./metric";

import MetricDelta from "./MetricDelta.vue";
import { formatMetricValue, hasMetricDelta } from "./metric";

const props = defineProps<{
  label: string;
  value: string | number;
  delta?: string | number;
  trend?: MetricTrend;
  tone?: MetricTone;
  description?: string;
  icon?: Component;
  class?: HTMLAttributes["class"];
}>();

const labelId = useId();
const formattedValue = computed(() => formatMetricValue(props.value));
const showDelta = computed(() => hasMetricDelta(props.delta));
</script>

<template>
  <article
    data-slot="metric-card"
    :aria-labelledby="labelId"
    :class="
      cn(
        'flex min-w-0 flex-col gap-3 rounded-xl bg-card p-4 text-card-foreground shadow-xs ring ring-border',
        props.class,
      )
    "
  >
    <div class="flex items-start justify-between gap-3">
      <p :id="labelId" class="min-w-0 text-sm font-medium text-muted-foreground">
        {{ props.label }}
      </p>
      <span
        v-if="props.icon || $slots.icon"
        aria-hidden="true"
        class="inline-flex shrink-0 text-muted-foreground [&_svg]:size-4"
      >
        <slot name="icon">
          <component :is="props.icon" />
        </slot>
      </span>
    </div>
    <p class="text-3xl font-semibold tracking-tight tabular-nums">
      <slot name="value">{{ formattedValue }}</slot>
    </p>
    <slot name="delta">
      <MetricDelta
        v-if="showDelta"
        :delta="props.delta"
        :trend="props.trend"
        :tone="props.tone"
        :description="props.description"
      />
      <p v-else-if="props.description" class="text-xs text-muted-foreground">
        {{ props.description }}
      </p>
    </slot>
  </article>
</template>
