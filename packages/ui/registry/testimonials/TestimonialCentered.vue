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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

withDefaults(
  defineProps<{
    quote?: string;
    name?: string;
    role?: string;
    image?: string;
    company?: string;
  }>(),
  {
    quote: '"Svelte Efferd is tooo good."',
    name: "Guillermo Rauch",
    role: "CEO, Vercel",
    image: "https://github.com/rauchg.png",
    company: "Vercel",
  },
);
</script>

<template>
  <figure class="mx-auto flex w-full max-w-lg flex-col items-center justify-center">
    <div class="mb-8 flex items-center gap-1">
      <slot name="company" :company="company">
        <svg
          v-if="company === 'Vercel'"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 256 222"
          aria-hidden="true"
          class="size-6"
        >
          <path d="m128 0 128 221.705H0z" fill="currentColor" />
        </svg>
        <span class="text-lg font-medium">{{ company }}</span>
      </slot>
    </div>

    <blockquote class="text-center text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl">
      <slot name="quote" :quote="quote">
        <template v-if="quote === '&quot;Svelte Efferd is tooo good.&quot;'"
          >&quot;<span class="font-medium">Svelte Efferd</span> is tooo good.&quot;</template
        >
        <template v-else>{{ quote }}</template>
      </slot>
    </blockquote>

    <div
      aria-hidden="true"
      class="mx-auto my-5 h-px w-full max-w-sm bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]"
    />

    <figcaption class="flex flex-col items-center gap-5">
      <div class="space-y-0.5 text-center">
        <cite class="text-xl font-medium text-foreground not-italic">{{ name }}</cite>
        <div class="text-lg text-muted-foreground">{{ role }}</div>
      </div>
      <Avatar class="size-12 rounded-full border object-cover">
        <AvatarImage :alt="`${name}'s profile picture`" :src="image" />
        <AvatarFallback>{{
          name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
        }}</AvatarFallback>
      </Avatar>
    </figcaption>
  </figure>
</template>
