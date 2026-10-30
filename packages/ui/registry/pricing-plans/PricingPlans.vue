<script setup lang="ts">
import type { HTMLAttributes, VNode } from "vue";
import { Comment, Fragment, Text } from "vue";
import { PricingPlan } from "@/components/pricing-plan";
import type { PricingPlanProps } from "@/components/pricing-plan";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    as?: string;
    plans?: PricingPlanProps[];
    orientation?: "horizontal" | "vertical";
    compact?: boolean;
    scale?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { as: "div", orientation: "horizontal" },
);

function countPlans(nodes: VNode[]): number | undefined {
  // Only comments and empty fragments trigger Vue's slot fallback; text is valid content.
  let count: number | undefined;
  for (const node of nodes) {
    if (node.type === Comment) continue;
    const childCount =
      node.type === Fragment ? countPlans(node.children as VNode[]) : node.type === Text ? 0 : 1;
    if (childCount !== undefined) count = (count ?? 0) + childCount;
  }
  return count;
}
</script>

<template>
  <component
    :is="as"
    data-slot="pricing-plans"
    :style="{
      '--count': Math.max(1, countPlans($slots.default?.() ?? []) ?? plans?.length ?? 0),
    }"
    :class="
      cn(
        'flex min-w-0 flex-col gap-y-8',
        orientation === 'horizontal' && 'lg:grid lg:grid-cols-[repeat(var(--count),minmax(0,1fr))]',
        !compact && (scale ? 'gap-x-13' : 'gap-x-8'),
        props.class,
      )
    "
  >
    <slot>
      <PricingPlan
        v-for="(plan, index) in plans"
        :key="index"
        :orientation="orientation === 'horizontal' ? 'vertical' : 'horizontal'"
        v-bind="plan"
      >
        <template
          v-for="name in Object.keys($slots).filter((name) => name !== 'default')"
          :key="name"
          #[name]="scope"
          ><slot :name="name" v-bind="scope" :plan="plan" :index="index"
        /></template>
      </PricingPlan>
    </slot>
  </component>
</template>
