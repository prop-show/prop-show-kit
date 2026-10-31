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
import { ArrowRightIcon, CreditCardIcon } from "@lucide/vue";
import { Button } from "@/components/ui/button";

withDefaults(
  defineProps<{
    title?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  }>(),
  {
    title: "Let your plans shape the future.",
    primaryLabel: "Get Started",
    secondaryLabel: "Contact Sales",
  },
);
const emit = defineEmits<{ contact: []; start: [] }>();
</script>

<template>
  <section
    class="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 rounded-4xl border bg-card px-4 py-8 shadow-sm md:py-10 dark:bg-card/50"
  >
    <div class="space-y-2">
      <h2 class="text-center text-lg font-semibold tracking-tight md:text-2xl">{{ title }}</h2>
      <p class="text-center text-sm text-balance text-muted-foreground md:text-base">
        Start your free trial today. No credit card
        <CreditCardIcon aria-hidden="true" class="inline-block size-4" />
        required.
      </p>
    </div>

    <div class="flex items-center justify-center gap-2">
      <slot name="actions">
        <Button type="button" class="shadow" variant="secondary" @click="emit('contact')">{{
          secondaryLabel
        }}</Button>
        <Button type="button" class="shadow" @click="emit('start')">
          {{ primaryLabel }}
          <ArrowRightIcon aria-hidden="true" class="size-4" />
        </Button>
      </slot>
    </div>
  </section>
</template>
