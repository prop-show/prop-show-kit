<script setup lang="ts">
import { ArrowRightIcon } from "@lucide/vue";
import { Button } from "@/components/ui/button";

withDefaults(
  defineProps<{
    title?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    description?: string;
  }>(),
  {
    title: "Plan the present. Build the future.",
    primaryLabel: "Get Started",
    secondaryLabel: "Contact Sales",
    description: "Start your journey today by clicking the button below.",
  },
);
const emit = defineEmits<{ contact: []; start: [] }>();
</script>

<template>
  <section class="relative mx-auto flex w-full max-w-3xl flex-col justify-between border-x">
    <span aria-hidden="true" class="pointer-events-none absolute inset-x-[-2rem] top-0 border-t" />

    <div class="border-b px-2 py-8">
      <h2 class="text-center text-lg font-semibold md:text-2xl">{{ title }}</h2>
      <p class="text-center text-sm text-balance text-muted-foreground md:text-base">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center justify-center gap-2 bg-secondary/80 p-4 dark:bg-secondary/40">
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

    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-[-2rem] bottom-0 border-t"
    />
  </section>
</template>
