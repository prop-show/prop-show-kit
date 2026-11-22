<script setup lang="ts">
import { Input as InputPrimitive } from "@ui-sdk/vue/input";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  modelValue?: string;
  defaultValue?: string;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <InputPrimitive
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :class="
      cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none motion-safe:transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        props.class,
      )
    "
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
