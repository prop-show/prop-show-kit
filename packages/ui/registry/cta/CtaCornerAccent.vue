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
import { ArrowRightIcon, PlusIcon } from "@lucide/vue";
import { Button } from "@/components/ui/button";

withDefaults(
  defineProps<{
    title?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    description?: string;
  }>(),
  {
    title: "Start for Free Today!",
    primaryLabel: "Get Started",
    secondaryLabel: "Contact Sales",
    description:
      "Begin your 6-day free trial today to fully explore and experience all the features and benefits we offer.",
  },
);
const emit = defineEmits<{ contact: []; start: [] }>();
</script>

<template>
  <section
    class="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-4 border-y px-4 py-8 dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)]"
  >
    <PlusIcon aria-hidden="true" class="pointer-events-none absolute z-10 size-4 -top-2 -left-2" />
    <PlusIcon aria-hidden="true" class="pointer-events-none absolute z-10 size-4 -top-2 -right-2" />
    <PlusIcon
      aria-hidden="true"
      class="pointer-events-none absolute z-10 size-4 -bottom-2 -left-2"
    />
    <PlusIcon
      aria-hidden="true"
      class="pointer-events-none absolute z-10 size-4 -bottom-2 -right-2"
    />

    <div class="pointer-events-none absolute -inset-y-6 -left-px w-px border-l"></div>
    <div class="pointer-events-none absolute -inset-y-6 -right-px w-px border-r"></div>

    <div class="absolute top-0 left-1/2 -z-10 h-full border-l border-dashed"></div>

    <h2 class="text-center text-xl font-semibold md:text-3xl">{{ title }}</h2>
    <p class="text-center text-sm font-medium text-balance text-muted-foreground md:text-base">
      {{ description }}
    </p>

    <div class="flex items-center justify-center gap-2">
      <slot name="actions">
        <Button type="button" variant="outline" @click="emit('contact')">{{
          secondaryLabel
        }}</Button>
        <Button type="button" @click="emit('start')">
          {{ primaryLabel }}
          <ArrowRightIcon aria-hidden="true" class="size-4" />
        </Button>
      </slot>
    </div>
  </section>
</template>
