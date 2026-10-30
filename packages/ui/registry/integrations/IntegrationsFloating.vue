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
      logo?: { src: string; alt: string; isInvertable?: boolean };
    }[];
  }>(),
  {
    title: "Seamless Integration",
    description:
      "Integrate with over 100+ tools and platforms to streamline your workflow and boost productivity.",
    href: "/",
    actionLabel: "",
    tiles: () => [
      { row: 0, col: 1 },
      {
        row: 0,
        col: 3,
        logo: { src: "https://storage.efferd.com/logo/notion.svg", alt: "Notion Logo" },
      },
      { row: 1, col: 0 },
      {
        row: 1,
        col: 2,
        logo: {
          src: "https://storage.efferd.com/logo/cursor.svg",
          alt: "Cursor Logo",
          isInvertable: true,
        },
      },
      {
        row: 1,
        col: 4,
        logo: {
          src: "https://storage.efferd.com/logo/vercel.svg",
          alt: "Vercel Logo",
          isInvertable: true,
        },
      },
      {
        row: 2,
        col: 1,
        logo: {
          src: "https://storage.efferd.com/logo/planetscale.svg",
          alt: "Planetscale Logo",
          isInvertable: true,
        },
      },
      {
        row: 2,
        col: 3,
        logo: { src: "https://storage.efferd.com/logo/gmail.svg", alt: "Gmail Logo" },
      },
      { row: 3, col: 0 },
      {
        row: 3,
        col: 2,
        logo: { src: "https://storage.efferd.com/logo/supabase.svg", alt: "Supabase Logo" },
      },
      {
        row: 3,
        col: 4,
        logo: { src: "https://storage.efferd.com/logo/canva.svg", alt: "Canva Logo" },
      },
      {
        row: 4,
        col: 1,
        logo: { src: "https://storage.efferd.com/logo/adobe.svg", alt: "Adobe Logo" },
      },
      {
        row: 4,
        col: 3,
        logo: { src: "https://storage.efferd.com/logo/polar.svg", alt: "Polar Logo" },
      },
    ],
  },
);
</script>

<template>
  <section
    class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 p-4 md:grid-cols-2 md:items-center"
  >
    <div class="min-w-0 max-w-xl space-y-5">
      <h2 class="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {{ title }}
      </h2>
      <p class="text-lg leading-8 text-muted-foreground">{{ description }}</p>
      <slot name="actions">
        <Button v-if="actionLabel" size="sm" as-child>
          <a :href="href">{{ actionLabel }}</a>
        </Button>
      </slot>
    </div>

    <div class="grid min-w-0 place-items-end">
      <div
        class="relative aspect-square w-full max-w-90 mask-[radial-gradient(ellipse_at_center,black,black,transparent)]"
      >
        <div
          v-for="tile in tiles"
          :key="`${tile.row}_${tile.col}`"
          class="absolute flex size-1/5 items-center justify-center rounded-md border"
          :class="
            tile.logo
              ? 'bg-card shadow-xs [.dark_&]:bg-card/60'
              : 'bg-secondary/30 [.dark_&]:bg-background'
          "
          :style="{ left: `${tile.col * 20}%`, top: `${tile.row * 20}%` }"
        >
          <img
            v-if="tile.logo"
            :src="tile.logo.src"
            :alt="tile.logo.alt"
            width="40"
            height="40"
            class="pointer-events-none size-8 object-contain p-1 select-none"
            :class="tile.logo.isInvertable && '[.dark_&]:[filter:invert(1)]'"
          />
        </div>
      </div>
    </div>
  </section>
</template>
