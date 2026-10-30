<script setup lang="ts">
import { ref } from "vue";
import { PricingTable, type PricingTableTier } from "../../../ui/registry/pricing-table";

type Tier = PricingTableTier & { id: "solo" | "team" | "enterprise" };
const selection = ref("");
const tiers: Tier[] = [
  {
    id: "solo",
    title: "Solo",
    description: "For indie hackers.",
    price: "$299",
    discount: "$249",
    billingCycle: "/month",
    billingPeriod: "billed monthly",
    badge: "Most popular",
    button: {
      label: "Buy now",
      variant: "secondary",
      onClick: () => (selection.value = "Solo selected for this demo."),
    },
  },
  {
    id: "team",
    title: "Team",
    description: "For growing teams.",
    price: "$599",
    discount: "$499",
    billingCycle: "/seat/month",
    billingPeriod: "billed annually",
    highlight: true,
    button: {
      label: "Buy now",
      onClick: () => (selection.value = "Team selected for this demo."),
    },
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "For large organizations.",
    price: "Custom",
    button: {
      label: "Contact sales",
      variant: "outline",
      onClick: () => (selection.value = "Enterprise sales selected for this demo."),
    },
  },
];
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-4">
      <PricingTable :tiers="tiers" caption="Compare discounts and billing terms" />
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
