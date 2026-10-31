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
import { History, SquareDashed, Command, Plus } from "@lucide/vue";

withDefaults(
  defineProps<{
    features?: { title: string; description: string; icon: Component }[];
    title?: string;
  }>(),
  {
    title: "Ensuring your speedy workflow",
    features: () => [
      {
        title: "Auto-Save Everything",
        icon: History,
        description: "Write without worry, every time.",
      },
      {
        title: "Drag-and-Drop Blocks",
        icon: SquareDashed,
        description: "Rearrange sections with the block editor.",
      },
      {
        title: "Keyboard Shortcuts",
        icon: Command,
        description: "Speed up your workflow with quick keys.",
      },
    ],
  },
);
</script>

<template>
  <section class="mx-auto w-full max-w-5xl">
    <h2 class="mb-5 text-center text-2xl font-medium text-balance md:text-3xl">{{ title }}</h2>
    <div class="relative">
      <Plus
        v-for="corner in [
          '-top-3 -left-3',
          '-top-3 -right-3',
          '-bottom-3 -left-3',
          '-bottom-3 -right-3',
        ]"
        :key="corner"
        aria-hidden="true"
        class="pointer-events-none absolute size-6 stroke-border stroke-2"
        :class="corner"
      />
      <span
        aria-hidden="true"
        class="pointer-events-none absolute -top-px right-3 left-3 border-t border-dashed border-border"
      ></span>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute right-3 -bottom-px left-3 border-t border-dashed border-border"
      ></span>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute top-3 bottom-3 -left-px border-l border-dashed border-border"
      ></span>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute top-3 -right-px bottom-3 border-l border-dashed border-border"
      ></span>
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div v-for="feature in features" :key="feature.title" class="group relative min-w-0 p-8">
          <component
            :is="feature.icon"
            aria-hidden="true"
            class="size-7 mask-b-from-0% text-muted-foreground"
          />
          <h3 class="mt-4 text-lg font-medium break-words">{{ feature.title }}</h3>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ feature.description }}</p>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute right-5 bottom-0 left-5 border-b border-dashed border-border group-last:hidden md:top-5 md:right-0 md:bottom-5 md:left-auto md:border-b-0 md:border-l"
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>
