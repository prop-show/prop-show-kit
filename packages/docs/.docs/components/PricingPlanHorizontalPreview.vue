<script setup lang="ts">
import { ref } from "vue";
import { PricingPlan } from "../../../ui/registry/pricing-plan";

const selection = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-4">
      <PricingPlan
        title="Team"
        description="A shared workspace for your whole team."
        price="$99"
        billing-cycle="per workspace / month"
        orientation="horizontal"
        :features="['Unlimited members', 'Shared projects', 'Audit logs', 'Priority support']"
        tagline="Everything your team needs"
        :button="{
          label: 'Contact sales',
          onClick: () => (selection = 'Team selected for this demo.'),
        }"
        terms="No payment is collected in this demo."
      />
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
