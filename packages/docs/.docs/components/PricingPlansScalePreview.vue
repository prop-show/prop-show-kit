<script setup lang="ts">
import { ref } from "vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";
import { PricingPlans } from "../../../ui/registry/pricing-plans";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-6">
      <div class="px-6 py-8">
        <PricingPlans scale>
          <PricingPlan
            title="Starter"
            price="$0"
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
            highlight
            scale
            :features="['Unlimited projects', 'Priority support']"
            :button="{
              label: 'Choose Pro',
              onClick: () => (selection = 'Pro selected for this demo.'),
            }"
          />
        </PricingPlans>
      </div>
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
