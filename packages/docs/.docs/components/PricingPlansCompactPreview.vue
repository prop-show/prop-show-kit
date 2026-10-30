<script setup lang="ts">
import { ref } from "vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";
import { PricingPlans } from "../../../ui/registry/pricing-plans";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-6">
      <PricingPlans compact>
        <PricingPlan
          title="Starter"
          price="$0"
          variant="subtle"
          class="rounded-none"
          :features="['3 projects', 'Community support']"
          :button="{
            label: 'Choose Starter',
            variant: 'outline',
            onClick: () => (selection = 'Starter selected for this demo.'),
          }"
        />
        <PricingPlan
          title="Pro"
          price="$19"
          variant="subtle"
          class="rounded-none"
          highlight
          :features="['Unlimited projects', 'Priority support']"
          :button="{
            label: 'Choose Pro',
            onClick: () => (selection = 'Pro selected for this demo.'),
          }"
        />
      </PricingPlans>
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
