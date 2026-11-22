<script setup lang="ts">
import { useId } from "vue";
import { Checkbox, CheckboxGroup } from "../../../ui/registry/ui-sdk/ui-sdk-checkbox";

const id = useId();
const preferences = [
  { value: "email", label: "Email updates" },
  { value: "digest", label: "Weekly digest" },
];
</script>

<template>
  <PreviewFrame>
    <CheckboxGroup
      aria-label="Notifications"
      name="notifications"
      :all-values="preferences.map((preference) => preference.value)"
      :default-value="['email']"
      class="grid w-full max-w-xs gap-2"
    >
      <label :for="`${id}-all`" class="flex items-center gap-2 pb-1 text-sm font-semibold">
        <Checkbox :id="`${id}-all`" parent />
        All notifications
      </label>
      <label
        v-for="preference in preferences"
        :key="preference.value"
        :for="`${id}-${preference.value}`"
        class="flex items-center gap-2 ps-5 text-sm"
      >
        <Checkbox :id="`${id}-${preference.value}`" :value="preference.value" />
        {{ preference.label }}
      </label>
    </CheckboxGroup>
  </PreviewFrame>
</template>
