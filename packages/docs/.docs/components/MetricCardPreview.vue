<script setup lang="ts">
import type { Component } from "vue";

import { computed, shallowRef } from "vue";
import { BoxesIcon, GlobeIcon, TriangleAlertIcon } from "@lucide/vue";

import { Button } from "../ui/button";

import type { MetricTone, MetricTrend } from "../../../ui/registry/metric-card";

import { MetricCard, MetricCards } from "../../../ui/registry/metric-card";

type SampleMetric = {
  label: string;
  value: string;
  description: string;
  icon: Component;
  delta?: string;
  trend?: MetricTrend;
  tone?: MetricTone;
};

const period = shallowRef<"7d" | "30d">("7d");
const periods = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
] as const;
const summaries: Record<"7d" | "30d", SampleMetric[]> = {
  "7d": [
    {
      label: "Requests",
      value: "128.4k",
      delta: "+18.6%",
      description: "from last week",
      icon: GlobeIcon,
    },
    {
      label: "Error rate",
      value: "0.42%",
      delta: "-0.08%",
      trend: "down",
      tone: "positive",
      description: "from last week",
      icon: TriangleAlertIcon,
    },
    {
      label: "Active projects",
      value: "8",
      description: "Across 3 environments",
      icon: BoxesIcon,
    },
  ],
  "30d": [
    {
      label: "Requests",
      value: "542.8k",
      delta: "+24.2%",
      description: "from last month",
      icon: GlobeIcon,
    },
    {
      label: "Error rate",
      value: "0.31%",
      delta: "-0.19%",
      trend: "down",
      tone: "positive",
      description: "from last month",
      icon: TriangleAlertIcon,
    },
    {
      label: "Active projects",
      value: "12",
      description: "Across 3 environments",
      icon: BoxesIcon,
    },
  ],
};
const metrics = computed(() => summaries[period.value]);
</script>

<template>
  <PreviewFrame>
    <div class="w-full max-w-4xl space-y-4">
      <div role="group" aria-label="Reporting period" class="flex justify-end gap-1">
        <Button
          v-for="option in periods"
          :key="option.value"
          type="button"
          size="sm"
          :variant="period === option.value ? 'secondary' : 'ghost'"
          :aria-pressed="period === option.value"
          @click="period = option.value"
        >
          {{ option.label }}
        </Button>
      </div>
      <MetricCards label="Workspace metrics" aria-live="polite">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :delta="metric.delta"
          :trend="metric.trend"
          :tone="metric.tone"
          :description="metric.description"
        >
          <template #icon>
            <component :is="metric.icon" />
          </template>
        </MetricCard>
      </MetricCards>
    </div>
  </PreviewFrame>
</template>
