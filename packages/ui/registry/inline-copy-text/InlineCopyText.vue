<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { CheckIcon, CopyIcon } from "@lucide/vue";
import { useClipboard } from "@vueuse/core";
import { computed, Text as TextVNode, useAttrs, useSlots } from "vue";

import { cn } from "@/lib/utils";

import type {
  InlineCopyTextElement,
  InlineCopyTextLabels,
  InlineCopyTextSize,
  InlineCopyTextVariant,
} from "./variants";

import {
  inlineCopyTextVariants,
  INLINE_COPY_TEXT_VARIANT_DEFAULT,
  isMonospaceVariant,
  resolveInlineCopyTextSize,
  resolveInlineCopyTextValue,
} from "./variants";

interface Props {
  labels?: InlineCopyTextLabels;
  value?: string;
  /** @default "mono-secondary" */
  variant?: InlineCopyTextVariant;
  size?: InlineCopyTextSize;
  bold?: boolean;
  /** @default true */
  truncate?: boolean;
  /** @default "span" */
  as?: InlineCopyTextElement;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  labels: () => ({}),
  variant: INLINE_COPY_TEXT_VARIANT_DEFAULT,
  truncate: true,
  as: "span",
});

defineOptions({ inheritAttrs: false });

const emit = defineEmits<{ click: [MouseEvent]; copy: [] }>();

const attrs = useAttrs();
const slots = useSlots();

/** String slot children are copied by default; rich content must pass `value`. */
const slotText = computed(() => {
  const nodes = slots.default?.() ?? [];
  const only = nodes[0];
  if (nodes.length === 1 && only?.type === TextVNode && typeof only.children === "string") {
    // Vue keeps the newline/indent boundary spaces that JSX strips, so trim
    // them to keep the copied value identical to the visible text.
    return only.children.trim();
  }
  return undefined;
});

const valueToCopy = computed(() => resolveInlineCopyTextValue(props.value, slotText.value));

/** `useClipboard` owns the write, feedback window and unsupported detection. */
const { copy, copied, isSupported } = useClipboard({ source: valueToCopy });

const copyActionLabel = computed(() => props.labels?.copyAction ?? "Copy to clipboard");
const copiedLabel = computed(() => props.labels?.copied ?? "Copied");
const unsupportedLabel = computed(() => props.labels?.unsupported ?? "Copy not supported");
const buttonLabel = computed(() => {
  if (copied.value) return copiedLabel.value;
  return isSupported.value ? copyActionLabel.value : unsupportedLabel.value;
});

/**
 * Read while rendering, so a rich slot without `value` fails fast like the
 * React original instead of silently copying an empty string.
 */
const liveMessage = computed(() => {
  // Reading the computed validates the copy value during render.
  void valueToCopy.value;
  if (copied.value) return copiedLabel.value;
  return isSupported.value ? "" : unsupportedLabel.value;
});

async function copyToClipboard() {
  await copy();
  if (copied.value) emit("copy");
}

function handleClick(event: MouseEvent) {
  emit("click", event);
  if (!event.defaultPrevented) void copyToClipboard();
}

const rootClass = computed(() =>
  cn(
    "group/inline-copy flex min-w-0 max-w-full cursor-pointer items-center gap-1 rounded-xs border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    props.class,
  ),
);

const textClass = computed(() =>
  cn(
    "text-foreground",
    inlineCopyTextVariants.variant[props.variant],
    resolveInlineCopyTextSize(props.variant, props.size),
    !isMonospaceVariant(props.variant) && props.bold ? "font-medium" : "",
    props.truncate && "min-w-0 truncate",
    props.variant === "mono-secondary"
      ? "group-hover/inline-copy:text-foreground group-focus-visible/inline-copy:text-foreground"
      : undefined,
  ),
);
</script>

<template>
  <button
    v-bind="attrs"
    type="button"
    data-slot="inline-copy-text"
    :class="rootClass"
    :aria-label="buttonLabel"
    @click="handleClick"
  >
    <component :is="as" :class="textClass"><slot /></component>
    <CheckIcon v-if="copied" :size="14" class="shrink-0" aria-hidden="true" />
    <CopyIcon
      v-else
      :size="14"
      class="shrink-0 opacity-0 transition-opacity motion-reduce:transition-none group-hover/inline-copy:opacity-100 group-focus-visible/inline-copy:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
      aria-hidden="true"
    />
    <span class="sr-only" aria-live="polite">{{ liveMessage }}</span>
  </button>
</template>
