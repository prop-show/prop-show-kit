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
import { Zap, ShieldCheck, Activity, Globe } from "@lucide/vue";

withDefaults(
  defineProps<{ features?: { title: string; description: string; icon: Component }[] }>(),
  {
    features: () => [
      {
        title: "Lightning Fast",
        icon: Zap,
        description: "Blazing fast edge performance.",
      },
      {
        title: "Secure by Design",
        icon: ShieldCheck,
        description: "Security by design, zero config.",
      },
      {
        title: "Real-time Sync",
        icon: Activity,
        description: "Real-time sync across devices.",
      },
      {
        title: "Global Scale",
        icon: Globe,
        description: "Instant global deployment.",
      },
    ],
  },
);
</script>

<template>
  <section class="mx-auto grid w-full max-w-5xl grid-cols-2 gap-4 py-4 md:grid-cols-4">
    <div
      v-for="(feature, index) in features"
      :key="feature.title"
      class="relative flex min-w-0 flex-col items-center justify-center p-2 after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-linear-to-b after:from-foreground/6 after:via-foreground/25 after:to-foreground/6"
      :class="{
        'after:hidden': index === features.length - 1,
        'max-md:after:hidden': index % 2 === 1,
        'md:after:hidden': index % 4 === 3,
      }"
    >
      <component :is="feature.icon" aria-hidden="true" class="size-6 text-muted-foreground" />
      <h3 class="mt-4 text-center text-xs font-medium break-words md:text-sm lg:text-base">
        {{ feature.title }}
      </h3>
      <p class="mt-1 text-center text-[10px] text-muted-foreground md:text-xs">
        {{ feature.description }}
      </p>
    </div>
  </section>
</template>
