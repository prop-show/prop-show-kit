<script setup lang="ts" generic="T extends PricingTableTier">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VNode } from "vue";
import type { PricingTableTier, PricingTableTierSlot, PricingTableTierSlotProps } from "./index";

defineProps<PricingTableTierSlotProps<T>>();
const slots =
  defineSlots<Partial<Record<string, (props: PricingTableTierSlotProps<T>) => VNode[]>>>();

function tierSlotName(tier: T, name: PricingTableTierSlot) {
  return slots[`${tier.id}-${name}`] ? `${tier.id}-${name}` : `tier-${name}`;
}
</script>

<template>
  <div data-slot="pricing-table-tier" class="pricing-table-tier">
    <slot :name="slots[tier.id] ? tier.id : 'tier'" :tier="tier">
      <div class="pricing-table-tier-title-wrapper">
        <div data-slot="pricing-table-tier-title">
          <slot :name="tierSlotName(tier, 'title')" :tier="tier">{{ tier.title }}</slot>
        </div>
        <slot :name="tierSlotName(tier, 'badge')" :tier="tier">
          <Badge
            v-if="tier.badge"
            :variant="
              typeof tier.badge === 'string' ? 'secondary' : (tier.badge.variant ?? 'secondary')
            "
            class="truncate"
            >{{ typeof tier.badge === "string" ? tier.badge : tier.badge.label }}</Badge
          >
        </slot>
      </div>
      <div data-slot="pricing-table-tier-description">
        <slot :name="tierSlotName(tier, 'description')" :tier="tier">{{ tier.description }}</slot>
      </div>
      <div class="pricing-table-tier-price-wrapper">
        <del
          v-if="
            (tier.discount != null && tier.price != null) || slots[tierSlotName(tier, 'discount')]
          "
          data-slot="pricing-table-tier-discount"
          ><slot :name="tierSlotName(tier, 'discount')" :tier="tier">{{ tier.price }}</slot></del
        >
        <span
          v-if="tier.discount != null || tier.price != null || slots[tierSlotName(tier, 'price')]"
          data-slot="pricing-table-tier-price"
          ><slot :name="tierSlotName(tier, 'price')" :tier="tier">{{
            tier.discount ?? tier.price
          }}</slot></span
        >
        <div
          v-if="tier.billingCycle || tier.billingPeriod || slots[tierSlotName(tier, 'billing')]"
          class="pricing-table-tier-billing"
        >
          <slot :name="tierSlotName(tier, 'billing')" :tier="tier">
            <span class="font-medium">{{ tier.billingPeriod || "\u00a0" }}</span>
            <span v-if="tier.billingCycle">{{ tier.billingCycle }}</span>
          </slot>
        </div>
      </div>
      <div
        v-if="tier.button || slots[tierSlotName(tier, 'button')]"
        class="pricing-table-tier-button"
      >
        <slot :name="tierSlotName(tier, 'button')" :tier="tier">
          <Button
            v-if="tier.button"
            v-bind="tier.button"
            :as="tier.button.href && !tier.button.disabled ? 'a' : 'button'"
            :href="tier.button.disabled ? undefined : tier.button.href"
            :type="tier.button.href && !tier.button.disabled ? undefined : 'button'"
            :size="tier.button.size ?? 'lg'"
            class="w-full"
            >{{ tier.button.label }}</Button
          >
        </slot>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.pricing-table-tier {
  display: flex;
  min-width: 0;
  flex-direction: column;
  text-align: start;
}

.pricing-table-tier-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

[data-slot="pricing-table-tier-title"] {
  min-width: 0;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
}

[data-slot="pricing-table-tier-description"] {
  margin-top: 0.25rem;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
}

.pricing-table-tier-price-wrapper {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
}

[data-slot="pricing-table-tier-price"] {
  flex-shrink: 0;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 600;
}

.pricing-table-tier-price-wrapper:has([data-slot="pricing-table-tier-discount"]) {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
}

[data-slot="pricing-table-tier-discount"] {
  grid-column: 1 / -1;
  white-space: nowrap;
  color: var(--muted-foreground);
  font-size: 1.5rem;
  line-height: 2rem;
  text-decoration: line-through;
}

.pricing-table-tier-billing {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  line-height: 1rem;
}

.pricing-table-tier-billing > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pricing-table-tier-button {
  margin-top: 1.5rem;
}

@container (min-width: 640px) {
  .pricing-table-tier {
    height: 100%;
  }

  [data-slot="pricing-table-tier-description"] {
    flex: 1;
  }

  .pricing-table-tier-button {
    margin-top: auto;
    padding-top: 1.5rem;
  }
}
</style>
