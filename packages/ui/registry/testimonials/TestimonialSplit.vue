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
  }>(),
  {
    quote: '"Svelte Efferd is so polished I might just retire. The ecosystem is in safe hands."',
    name: "Shadcn",
    role: "Founder, shadcn/ui",
    image: "https://github.com/shadcn.png",
  },
);
</script>

<template>
  <figure
    class="mx-auto flex w-full max-w-lg flex-col items-center justify-center md:grid md:grid-cols-[auto_1fr]"
  >
    <div class="relative">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-[-2rem] left-0 w-px bg-border mask-[linear-gradient(to_bottom,transparent,black,transparent)]"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-[-2rem] right-0 w-px bg-border mask-[linear-gradient(to_bottom,transparent,black,transparent)]"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-[-2rem] top-0 h-px bg-border mask-[linear-gradient(to_right,transparent,black,transparent)] md:w-xl"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-[-2rem] bottom-0 h-px bg-border mask-[linear-gradient(to_right,transparent,black,transparent)] md:w-xl"
      />

      <Avatar
        class="size-24 rounded-none mask-[radial-gradient(circle,black_60%,transparent)] *:rounded-none md:size-32"
      >
        <AvatarImage :alt="`${name}'s profile picture`" :src="image" />
        <AvatarFallback>{{ name.slice(0, 2).toUpperCase() }}</AvatarFallback>
      </Avatar>
    </div>
    <figcaption class="space-y-4 p-8 text-center md:p-6 md:text-left">
      <blockquote class="text-lg leading-tight tracking-tight text-muted-foreground">
        <slot name="quote" :quote="quote">
          <template
            v-if="
              quote ===
              '&quot;Svelte Efferd is so polished I might just retire. The ecosystem is in safe hands.&quot;'
            "
            >&quot;<span class="font-medium text-foreground">Svelte Efferd</span> is so polished I
            might just retire. The ecosystem is in safe hands.&quot;</template
          >
          <template v-else>{{ quote }}</template>
        </slot>
      </blockquote>
      <div>
        <cite class="text-xs font-medium text-foreground not-italic">{{ name }}</cite>
        <div class="text-[10px] text-muted-foreground">{{ role }}</div>
      </div>
    </figcaption>
  </figure>
</template>
