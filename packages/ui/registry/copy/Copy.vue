<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { CopyCheckIcon, CopyIcon } from "@lucide/vue";
import { useClipboard } from "@vueuse/core";
import { computed } from "vue";

import type { ButtonVariants } from "@/components/ui/button";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  content: string;
  size?: ButtonVariants["size"];
  variant?: ButtonVariants["variant"];
  class?: HTMLAttributes["class"];
  copyTooltipText?: string;
  copiedTooltipText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "default",
  variant: "outline",
  copyTooltipText: "Copy",
  copiedTooltipText: "Copied",
});

const source = computed(() => props.content);
const buttonSize = computed<ButtonVariants["size"]>(() => {
  if (props.size === "default") return "icon";
  if (props.size === "sm") return "icon-sm";
  if (props.size === "lg") return "icon-lg";
  return props.size;
});

const { copy, copied, copyPending, isSupported } = useClipboard({ source });

const buttonLabel = computed(() =>
  copied.value ? props.copiedTooltipText : props.copyTooltipText,
);
const tooltipText = computed(() => `${buttonLabel.value}: ${props.content}`);

async function handleCopy() {
  await copy();
}
</script>

<template>
  <TooltipProvider v-if="isSupported">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          type="button"
          :aria-label="buttonLabel"
          :disabled="copyPending"
          :variant="props.variant"
          :size="buttonSize"
          :class="props.class"
          @click="handleCopy"
        >
          <CopyIcon v-if="!copied" />
          <CopyCheckIcon v-else />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ tooltipText }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <span v-else role="status">Your browser does not support Clipboard API</span>
</template>
