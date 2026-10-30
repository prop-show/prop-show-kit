<script setup lang="ts" generic="T extends PricingTableTier">
import { createReusableTemplate } from "@vueuse/core";
import { useSlots } from "vue";
import TierHeader from "./PricingTableTier.vue";
import PricingTableFeatureValue from "./PricingTableFeatureValue.vue";
import { cn } from "@/lib/utils";
import type {
  PricingTableFeatureSlotProps,
  PricingTableFeatureValueSlotProps,
  PricingTableProps,
  PricingTableSectionSlotProps,
  PricingTableSlots,
  PricingTableTier,
} from "./index";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PricingTableProps<T>>(), {
  as: "div",
  caption: "Pricing plan comparison",
  sections: () => [],
});
defineSlots<PricingTableSlots<T>>();
const slots = useSlots();

const [DefineSectionTitle, SectionTitle] =
  createReusableTemplate<PricingTableSectionSlotProps<T>>();
const [DefineFeatureTitle, FeatureTitle] =
  createReusableTemplate<PricingTableFeatureSlotProps<T>>();
const [DefineFeatureValue, FeatureValue] = createReusableTemplate<{
  cell: PricingTableFeatureValueSlotProps<T>;
}>();

function itemId(item: { id?: string; title: string }) {
  return (
    item.id ??
    item.title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
  );
}
</script>

<template>
  <DefineSectionTitle v-slot="{ section }">
    <slot
      :name="
        (slots[`section-${itemId(section)}-title`]
          ? `section-${itemId(section)}-title`
          : 'section-title') as 'section-title'
      "
      :section="section"
    >
      {{ section.title }}
    </slot>
  </DefineSectionTitle>

  <DefineFeatureTitle v-slot="{ section, feature }">
    <slot
      :name="
        (slots[`feature-${itemId(feature)}-title`]
          ? `feature-${itemId(feature)}-title`
          : 'feature-title') as 'feature-title'
      "
      :section="section"
      :feature="feature"
    >
      {{ feature.title }}
    </slot>
  </DefineFeatureTitle>

  <DefineFeatureValue v-slot="{ cell: { section, feature, tier, value } }">
    <slot
      :name="
        (slots[`feature-${itemId(feature)}-value`]
          ? `feature-${itemId(feature)}-value`
          : 'feature-value') as 'feature-value'
      "
      :section="section"
      :feature="feature"
      :tier="tier"
      :value="value"
    >
      <PricingTableFeatureValue :value="value" />
    </slot>
  </DefineFeatureValue>

  <component
    :is="props.as"
    v-bind="$attrs"
    data-slot="pricing-table"
    :class="cn('relative w-full text-foreground', props.class)"
  >
    <div class="pricing-table-desktop">
      <table class="h-fit w-full table-fixed border-separate border-spacing-0">
        <caption class="sr-only">
          <slot name="caption">{{ props.caption }}</slot>
        </caption>
        <thead>
          <tr>
            <td />
            <th
              v-for="tier in props.tiers"
              :key="tier.id"
              scope="col"
              :data-highlight="tier.highlight || undefined"
              :class="
                cn(
                  'p-6 text-start align-top font-normal [overflow-wrap:anywhere]',
                  tier.highlight && 'rounded-t-lg border-x border-t bg-muted/50',
                )
              "
            >
              <TierHeader :tier="tier">
                <template v-for="name in Object.keys(slots)" :key="name" #[name]="scope">
                  <slot :name="name as 'tier'" v-bind="scope" />
                </template>
              </TierHeader>
            </th>
          </tr>
        </thead>
        <tbody v-for="(section, sectionIndex) in props.sections" :key="itemId(section)">
          <tr>
            <th scope="rowgroup" class="border-b py-4 pt-8 text-start text-sm font-semibold">
              <SectionTitle :section="section" />
            </th>
            <td
              v-for="tier in props.tiers"
              :key="tier.id"
              :data-highlight="tier.highlight || undefined"
              :class="
                cn(
                  'border-b px-6 py-4 pt-8',
                  tier.highlight && 'border-x bg-muted/50',
                  tier.highlight &&
                    !section.features.length &&
                    sectionIndex === props.sections.length - 1 &&
                    'rounded-b-lg',
                )
              "
            />
          </tr>
          <tr v-for="(feature, featureIndex) in section.features" :key="itemId(feature)">
            <th
              scope="row"
              class="border-b py-4 pr-4 text-start text-sm font-normal [overflow-wrap:anywhere]"
            >
              <FeatureTitle :section="section" :feature="feature" />
            </th>
            <td
              v-for="tier in props.tiers"
              :key="tier.id"
              :data-highlight="tier.highlight || undefined"
              :class="
                cn(
                  'border-b px-6 py-4 text-center text-sm text-muted-foreground',
                  tier.highlight && 'border-x bg-muted/50',
                  tier.highlight &&
                    sectionIndex === props.sections.length - 1 &&
                    featureIndex === section.features.length - 1 &&
                    'rounded-b-lg',
                )
              "
            >
              <div class="flex items-center justify-center gap-1 [overflow-wrap:anywhere]">
                <FeatureValue
                  :cell="{ section, feature, tier, value: feature.tiers[tier.id as T['id']] }"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="pricing-table-mobile flex w-full flex-col gap-6"
      role="group"
      :aria-label="props.caption"
    >
      <article
        v-for="tier in props.tiers"
        :key="tier.id"
        :aria-label="tier.title ?? tier.id"
        :class="
          cn(
            'min-w-0 rounded-lg border p-6 [overflow-wrap:anywhere]',
            tier.highlight && 'bg-muted/50',
          )
        "
      >
        <TierHeader :tier="tier">
          <template v-for="name in Object.keys(slots)" :key="name" #[name]="scope">
            <slot :name="name as 'tier'" v-bind="scope" />
          </template>
        </TierHeader>
        <section v-for="section in props.sections" :key="itemId(section)" class="mt-6 space-y-3">
          <h3 class="text-sm font-semibold">
            <SectionTitle :section="section" />
          </h3>
          <dl class="space-y-3">
            <div
              v-for="feature in section.features"
              :key="itemId(feature)"
              class="flex items-start justify-between gap-4 text-sm"
            >
              <dt class="min-w-0">
                <FeatureTitle :section="section" :feature="feature" />
              </dt>
              <dd
                class="flex min-w-5 items-center justify-end gap-1 text-end text-muted-foreground"
              >
                <FeatureValue
                  :cell="{ section, feature, tier, value: feature.tiers[tier.id as T['id']] }"
                />
              </dd>
            </div>
          </dl>
        </section>
      </article>
    </div>
  </component>
