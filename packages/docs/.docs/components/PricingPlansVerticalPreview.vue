<script setup lang="ts">
import { ref } from "vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";
import { PricingPlans } from "../../../ui/registry/pricing-plans";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-6">
      <PricingPlans orientation="vertical">
        <PricingPlan
          title="Team"
          price="$99"
          orientation="horizontal"
          :features="['Unlimited projects', 'Priority support']"
          :button="{
            label: 'Choose Team',
            variant: 'outline',
            onClick: () => (selection = 'Team selected for this demo.'),
          }"
        />
        <PricingPlan
          title="Enterprise"
          price="Custom"
          orientation="horizontal"
          highlight
          :features="['Unlimited projects', 'Priority support']"
          :button="{
            label: 'Contact sales',
            onClick: () => (selection = 'Enterprise selected for this demo.'),
          }"
        />
      </PricingPlans>
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
