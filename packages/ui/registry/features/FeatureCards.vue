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
import { LayoutDashboard, Terminal, ShieldCheck, FileText, Plus } from "@lucide/vue";

withDefaults(
  defineProps<{
    features?: { title: string; description: string; icon: Component }[];
    title?: string;
    description?: string;
  }>(),
  {
    title: "Build apps faster",
    description: "The complete platform for secure, scalable apps. You code, we handle the rest.",
    features: () => [
      {
        title: "Interactive Dashboard",
        icon: LayoutDashboard,
        description: "Visualize your data with drag-and-drop widgets.",
      },
      {
        title: "Instant API",
        icon: Terminal,
        description: "Auto-generate REST and GraphQL APIs instantly.",
      },
      {
        title: "Role-Based Access",
        icon: ShieldCheck,
        description: "Secure resources with granular permission controls.",
      },
      {
        title: "Audit Trails",
        icon: FileText,
        description: "Track every change with comprehensive logs.",
      },
    ],
  },
);
</script>

<template>
  <section
    class="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-12 px-4 py-12 md:px-8"
  >
    <div class="mx-auto max-w-2xl space-y-2 text-center">
      <h2 class="text-3xl font-medium tracking-tight text-balance md:text-5xl">{{ title }}</h2>
      <p class="text-sm leading-relaxed text-muted-foreground md:text-base">{{ description }}</p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="relative flex min-w-0 flex-col justify-between gap-6 bg-background px-6 pt-8 pb-6 shadow-xs dark:bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -inset-y-4 -left-px w-px bg-border"
        ></span>
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -inset-y-4 -right-px w-px bg-border"
        ></span>
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-4 -top-px h-px bg-border"
        ></span>
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-4 -bottom-px h-px bg-border"
        ></span>
        <Plus aria-hidden="true" class="pointer-events-none absolute -top-1.5 -left-1.5 size-3.5" />
        <div
          class="relative z-10 flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-3"
        >
          <component
            :is="feature.icon"
            aria-hidden="true"
            class="size-5 stroke-[1.5] text-foreground"
          />
        </div>
        <div class="relative z-10 space-y-2">
          <h3 class="text-base font-medium break-words text-foreground">{{ feature.title }}</h3>
          <p class="text-xs leading-relaxed text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
