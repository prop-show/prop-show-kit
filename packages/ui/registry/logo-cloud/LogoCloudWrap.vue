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
      src: "https://storage.efferd.com/logo/vercel-wordmark.svg",
      alt: "Vercel Logo",
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
      src: "https://storage.efferd.com/logo/dub-wordmark.svg",
      alt: "Dub Logo",
    },
    {
      src: "https://storage.efferd.com/logo/turso-wordmark.svg",
      alt: "Turso Logo",
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
      src: "https://storage.efferd.com/logo/nvidia-wordmark.svg",
      alt: "Nvidia Logo",
    },
    {
      src: "https://storage.efferd.com/logo/clerk-wordmark.svg",
      alt: "Clerk Logo",
    },
    {
      src: "https://storage.efferd.com/logo/bolt-wordmark.svg",
      alt: "Bolt Logo",
    },
    {
      src: "https://storage.efferd.com/logo/stripe-wordmark.svg",
      alt: "Stripe Logo",
    },
  ],
});
</script>

<template>
  <div
    class="relative mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-8 py-6 sm:gap-x-12 sm:gap-y-12"
  >
    <img
      v-for="(logo, index) in logos"
      :key="index"
      :src="logo.src"
      :alt="logo.alt"
      loading="lazy"
      class="logo-cloud-image pointer-events-none h-5 w-fit max-w-full object-contain select-none"
    />
  </div>
</template>

<style scoped>
:global(.dark .logo-cloud-image) {
  filter: brightness(0) invert(1);
}
</style>
