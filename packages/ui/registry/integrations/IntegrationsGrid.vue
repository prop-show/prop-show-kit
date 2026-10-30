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
import { Plus } from "@lucide/vue";

type DecorPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type Integration = {
  src: string;
  name: string;
  description: string;
  isInvertable?: boolean;
  decorPosition?: DecorPosition;
};
withDefaults(defineProps<{ integrations?: Integration[] }>(), {
  integrations: () => [
    {
      src: "https://storage.efferd.com/logo/vercel.svg",
      name: "Vercel",
      isInvertable: true,
      description: "Amet praesentium deserunt ex commodi tempore fuga voluptatem....",
    },
    {
      src: "https://storage.efferd.com/logo/openai.svg",
      name: "OpenAI",
      isInvertable: true,
      description: "Amet praesentium deserunt ex commodi tempore fuga voluptatem....",
      decorPosition: "bottom-left",
    },
    {
      src: "https://storage.efferd.com/logo/supabase.svg",
      name: "Supabase",
      isInvertable: false,
      description: "Amet praesentium deserunt ex commodi tempore fuga voluptatem....",
    },
    {
      src: "https://storage.efferd.com/logo/github.svg",
      name: "GitHub",
      isInvertable: true,
      description: "Amet praesentium deserunt ex commodi tempore fuga voluptatem....",
    },
    {
      src: "https://storage.efferd.com/logo/notion.svg",
      name: "Notion",
      isInvertable: false,
      description: "Amet praesentium deserunt ex commodi tempore fuga voluptatem....",
    },
    {
      src: "https://storage.efferd.com/logo/gmail.svg",
      name: "Gmail",
      isInvertable: false,
      description: "Amet praesentium deserunt ex commodi tempore fuga voluptatem....",
      decorPosition: "top-left",
    },
  ],
});
const corners: Record<DecorPosition, string> = {
  "top-left": "-top-2 -left-2",
  "top-right": "-top-2 -right-2",
  "bottom-left": "-bottom-2 -left-2",
  "bottom-right": "-bottom-2 -right-2",
};
</script>

<template>
  <section class="relative mx-auto w-full max-w-5xl border">
    <div class="grid grid-cols-2 gap-px bg-border md:grid-cols-3">
      <div
        v-for="item in integrations"
        :key="item.name"
        class="relative flex min-w-0 flex-col items-start gap-4 bg-background p-4 text-start md:p-6 md:even:bg-background/75"
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
        <Plus
          v-if="item.decorPosition"
          aria-hidden="true"
          class="pointer-events-none absolute z-10 size-4"
          :class="corners[item.decorPosition]"
        />
      </div>
    </div>
    <Plus
      v-for="(position, corner) in corners"
      :key="corner"
      aria-hidden="true"
      class="pointer-events-none absolute z-10 size-4"
      :class="position"
    />
  </section>
</template>
