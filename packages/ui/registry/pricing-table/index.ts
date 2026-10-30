import type { Component, HTMLAttributes, VNode } from "vue";
import type { PricingPlanBadge, PricingPlanButton } from "@/components/pricing-plan";

export { default as PricingTable } from "./PricingTable.vue";

export interface PricingTableTier {
  id: string;
  title?: string;
  description?: string;
  badge?: string | PricingPlanBadge;
  billingCycle?: string;
  billingPeriod?: string;
  price?: string;
  discount?: string;
  button?: PricingPlanButton;
  highlight?: boolean;
}

export type PricingTableFeatureValue = string | number | boolean;

export interface PricingTableSectionFeature<T extends PricingTableTier = PricingTableTier> {
  id?: string;
  title: string;
  tiers: Partial<Record<T["id"], PricingTableFeatureValue>>;
}

export interface PricingTableSection<T extends PricingTableTier = PricingTableTier> {
  id?: string;
  title: string;
  features: PricingTableSectionFeature<T>[];
}

export interface PricingTableProps<T extends PricingTableTier = PricingTableTier> {
  tiers: T[];
  sections?: PricingTableSection<T>[];
  as?: string | Component;
  caption?: string;
  class?: HTMLAttributes["class"];
}

export type PricingTableTierSlot =
  | "title"
  | "description"
  | "badge"
  | "button"
  | "billing"
  | "discount"
  | "price";

export interface PricingTableTierSlotProps<T extends PricingTableTier = PricingTableTier> {
  tier: T;
}

export interface PricingTableSectionSlotProps<T extends PricingTableTier = PricingTableTier> {
  section: PricingTableSection<T>;
}

export interface PricingTableFeatureSlotProps<
  T extends PricingTableTier = PricingTableTier,
> extends PricingTableSectionSlotProps<T> {
  feature: PricingTableSectionFeature<T>;
}

export interface PricingTableFeatureValueSlotProps<T extends PricingTableTier = PricingTableTier>
  extends PricingTableFeatureSlotProps<T>, PricingTableTierSlotProps<T> {
  value: PricingTableFeatureValue | undefined;
}

type Slot<Props> = (props: Props) => VNode[];

type PricingTableNamedSlots<T extends PricingTableTier> = {
  caption?: Slot<Record<string, never>>;
  tier?: Slot<PricingTableTierSlotProps<T>>;
  "section-title"?: Slot<PricingTableSectionSlotProps<T>>;
  "feature-title"?: Slot<PricingTableFeatureSlotProps<T>>;
  "feature-value"?: Slot<PricingTableFeatureValueSlotProps<T>>;
} & Partial<Record<`tier-${PricingTableTierSlot}`, Slot<PricingTableTierSlotProps<T>>>> &
  Partial<Record<`section-${string}-title`, Slot<PricingTableSectionSlotProps<T>>>> &
  Partial<Record<`feature-${string}-title`, Slot<PricingTableFeatureSlotProps<T>>>> &
  Partial<Record<`feature-${string}-value`, Slot<PricingTableFeatureValueSlotProps<T>>>>;

export type PricingTableSlots<T extends PricingTableTier = PricingTableTier> =
  PricingTableNamedSlots<T> &
    Partial<
      Record<
        T["id"] | `${T["id"]}-${PricingTableTierSlot}`,
        string extends T["id"]
          ? PricingTableNamedSlots<T>[keyof PricingTableNamedSlots<T>]
          : Slot<PricingTableTierSlotProps<T>>
      >
    >;
