import type { Component, HTMLAttributes } from "vue";
import type { ButtonVariants } from "@/components/ui/button";
import type { BadgeVariants } from "@/components/ui/badge";

export { default as PricingPlan } from "./PricingPlan.vue";

export interface PricingPlanFeature {
  title: string;
  icon?: Component;
}
export interface PricingPlanButton {
  label: string;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: MouseEvent) => void;
}
export interface PricingPlanBadge {
  label: string;
  variant?: BadgeVariants["variant"];
}
export interface PricingPlanProps {
  as?: string | { root?: string; title?: string };
  title?: string;
  description?: string;
  badge?: string | PricingPlanBadge;
  price?: string;
  discount?: string;
  billingCycle?: string;
  billingPeriod?: string;
  features?: (string | PricingPlanFeature)[];
  button?: PricingPlanButton;
  tagline?: string;
  terms?: string;
  orientation?: "vertical" | "horizontal";
  variant?: "outline" | "solid" | "soft" | "subtle";
  highlight?: boolean;
  scale?: boolean;
  class?: HTMLAttributes["class"];
}
