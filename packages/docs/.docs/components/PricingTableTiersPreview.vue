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
    price: "$249",
    billingCycle: "/month",
    billingPeriod: "billed annually",
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
    price: "$499",
    billingCycle: "/month",
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
      <PricingTable :tiers="tiers" caption="Compare pricing tiers" />
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
