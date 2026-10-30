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
import { Button } from "@/components/ui/button";

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    href?: string;
    actionLabel?: string;
    tiles?: {
      row: number;
      col: number;
      logo?: { src: string; alt: string };
    }[];
  }>(),
  {
    title: "Connect with your favorite tools",
    description: "Connect your favorite tools with our growing library of integrations.",
    href: "/",
    actionLabel: "Explore integrations",
    tiles: () => [
      {
        row: 0,
        col: 1,
        logo: { src: "https://storage.efferd.com/logo/vercel.svg", alt: "Vercel Logo" },
      },
      {
        row: 0,
        col: 3,
        logo: { src: "https://storage.efferd.com/logo/openai.svg", alt: "OpenAI Logo" },
      },
      { row: 1, col: 0 },
      {
        row: 1,
        col: 2,
        logo: { src: "https://storage.efferd.com/logo/cursor.svg", alt: "Cursor Logo" },
      },
      { row: 1, col: 4, logo: { src: "https://storage.efferd.com/logo/v0.svg", alt: "V0 Logo" } },
      {
        row: 2,
        col: 1,
        logo: { src: "https://storage.efferd.com/logo/planetscale.svg", alt: "Planetscale Logo" },
      },
      { row: 2, col: 3 },
      { row: 3, col: 0 },
      {
        row: 3,
        col: 2,
        logo: { src: "https://storage.efferd.com/logo/base-ui.svg", alt: "Base UI Logo" },
      },
      {
        row: 3,
        col: 4,
        logo: { src: "https://storage.efferd.com/logo/copilot.svg", alt: "Copilot Logo" },
      },
      {
        row: 4,
        col: 1,
        logo: { src: "https://storage.efferd.com/logo/github.svg", alt: "GitHub Logo" },
      },
      { row: 4, col: 3, logo: { src: "https://storage.efferd.com/logo/dub.svg", alt: "Dub Logo" } },
    ],
  },
);
</script>

<template>
  <section
    class="relative mx-auto grid w-full max-w-4xl grid-cols-1 gap-12 border-x md:grid-cols-2 md:items-center"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 -top-px border-t md:inset-x-[-2rem]"
    />

    <div class="min-w-0 p-4 md:p-6">
      <div class="space-y-4">
        <h2 class="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{{ title }}</h2>
        <p class="text-sm text-muted-foreground md:text-base">{{ description }}</p>
        <slot name="actions">
          <Button v-if="actionLabel" size="sm" as-child>
            <a :href="href">{{ actionLabel }}</a>
          </Button>
        </slot>
      </div>
    </div>

    <div class="grid min-w-0 place-items-end">
      <div class="relative aspect-square w-full max-w-80">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[20%_20%] mask-[radial-gradient(ellipse_at_center,black,black,transparent)]"
        />
        <div
          v-for="tile in tiles"
          :key="`${tile.row}_${tile.col}`"
          class="absolute flex size-1/5 items-center justify-center"
          :class="tile.logo && 'bg-secondary/40'"
          :style="{ left: `${tile.col * 20}%`, top: `${tile.row * 20}%` }"
        >
          <img
            v-if="tile.logo"
            :src="tile.logo.src"
            :alt="tile.logo.alt"
            width="40"
            height="40"
            class="pointer-events-none size-8 object-contain p-1 select-none [.dark_&]:[filter:invert(1)]"
          />
        </div>
      </div>
    </div>

    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 -bottom-px border-t md:inset-x-[-2rem]"
    />
  </section>
</template>
