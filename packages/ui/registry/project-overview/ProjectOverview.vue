<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { ArrowUpRightIcon, BoxesIcon, GitBranchIcon, GlobeIcon } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Frame, FrameDescription, FrameHeader, FramePanel, FrameTitle } from "@/components/frame";
import { StatusBadge } from "@/components/status-badge";

const period = shallowRef<"7d" | "30d">("7d");
const periods = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
] as const;
const summaries = {
  "7d": [
    { label: "Deployments", value: "24", detail: "+6 from last week", icon: GitBranchIcon },
    { label: "Requests", value: "128.4k", detail: "+18.6% from last week", icon: GlobeIcon },
    { label: "Active projects", value: "8", detail: "Across 3 environments", icon: BoxesIcon },
  ],
  "30d": [
    { label: "Deployments", value: "102", detail: "+22 from last month", icon: GitBranchIcon },
    { label: "Requests", value: "542.8k", detail: "+24.2% from last month", icon: GlobeIcon },
    { label: "Active projects", value: "12", detail: "Across 3 environments", icon: BoxesIcon },
  ],
};
const metrics = computed(() => summaries[period.value]);
const projects = [
  { name: "PropShow website", domain: "kit.prop.show", branch: "main", status: "Ready" },
  { name: "Customer dashboard", domain: "app.example.com", branch: "main", status: "Ready" },
  { name: "Documentation", domain: "docs.example.com", branch: "next", status: "Building" },
];
</script>

<template>
  <section aria-label="Project overview" class="w-full max-w-5xl space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Workspace</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight">Project overview</h2>
        <p class="mt-1 text-sm text-muted-foreground">A little clarity for everything you ship.</p>
      </div>
      <div role="group" aria-label="Reporting period" class="flex gap-1 rounded-lg border p-1">
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
    </header>

    <div aria-live="polite" class="grid gap-3 sm:grid-cols-3">
      <Frame v-for="metric in metrics" :key="metric.label">
        <FramePanel class="space-y-4">
          <div class="flex items-center justify-between gap-2 text-muted-foreground">
            <span class="text-sm">{{ metric.label }}</span>
            <component :is="metric.icon" aria-hidden="true" class="size-4 shrink-0" />
          </div>
          <p class="text-3xl font-semibold tracking-tight">{{ metric.value }}</p>
          <p class="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUpRightIcon aria-hidden="true" class="size-3.5 shrink-0" />
            {{ metric.detail }}
          </p>
        </FramePanel>
      </Frame>
    </div>

    <Frame>
      <FrameHeader>
        <FrameTitle>Recent projects</FrameTitle>
        <FrameDescription>Your latest production and preview deployments.</FrameDescription>
      </FrameHeader>
      <FramePanel class="py-0">
        <ul class="divide-y divide-border">
          <li
            v-for="project in projects"
            :key="project.name"
            class="flex flex-wrap items-center gap-3 py-4"
          >
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted"
            >
              <BoxesIcon aria-hidden="true" class="size-4" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium">{{ project.name }}</p>
              <p class="break-all text-xs text-muted-foreground">{{ project.domain }}</p>
            </div>
            <span class="flex items-center gap-1 text-xs text-muted-foreground">
              <GitBranchIcon aria-hidden="true" class="size-3.5" />{{ project.branch }}
            </span>
            <StatusBadge variant="outline" :color="project.status === 'Ready' ? 'green' : 'orange'">
              {{ project.status }}
            </StatusBadge>
          </li>
        </ul>
      </FramePanel>
    </Frame>
  </section>
</template>
