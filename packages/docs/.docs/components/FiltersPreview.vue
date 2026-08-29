<script setup lang="ts">
import { CircleCheckIcon, ClockIcon, MailIcon, StarIcon } from "@lucide/vue";
import { shallowRef } from "vue";

import type { Filter, FilterFieldConfig } from "../../../ui/registry/filters";

import { Filters } from "../../../ui/registry/filters";

const filters = shallowRef<Filter<string>[]>([
  {
    id: "initial-status",
    field: "status",
    operator: "is_any_of",
    values: ["active"],
  },
]);

const fields: FilterFieldConfig<string>[] = [
  {
    key: "status",
    label: "Status",
    icon: CircleCheckIcon,
    type: "multiselect",
    options: [
      { value: "active", label: "Active", icon: CircleCheckIcon },
      { value: "pending", label: "Pending", icon: ClockIcon },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    icon: StarIcon,
    type: "select",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  {
    key: "email",
    label: "Email",
    icon: MailIcon,
    type: "text",
    placeholder: "name@example.com",
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
  },
];
</script>

<template>
  <PreviewFrame>
    <Filters v-model="filters" :fields="fields" />
  </PreviewFrame>
</template>
