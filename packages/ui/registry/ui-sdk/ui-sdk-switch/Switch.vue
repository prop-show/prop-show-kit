<script setup lang="ts">
import { Switch as SwitchPrimitive, SwitchThumb } from "@ui-sdk/vue/switch";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    defaultValue?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    class?: HTMLAttributes["class"];
  }>(),
  { modelValue: undefined, defaultValue: undefined, defaultChecked: undefined },
);
const emit = defineEmits<{ "update:modelValue": [checked: boolean] }>();
</script>

<template>
  <SwitchPrimitive
    v-slot="slotProps"
    :model-value="props.modelValue"
    :default-checked="props.defaultChecked ?? props.defaultValue"
    :disabled="props.disabled"
    :name="props.name"
    :value="props.value"
    :class="
      cn(
        'peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none motion-safe:transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80',
        props.class,
      )
    "
    @update:model-value="emit('update:modelValue', $event)"
  >
    <SwitchThumb
      class="pointer-events-none block size-4 rounded-full bg-background ring-0 motion-safe:transition-transform data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground rtl:data-checked:-translate-x-[calc(100%-2px)]"
    >
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchPrimitive>
</template>
