<script setup lang="ts">
import { ref } from "vue";
import { SparklesIcon } from "@lucide/vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full max-w-sm space-y-4">
      <PricingPlan
        :as="{ root: 'article', title: 'h3' }"
        title="Pro"
        description="For teams shipping their next product."
        badge="Popular"
        price="$29"
        discount="$19"
        billing-cycle="per member / month"
        billing-period="Billed annually"
        :features="['Unlimited projects', { title: 'Priority support', icon: SparklesIcon }]"
        :button="{
          label: 'Choose Pro',
          onClick: () => (selection = 'Pro selected for this demo.'),
        }"
        terms="No payment is collected in this demo."
      />
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
