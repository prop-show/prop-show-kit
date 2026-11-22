<script setup lang="ts" generic="T">
import { CheckIcon } from "@lucide/vue";
import {
  SelectItem as SelectItemPrimitive,
  SelectItemIndicator,
  SelectItemText,
} from "@ui-sdk/vue/select";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  value: T;
  disabled?: boolean;
  textValue?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <SelectItemPrimitive
    :value="props.value"
    :disabled="props.disabled"
    :label="props.textValue"
    :class="
      cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm select-none outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 *:data-[slot=select-item-text]:flex *:data-[slot=select-item-text]:items-center *:data-[slot=select-item-text]:gap-2 [&_svg:not([class*=text-])]:text-muted-foreground [&_svg:not([class*=size-])]:size-4',
        props.class,
      )
    "
  >
    <span class="pointer-events-none absolute end-2 flex size-3.5 items-center justify-center">
      <SelectItemIndicator>
        <slot name="indicator-icon">
          <CheckIcon aria-hidden="true" class="size-4" />
        </slot>
      </SelectItemIndicator>
    </span>
    <SelectItemText><slot /></SelectItemText>
  </SelectItemPrimitive>
</template>
