<script setup lang="ts">
import type { PricingPlanProps } from "./index";

defineProps<Pick<PricingPlanProps, "price" | "discount" | "billingPeriod" | "billingCycle">>();
</script>

<template>
  <div
    v-if="price || discount || $slots.price || $slots.discount || $slots.billing"
    class="flex flex-wrap items-center gap-2"
  >
    <del v-if="discount" class="text-xl text-muted-foreground"
      ><slot name="discount">{{ price }}</slot></del
    >
    <span class="text-3xl font-semibold tracking-tight sm:text-4xl"
      ><slot name="price">{{ discount ?? price }}</slot></span
    >
    <div
      v-if="billingPeriod || billingCycle || $slots.billing"
      class="min-w-0 text-xs text-muted-foreground"
    >
      <slot name="billing"
        ><p v-if="billingPeriod" class="font-medium">{{ billingPeriod }}</p>
        <p v-if="billingCycle">{{ billingCycle }}</p></slot
      >
    </div>
  </div>
</template>
