<script setup lang="ts" generic="T = unknown">
import { computed } from "vue";

import { cn } from "@/lib/utils";

import type { Filter, FilterFieldsConfig } from "./filter-core";

import { filtersContainerVariants, getFieldsMap, useFilterContext } from "./filter-core";
import FilterChip from "./FilterChip.vue";

const props = defineProps<{
  fields: FilterFieldsConfig<T>;
}>();

const filters = defineModel<Filter<T>[]>({ required: true });
const context = useFilterContext();
const fieldsMap = computed(() => getFieldsMap(props.fields));

function updateFilter(filterId: string, updates: Partial<Filter<T>>) {
  filters.value = filters.value.map((filter) =>
    filter.id === filterId ? { ...filter, ...updates } : filter,
  );
}

function removeFilter(filterId: string) {
  filters.value = filters.value.filter((filter) => filter.id !== filterId);
}
</script>

<template>
  <div
    :class="
      cn(filtersContainerVariants({ variant: context.variant, size: context.size }), context.class)
    "
  >
    <template v-for="filter in filters" :key="filter.id">
      <FilterChip
        v-if="fieldsMap[filter.field]"
        :filter="filter"
        :field="fieldsMap[filter.field]!"
        @update="updateFilter(filter.id, $event)"
        @remove="removeFilter(filter.id)"
      />
    </template>
  </div>
</template>
