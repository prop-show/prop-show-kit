<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from "reka-ui";
import { cn } from "@/lib/utils";

withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>(), {
  as: "div",
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="layer-card"
    :class="
      cn(
        'flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-xs ring ring-border [overflow-wrap:anywhere] has-[>[data-slot^=layer-card-]]:bg-muted has-[>[data-slot^=layer-card-]]:shadow-none',
        $props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
