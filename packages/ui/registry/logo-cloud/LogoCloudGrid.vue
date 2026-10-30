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
      src: "https://storage.efferd.com/logo/openai-wordmark.svg",
      alt: "OpenAI Logo",
    },
    {
      src: "https://storage.efferd.com/logo/turso-wordmark.svg",
      alt: "Turso Logo",
    },
    {
      src: "https://storage.efferd.com/logo/vercel-wordmark.svg",
      alt: "Vercel Logo",
    },
    {
      src: "https://storage.efferd.com/logo/github-wordmark.svg",
      alt: "GitHub Logo",
    },
    {
      src: "https://storage.efferd.com/logo/claude-wordmark.svg",
      alt: "Claude AI Logo",
    },
    {
      src: "https://storage.efferd.com/logo/clerk-wordmark.svg",
      alt: "Clerk Logo",
    },
  ],
});
</script>

<template>
  <div class="mx-auto grid w-full max-w-5xl grid-cols-2 rounded-lg bg-border shadow md:grid-cols-4">
    <div
      v-for="(logo, index) in logos"
      :key="index"
      class="flex min-w-0 items-center justify-center rounded-lg border bg-background p-8"
    >
      <img
        :src="logo.src"
        :alt="logo.alt"
        loading="lazy"
        class="logo-cloud-image pointer-events-none block h-4 max-w-full object-contain select-none md:h-5"
      />
    </div>
  </div>
</template>

<style scoped>
:global(.dark .logo-cloud-image) {
  filter: brightness(0) invert(1);
}
</style>
