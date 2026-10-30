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
import { ref } from "vue";

const paused = ref(false);
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
  <div class="w-full max-w-3xl">
    <div
      class="relative w-full max-w-3xl overflow-hidden border bg-linear-to-r from-secondary/50 via-transparent to-secondary/50 py-6"
    >
      <div
        class="logo-cloud-track flex gap-20 overflow-hidden p-2"
        style="--logo-cloud-duration: 30s"
      >
        <div
          v-for="copy in 2"
          :key="copy"
          :style="{ animationPlayState: paused ? 'paused' : undefined }"
          :aria-hidden="copy > 1 ? true : undefined"
          class="logo-cloud-group flex min-w-full shrink-0 items-center justify-around gap-8"
        >
          <img
            v-for="(logo, index) in logos"
            :key="index"
            :src="logo.src"
            :alt="copy === 1 ? logo.alt : ''"
            loading="lazy"
            class="logo-cloud-image pointer-events-none h-4 w-auto max-w-none shrink-0 select-none md:h-5"
          />
        </div>
      </div>
      <div
        v-for="direction in ['left', 'right'] as const"
        :key="direction"
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 w-[100px] md:w-[160px]"
        :class="direction === 'left' ? 'left-0' : 'right-0'"
      >
        <div
          v-for="layer in 8"
          :key="layer"
          class="absolute inset-0"
          :style="{
            maskImage: `linear-gradient(${direction === 'left' ? 270 : 90}deg, transparent ${((layer - 1) / 9) * 100}%, white ${(layer / 9) * 100}%, white ${((layer + 1) / 9) * 100}%, transparent ${((layer + 2) / 9) * 100}%)`,
            backdropFilter: `blur(${layer - 1}px)`,
            zIndex: (layer - 1) * 10,
          }"
        />
      </div>
    </div>
    <div v-if="logos.length" class="mt-2 flex justify-end">
      <button
        type="button"
        :aria-pressed="paused"
        class="logo-cloud-pause rounded-sm px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        @click="paused = !paused"
      >
        {{ paused ? "Resume logo animation" : "Pause logo animation" }}
      </button>
    </div>
  </div>
</template>
<style scoped>
:global(.dark .logo-cloud-image) {
  filter: brightness(0) invert(1);
}

.logo-cloud-group {
  animation: logo-cloud-scroll var(--logo-cloud-duration) linear infinite;
}
.logo-cloud-track:hover .logo-cloud-group {
  animation-play-state: paused;
}
@keyframes logo-cloud-scroll {
  to {
    transform: translateX(calc(-100% - 5rem));
  }
}
@media (prefers-reduced-motion: reduce) {
  .logo-cloud-pause {
    display: none;
  }
  .logo-cloud-track {
    overflow-x: auto;
  }
  .logo-cloud-group {
    animation: none;
  }
  .logo-cloud-group[aria-hidden="true"] {
    display: none;
  }
}
</style>
