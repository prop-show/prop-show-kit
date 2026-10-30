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

type Integration = { src: string; name: string; description: string; isInvertable?: boolean };
withDefaults(defineProps<{ integrations?: Integration[]; href?: string; actionLabel?: string }>(), {
  integrations: () => [
    {
      src: "https://storage.efferd.com/logo/vercel.svg",
      name: "Vercel",
      isInvertable: true,
      description: "Amet praesentium deserunt ex commodi tempore fuga....",
    },
    {
      src: "https://storage.efferd.com/logo/openai.svg",
      name: "OpenAI",
      isInvertable: true,
      description: "Amet praesentium deserunt ex commodi tempore fuga....",
    },
    {
      src: "https://storage.efferd.com/logo/supabase.svg",
      name: "Supabase",
      isInvertable: false,
      description: "Amet praesentium deserunt ex commodi tempore fuga....",
    },
    {
      src: "https://storage.efferd.com/logo/notion.svg",
      name: "Notion",
      isInvertable: false,
      description: "Amet praesentium deserunt ex commodi tempore fuga....",
    },
  ],
  href: "/",
  actionLabel: "View all integrations",
});
</script>

<template>
  <section
    class="mx-auto grid w-full max-w-5xl gap-1 overflow-hidden rounded-md bg-secondary p-1 sm:grid-cols-2 lg:grid-cols-4 dark:bg-secondary/50"
  >
    <div
      v-for="item in integrations"
      :key="item.name"
      class="relative flex min-w-0 flex-col justify-between gap-2 rounded-md bg-background p-6 shadow-sm"
    >
      <img
        :src="item.src"
        :alt="item.name"
        width="32"
        height="32"
        class="pointer-events-none size-8 shrink-0 object-contain select-none"
        :class="{ '[.dark_&]:[filter:invert(1)]': item.isInvertable }"
      />
      <div class="space-y-1">
        <h3 class="font-semibold">{{ item.name }}</h3>
        <p class="text-xs text-muted-foreground md:text-sm">{{ item.description }}</p>
      </div>
    </div>
    <div class="relative flex items-center justify-center p-1 sm:col-span-2 lg:col-span-4">
      <slot name="actions"
        ><Button as-child class="text-xs" size="sm" variant="link"
          ><a :href="href">{{ actionLabel }}<ArrowUpRight data-icon="inline-end" /></a></Button
      ></slot>
    </div>
  </section>
</template>