</template>

<style scoped>
[data-slot="pricing-table"] {
  container-type: inline-size;
}

.pricing-table-desktop {
  display: none;
}

/* Own table geometry even inside Markdown typography containers. */
[data-slot="pricing-table"] table {
  display: table;
  width: 100%;
  height: 1px;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  border: 0;
  margin: 0;
  overflow: visible;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

[data-slot="pricing-table"] :is(thead, tbody, tr) {
  border: 0;
  background: transparent;
}

[data-slot="pricing-table"] :is(th, td) {
  border: 0 solid var(--border);
  border-bottom-width: 1px;
  padding: 1rem 1.5rem;
  background: transparent;
  color: inherit;
  font-weight: 400;
  text-align: center;
  overflow-wrap: anywhere;
}

[data-slot="pricing-table"] thead :is(th, td) {
  height: 100%;
  border-bottom-width: 0;
  padding: 1.5rem;
  text-align: start;
  vertical-align: top;
}

[data-slot="pricing-table"] tbody th {
  padding-inline: 0 1rem;
  text-align: start;
}

[data-slot="pricing-table"] th[scope="rowgroup"] {
  font-weight: 600;
}

[data-slot="pricing-table"] tbody + tbody tr:first-child > * {
  padding-top: 2rem;
}

[data-slot="pricing-table"] [data-highlight="true"] {
  border-inline-width: 1px;
  background: color-mix(in oklab, var(--muted) 50%, transparent);
}

[data-slot="pricing-table"] thead [data-highlight="true"] {
  border-top-width: 1px;
  border-start-start-radius: var(--radius);
  border-start-end-radius: var(--radius);
}

[data-slot="pricing-table"] tbody:last-child tr:last-child [data-highlight="true"],
[data-slot="pricing-table"] table:not(:has(tbody)) thead [data-highlight="true"] {
  border-bottom-width: 1px;
  border-end-start-radius: var(--radius);
  border-end-end-radius: var(--radius);
}

[data-slot="pricing-table"] :is(h3, p, dl, dt, dd) {
  margin: 0;
}

[data-slot="pricing-table"] h3 {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
}

@container (min-width: 640px) {
  .pricing-table-desktop {
    display: block;
  }

  .pricing-table-mobile {
    display: none;
  }
}
</style>
