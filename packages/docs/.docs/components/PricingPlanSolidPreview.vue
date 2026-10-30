<script setup lang="ts">
import { ref } from "vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full max-w-sm space-y-4">
      <PricingPlan
        title="Solid"
        description="For teams shipping their next product."
        price="$19"
        billing-cycle="per member / month"
        :features="['Unlimited projects', 'Priority support']"
        variant="solid"
        :button="{
          label: 'Choose Solid',
          variant: 'secondary',
          onClick: () => (selection = 'Solid selected for this demo.'),
        }"
        terms="No payment is collected in this demo."
      />
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
