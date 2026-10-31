<!--
MIT License

Copyright (c) 2026 SikandarJODD

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<script setup lang="ts">
import type { Component } from "vue";
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from "@lucide/vue";

withDefaults(
  defineProps<{
    features?: { title: string; description: string; icon: Component }[];
    title?: string;
    description?: string;
  }>(),
  {
    title: "Power. Speed. Control.",
    description: "Everything you need to build fast, secure, scalable apps.",
    features: () => [
      {
        title: "Faaast",
        icon: Zap,
        description: "It supports an entire helping developers and innovate.",
      },
      {
        title: "Powerful",
        icon: Cpu,
        description: "It supports an entire helping developers and businesses.",
      },
      {
        title: "Security",
        icon: Fingerprint,
        description: "It supports an helping developers businesses.",
      },
      {
        title: "Customization",
        icon: Pencil,
        description: "It supports helping developers and businesses innovate.",
      },
      {
        title: "Control",
        icon: Settings2,
        description: "It supports helping developers and businesses innovate.",
      },
      {
        title: "Built for AI",
        icon: Sparkles,
        description: "It supports helping developers and businesses innovate.",
      },
    ],
  },
);
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-8">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-2xl font-medium text-balance md:text-4xl lg:text-5xl">{{ title }}</h2>
      <p class="mt-4 text-sm text-balance text-muted-foreground md:text-base">{{ description }}</p>
    </div>
    <div class="overflow-hidden rounded-lg border">
      <div class="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="relative min-w-0 overflow-hidden bg-background p-6"
        >
          <div
            aria-hidden="true"
            class="feature-grid-pattern pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]"
          ></div>
          <component
            :is="feature.icon"
            aria-hidden="true"
            class="relative size-6 text-foreground/75"
          />
          <h3 class="relative mt-10 text-sm break-words md:text-base">{{ feature.title }}</h3>
          <p class="relative z-20 mt-2 text-xs font-light text-muted-foreground">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-grid-pattern {
  background-image:
    linear-gradient(
      to right,
      color-mix(in oklab, var(--foreground) 20%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      color-mix(in oklab, var(--foreground) 20%, transparent) 1px,
      transparent 1px
    );
  background-size: 40px 40px;
  background-position: 20px 0;
}
</style>
