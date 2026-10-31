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
        description: "Blazing fast performance with edge network optimizations.",
      },
      {
        title: "Secure by Design",
        icon: ShieldCheck,
        description: "Enterprise-grade security, zero configuration required.",
      },
      {
        title: "Real-time Sync",
        icon: Activity,
        description: "Real-time data sync across all devices efficiently.",
      },
      {
        title: "Global Scale",
        icon: Globe,
        description: "Instant global deployment to 35+ regions worldwide.",
      },
    ],
  },
);
</script>

<template>
  <section class="w-full overflow-hidden supports-[overflow:clip]:overflow-clip">
    <div class="mx-auto min-h-screen w-full max-w-5xl content-center border-x border-border py-4">
      <div class="relative grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -top-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
        ></span>
        <div
          v-for="feature in features"
          :key="feature.title"
          class="relative flex min-w-0 flex-col justify-between overflow-hidden bg-background p-4 md:p-6"
        >
          <div class="relative z-10 flex items-center pt-4 pb-6">
            <component :is="feature.icon" aria-hidden="true" class="size-5 text-primary" />
          </div>
          <div class="relative z-10 space-y-2">
            <h3 class="text-lg font-medium break-words text-foreground">{{ feature.title }}</h3>
            <p class="text-xs leading-relaxed text-muted-foreground">{{ feature.description }}</p>
          </div>
        </div>
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
        ></span>
      </div>
    </div>
  </section>
</template>
