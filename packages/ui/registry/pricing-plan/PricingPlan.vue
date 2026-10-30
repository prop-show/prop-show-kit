<script setup lang="ts">
import { CheckIcon } from "@lucide/vue";
import { createReusableTemplate } from "@vueuse/core";
import PricingPlanPrice from "./PricingPlanPrice.vue";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PricingPlanProps } from "./index";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PricingPlanProps>(), {
  as: "div",
  orientation: "vertical",
  variant: "outline",
});
const badgeProps = computed(() =>
  typeof props.badge === "string" ? { label: props.badge } : props.badge,
);
const [DefinePrice, PlanPrice] = createReusableTemplate();
</script>

<template>
  <DefinePrice>
    <PricingPlanPrice
      :price="price"
      :discount="discount"
      :billing-period="billingPeriod"
      :billing-cycle="billingCycle"
    >
      <template
        v-for="name in (['price', 'discount', 'billing'] as const).filter((name) => $slots[name])"
        :key="name"
        #[name]
      >
        <slot :name="name" />
      </template>
    </PricingPlanPrice>
  </DefinePrice>
  <component
    :is="typeof as === 'string' ? as : (as.root ?? 'div')"
    v-bind="$attrs"
    data-slot="pricing-plan"
    :class="
      cn(
        'relative grid min-w-0 gap-6 rounded-lg p-6 text-foreground lg:p-8',
        orientation === 'horizontal' && 'lg:grid-cols-3',
        variant === 'outline' && 'border bg-background',
        variant === 'soft' && 'bg-muted/50',
        variant === 'subtle' && 'border bg-muted/50',
        variant === 'solid' &&
          'bg-foreground text-background [&_.text-muted-foreground]:text-background/70',
        highlight && 'ring-2 ring-inset ring-primary',
        scale && 'lg:z-10 lg:scale-110',
        props.class,
      )
    "
  >
    <div
      :class="
        cn(
          'flex min-w-0 flex-col',
          orientation === 'horizontal' && 'lg:col-span-2 lg:justify-center lg:border-e lg:pe-6',
        )
      "
    >
      <slot name="body">
        <div
          v-if="
            title ||
            description ||
            badge ||
            $slots.header ||
            $slots.title ||
            $slots.description ||
            $slots.badge
          "
        >
          <slot name="header">
            <div class="flex flex-wrap items-center gap-3">
              <component
                :is="typeof as === 'object' ? (as.title ?? 'div') : 'div'"
                v-if="title || $slots.title"
                data-slot="pricing-plan-title"
                class="text-2xl font-semibold tracking-tight sm:text-3xl"
                ><slot name="title">{{ title }}</slot></component
              >
              <slot name="badge"
                ><Badge v-if="badgeProps" :variant="badgeProps.variant ?? 'secondary'">{{
                  badgeProps.label
                }}</Badge></slot
              >
            </div>
            <p
              v-if="description || $slots.description"
              data-slot="pricing-plan-description"
              class="mt-2 text-base text-muted-foreground"
            >
              <slot name="description">{{ description }}</slot>
            </p>
          </slot>
        </div>
        <div v-if="orientation === 'vertical'" class="mt-6">
          <PlanPrice />
        </div>
        <div v-if="features?.length || $slots.features" class="mt-6">
          <slot name="features">
            <ul :class="cn('grid gap-3', orientation === 'horizontal' && 'lg:mt-6 lg:grid-cols-2')">
              <li
                v-for="(feature, index) in features"
                :key="index"
                class="flex min-w-0 items-start gap-2 text-sm text-muted-foreground"
              >
                <component
                  :is="typeof feature === 'string' ? CheckIcon : (feature.icon ?? CheckIcon)"
                  class="size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{{ typeof feature === "string" ? feature : feature.title }}</span>
              </li>
            </ul>
          </slot>
        </div>
      </slot>
    </div>
    <div
      :class="
        cn(
          'flex min-w-0 flex-col justify-end gap-6',
          orientation === 'horizontal' &&
            'border-t pt-6 lg:items-center lg:justify-center lg:border-0 lg:pt-0',
        )
      "
    >
      <slot name="footer">
        <p v-if="tagline || $slots.tagline" class="text-base font-semibold">
          <slot name="tagline">{{ tagline }}</slot>
        </p>
        <PlanPrice v-if="orientation === 'horizontal'" />
        <slot name="button">
          <Button
            v-if="button"
            v-bind="button"
            :as="button.href && !button.disabled ? 'a' : 'button'"
            :href="button.disabled ? undefined : button.href"
            :type="button.href && !button.disabled ? undefined : 'button'"
            :size="button.size ?? 'lg'"
            class="w-full"
            >{{ button.label }}</Button
          >
        </slot>
        <p v-if="terms || $slots.terms" class="text-center text-xs leading-5 text-muted-foreground">
          <slot name="terms">{{ terms }}</slot>
        </p>
      </slot>
    </div>
  </component>
</template>
