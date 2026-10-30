<script setup lang="ts">
import { CircleCheckIcon, MinusIcon } from "@lucide/vue";
import { cn } from "@/lib/utils";
import type { PricingTableFeatureValue } from "./index";

defineProps<{ value: PricingTableFeatureValue | undefined }>();
</script>

<template>
  <template v-if="typeof value === 'boolean'">
    <component
      :is="value ? CircleCheckIcon : MinusIcon"
      aria-hidden="true"
      :class="cn('size-5 shrink-0', value ? 'text-primary' : 'text-muted-foreground')"
    />
    <span class="sr-only">{{ value ? "Included" : "Not included" }}</span>
  </template>
  <template v-else>{{ value ?? "—" }}</template>
</template>
