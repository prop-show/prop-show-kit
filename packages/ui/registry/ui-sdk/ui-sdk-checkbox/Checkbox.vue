<script setup lang="ts">
import { CheckIcon, MinusIcon } from "@lucide/vue";
import {
  Checkbox as CheckboxPrimitive,
  CheckboxIndicator,
  type CheckedState,
} from "@ui-sdk/vue/checkbox";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue?: CheckedState;
    defaultChecked?: CheckedState;
    class?: HTMLAttributes["class"];
  }>(),
  { modelValue: undefined, defaultChecked: undefined },
);

const emit = defineEmits<{ "update:modelValue": [checked: CheckedState] }>();
</script>

<template>
  <CheckboxPrimitive
    :model-value="props.modelValue"
    :default-checked="props.defaultChecked"
    :class="
      cn(
        'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs outline-none motion-safe:transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-checked:bg-primary dark:data-indeterminate:bg-primary dark:aria-invalid:ring-destructive/40',
        props.class,
      )
    "
    @update:model-value="emit('update:modelValue', $event)"
  >
    <CheckboxIndicator v-slot="{ state }" class="grid place-content-center">
      <slot :checked="state.indeterminate ? 'indeterminate' : state.checked">
        <MinusIcon v-if="state.indeterminate" aria-hidden="true" class="size-3.5" />
        <CheckIcon v-else aria-hidden="true" class="size-3.5" />
      </slot>
    </CheckboxIndicator>
  </CheckboxPrimitive>
</template>
