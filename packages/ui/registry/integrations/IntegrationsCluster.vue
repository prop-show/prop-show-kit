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
import { ArrowUpRight } from "@lucide/vue";
import { Button } from "@/components/ui/button";

type Integration = { src?: string; name: string; isInvertable?: boolean };
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    integrations?: Integration[];
    href?: string;
    actionLabel?: string;
  }>(),
  {
    title: "All types of integration",
    description: "Connect your favourite apps and services easily",
    integrations: () => [
      {
        name: "Empty 1",
      },
      {
        src: "https://storage.efferd.com/logo/vercel.svg",
        name: "Vercel",
        isInvertable: true,
      },
      {
        src: "https://storage.efferd.com/logo/openai.svg",
        name: "OpenAI",
        isInvertable: true,
      },
      {
        src: "https://storage.efferd.com/logo/supabase.svg",
        name: "Supabase",
        isInvertable: false,
      },
      {
        src: "https://storage.efferd.com/logo/github.svg",
        name: "GitHub",
        isInvertable: true,
      },
      {
        src: "https://storage.efferd.com/logo/notion.svg",
        name: "Notion",
        isInvertable: false,
      },
      {
        src: "https://storage.efferd.com/logo/gmail.svg",
        name: "Gmail",
        isInvertable: false,
      },
      {
        src: "https://storage.efferd.com/logo/google-maps.svg",
        name: "Google Maps",
        isInvertable: false,
      },
      {
        src: "https://storage.efferd.com/logo/neon.svg",
        name: "Neon",
        isInvertable: false,
      },
      {
        name: "Empty 2",
      },
    ],
    href: "/",
    actionLabel: "See all integrations",
  },
);
</script>

<template>
  <section class="flex w-full min-w-0 flex-col items-center justify-center gap-6 py-24">
    <div class="max-w-xl space-y-2 px-4 text-center">
      <h2 class="text-4xl font-semibold tracking-tight">{{ title }}</h2>
      <p class="text-base text-muted-foreground md:text-lg">{{ description }}</p>
    </div>
    <div class="w-fit max-w-full rounded-full border bg-secondary [.dark_&]:bg-secondary/10">
      <div
        class="flex items-center justify-center -space-x-1 p-1 mask-r-from-90% mask-l-from-90% sm:-space-x-3 md:-space-x-4"
      >
        <div
          v-for="item in integrations"
          :key="item.name"
          class="relative z-0 w-12 min-w-0 shrink motion-safe:transition-transform md:w-16"
          :class="{ 'hover:z-10 motion-safe:hover:scale-110': item.src }"
        >
          <div
            class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border bg-card shadow-sm"
          >
            <img
              v-if="item.src"
              :src="item.src"
              :alt="item.name"
              width="24"
              height="24"
              class="size-5 object-contain select-none md:size-6"
              :class="{ '[.dark_&]:[filter:invert(1)]': item.isInvertable }"
            />
          </div>
        </div>
      </div>
    </div>
    <slot name="actions"
      ><Button as-child class="rounded-full px-5"
        ><a :href="href">{{ actionLabel }}<ArrowUpRight data-icon="inline-end" /></a></Button
    ></slot>
  </section>
</template>
