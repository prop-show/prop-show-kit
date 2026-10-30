<script setup lang="ts">
import { ref } from "vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";
import { PricingPlans } from "../../../ui/registry/pricing-plans";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-6">
      <PricingPlans>
        <PricingPlan
          title="Starter"
          price="$0"
          :features="['3 projects']"
          :button="{
            label: 'Start building',
            variant: 'outline',
            onClick: () => (selection = 'Starter selected for this demo.'),
          }"
        />
        <PricingPlan
          title="Enterprise"
          price="Custom"
          highlight
          :button="{
            label: 'Contact sales',
            onClick: () => (selection = 'Enterprise selected for this demo.'),
          }"
        >
          <template #features>
            <p class="text-sm text-muted-foreground">
              Dedicated onboarding and a custom agreement.
            </p>
          </template>
          <template #terms>Talk to our sales team about a custom plan.</template>
        </PricingPlan>
      </PricingPlans>
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
