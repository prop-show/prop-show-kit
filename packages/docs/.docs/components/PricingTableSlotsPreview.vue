<script setup lang="ts">
import { ref } from "vue";
import { CrownIcon, ShieldCheckIcon } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import {
  PricingTable,
  type PricingTableSection,
  type PricingTableTier,
} from "../../../ui/registry/pricing-table";

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
const sections: PricingTableSection<Tier>[] = [
  {
    id: "features",
    title: "Features",
    features: [
      {
        id: "developers",
        title: "Number of developers",
        tiers: { solo: 1, team: 5, enterprise: "Unlimited" },
      },
      { id: "projects", title: "Projects", tiers: { solo: true, team: true, enterprise: true } },
    ],
  },
  {
    id: "security",
    title: "Security",
    features: [{ title: "SSO", tiers: { solo: false, team: true, enterprise: true } }],
  },
];
</script>

<template>
  <PreviewFrame>
    <div class="w-full space-y-4">
      <PricingTable :tiers="tiers" :sections="sections" caption="Compare plans with custom labels">
        <template #team-title="{ tier }">
          <span class="flex items-center gap-2">
            <CrownIcon aria-hidden="true" class="size-4 shrink-0 text-amber-500" />
            {{ tier.title }}
          </span>
        </template>
        <template #section-security-title="{ section }">
          <span class="flex items-center gap-2">
            <ShieldCheckIcon aria-hidden="true" class="size-4 shrink-0 text-emerald-600" />
            {{ section.title }}
          </span>
        </template>
        <template #feature-developers-value="{ value }">
          <Badge variant="secondary">{{ value ?? "—" }}</Badge>
        </template>
      </PricingTable>
      <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">
        {{ selection || "Choose a plan to see selection feedback." }}
      </p>
    </div>
  </PreviewFrame>
</template>
