<script setup lang="ts">
import { Button as ButtonPrimitive, type ButtonActionDetails } from "@ui-sdk/vue/button";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariants } from "./index";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    focusableWhenDisabled?: boolean;
    pendingAnnouncement?: string;
    onClick?: (event: MouseEvent, details: ButtonActionDetails) => unknown;
  }>(),
  { variant: "default", size: "default" },
);
</script>

<template>
  <ButtonPrimitive
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
    :data-variant="props.variant"
    :data-size="props.size"
    :disabled="props.disabled"
    :focusable-when-disabled="props.focusableWhenDisabled"
    :pending-announcement="props.pendingAnnouncement"
    :type="props.type"
    :on-click="props.onClick"
  >
    <template v-if="$slots.render" #render="part"><slot name="render" v-bind="part" /></template>
    <template #default="part"><slot v-bind="part" /></template>
  </ButtonPrimitive>
</template>
