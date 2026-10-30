<script setup lang="ts">
import { ref } from "vue";
import type { PricingPlanProps } from "../../../ui/registry/pricing-plan";
import { PricingPlans } from "../../../ui/registry/pricing-plans";

const selection = ref("");
const plans: PricingPlanProps[] = [
  {
    title: "Starter",
    price: "$0",
    billingPeriod: "forever",
    features: ["3 projects", "Community support"],
    button: { label: "Choose Starter", variant: "outline", onClick: () => select("Starter") },
  },
  {
    title: "Pro",
    price: "$19",
    billingCycle: "per month",
    badge: "Popular",
    highlight: true,
    features: ["Unlimited projects", "Priority support"],
    button: { label: "Choose Pro", onClick: () => select("Pro") },
  },
];
function select(title: string) {
  selection.value = `${title} selected for this demo.`;
}
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-6">
      <PricingPlans :plans="plans">
        <template #terms="{ plan, index }">
          Option {{ index + 1 }}: {{ plan.title }}. Cancel any time.
        </template>
      </PricingPlans>
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
