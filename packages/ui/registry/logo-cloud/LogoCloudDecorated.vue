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

withDefaults(defineProps<{ logos?: { src: string; alt: string }[] }>(), {
  logos: () => [
    {
      src: "https://storage.efferd.com/logo/nvidia-wordmark.svg",
      alt: "Nvidia Logo",
    },
    {
      src: "https://storage.efferd.com/logo/supabase-wordmark.svg",
      alt: "Supabase Logo",
    },
    {
      src: "https://storage.efferd.com/logo/github-wordmark.svg",
      alt: "GitHub Logo",
    },
    {
      src: "https://storage.efferd.com/logo/openai-wordmark.svg",
      alt: "OpenAI Logo",
    },
    {
      src: "https://storage.efferd.com/logo/turso-wordmark.svg",
      alt: "Turso Logo",
    },
    {
      src: "https://storage.efferd.com/logo/clerk-wordmark.svg",
      alt: "Clerk Logo",
    },
    {
      src: "https://storage.efferd.com/logo/claude-wordmark.svg",
      alt: "Claude AI Logo",
    },
    {
      src: "https://storage.efferd.com/logo/vercel-wordmark.svg",
      alt: "Vercel Logo",
    },
  ],
});

function panelClasses(index: number, count: number, columns: number) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  return {
    right: column < columns - 1,
    bottom: row < Math.ceil(count / columns) - 1,
    shaded: (row + column) % 2 === 0,
    corner: column < columns - 1 && index + columns + 1 < count,
  };
}
</script>

<template>
  <div class="mx-auto grid w-full max-w-5xl grid-cols-2 border md:grid-cols-4">
    <div
      v-for="(logo, index) in logos"
      :key="index"
      class="relative flex min-w-0 items-center justify-center px-4 py-8 md:p-8"
      :class="{
        'border-r': panelClasses(index, logos.length, 2).right,
        'border-b': panelClasses(index, logos.length, 2).bottom,
        'md:border-r': panelClasses(index, logos.length, 4).right,
        'md:border-r-0': !panelClasses(index, logos.length, 4).right,
        'md:border-b': panelClasses(index, logos.length, 4).bottom,
        'md:border-b-0': !panelClasses(index, logos.length, 4).bottom,
      }"
      :data-shaded-mobile="panelClasses(index, logos.length, 2).shaded"
      :data-shaded-desktop="panelClasses(index, logos.length, 4).shaded"
    >
      <img
        :src="logo.src"
        :alt="logo.alt"
        loading="lazy"
        class="logo-cloud-image pointer-events-none h-4 max-w-full object-contain select-none md:h-5"
      />
      <Plus
        v-if="panelClasses(index, logos.length, 2).corner"
        aria-hidden="true"
        class="pointer-events-none absolute -right-2 -bottom-2 z-10 size-4 md:hidden"
      />
      <Plus
        v-if="panelClasses(index, logos.length, 4).corner"
        aria-hidden="true"
        class="pointer-events-none absolute -right-2 -bottom-2 z-10 hidden size-4 md:block"
      />
    </div>
  </div>
</template>

<style scoped>
[data-shaded-mobile] {
  background: var(--background);
}
[data-shaded-mobile="true"] {
  background: var(--logo-cloud-shade, var(--secondary));
}
[data-shaded-mobile] {
  --logo-cloud-shade: var(--secondary);
}
:global(.dark [data-shaded-mobile]) {
  --logo-cloud-shade: color-mix(in oklab, var(--secondary) 30%, transparent);
}
@media (min-width: 48rem) {
  [data-shaded-desktop] {
    background: var(--background);
  }
  [data-shaded-desktop="true"] {
    background: var(--logo-cloud-shade);
  }
}

:global(.dark .logo-cloud-image) {
  filter: brightness(0) invert(1);
}
</style>
