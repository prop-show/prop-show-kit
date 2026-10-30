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
