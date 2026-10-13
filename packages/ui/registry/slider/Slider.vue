<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from "reka-ui";
import { computed, useId } from "vue";
import { cn } from "@/lib/utils";

interface Props extends Omit<SliderRootProps, "orientation" | "inverted" | "as" | "asChild"> {
  label?: string;
  size?: "sm" | "base";
  format?: Intl.NumberFormatOptions;
  locale?: string;
  getAriaLabel?: (index: number) => string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  size: "base",
});
const emits = defineEmits<SliderRootEmits>();
const delegatedProps = reactiveOmit(
  props,
  "class",
  "label",
  "size",
  "format",
  "locale",
  "getAriaLabel",
);
const forwarded = useForwardPropsEmits(delegatedProps, emits);
const labelId = useId();
const formatter = computed(() => new Intl.NumberFormat(props.locale, props.format));
</script>

<template>
  <div
    data-slot="slider"
    :dir="props.dir"
    :class="cn('w-full space-y-3 text-foreground', props.disabled && 'opacity-50', props.class)"
  >
    <div v-if="props.label" :id="labelId" class="text-sm font-medium">{{ props.label }}</div>
    <SliderRoot
      v-slot="{ modelValue }"
      v-bind="forwarded"
      :default-value="props.defaultValue ?? [props.min]"
      class="relative flex h-5 w-full touch-none items-center select-none data-disabled:pointer-events-none"
    >
      <SliderTrack
        :class="
          cn(
            'relative w-full grow overflow-hidden rounded-full bg-muted',
            props.size === 'sm' ? 'h-1' : 'h-1.5',
          )
        "
      >
        <SliderRange class="absolute h-full rounded-full bg-primary" />
      </SliderTrack>
      <SliderThumb
        v-for="(value, index) in modelValue"
        :key="index"
        :aria-label="props.getAriaLabel?.(index)"
        :aria-labelledby="!props.getAriaLabel && props.label ? labelId : undefined"
        :aria-valuetext="formatter.format(value)"
        :class="
          cn(
            'block shrink-0 rounded-full border border-border bg-background shadow-sm outline-none transition-shadow hover:ring-4 hover:ring-ring/20 focus-visible:ring-4 focus-visible:ring-ring/50',
            props.size === 'sm' ? 'size-3' : 'size-4',
          )
        "
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md border bg-background px-1.5 py-0.5 text-xs whitespace-nowrap text-foreground tabular-nums shadow-sm"
          >{{ formatter.format(value) }}</span
        >
      </SliderThumb>
    </SliderRoot>
    <div
      aria-hidden="true"
      class="flex justify-between pt-7 text-xs text-muted-foreground tabular-nums"
    >
      <span>{{ formatter.format(props.min) }}</span>
      <span>{{ formatter.format(props.max) }}</span>
    </div>
  </div>
</template>
