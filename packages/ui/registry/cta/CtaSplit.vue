<script setup lang="ts">
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
    class="relative mx-auto flex w-full max-w-3xl flex-col justify-between border-x md:flex-row"
  >
    <span aria-hidden="true" class="pointer-events-none absolute inset-x-[-2rem] top-0 border-t" />

    <div class="border-b p-4 md:border-b-0">
      <h2 class="text-center text-lg font-bold md:text-left md:text-2xl">{{ title }}</h2>
    </div>

    <div class="flex items-center justify-center gap-2 p-4 md:border-l">
      <slot name="actions">
        <Button type="button" variant="secondary" @click="emit('contact')">{{
          secondaryLabel
        }}</Button>
        <Button type="button" @click="emit('start')">{{ primaryLabel }}</Button>
      </slot>
    </div>

    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-[-2rem] bottom-0 border-t"
    />
  </section>
</template>
