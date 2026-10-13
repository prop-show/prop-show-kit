<script setup lang="ts">
import { XIcon } from "@lucide/vue";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";
import Frame from "./Frame.vue";

defineOptions({ inheritAttrs: false });
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    closeLabel?: string;
    dismissible?: boolean;
  }>(),
  { closeLabel: "Close", dismissible: true },
);

const open = defineModel<boolean>("open", { default: false });
const close = () => {
  open.value = false;
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/40" />
      <DialogContent
        as-child
        v-bind="description ? {} : { 'aria-describedby': undefined }"
        @escape-key-down="!dismissible && $event.preventDefault()"
        @interact-outside="!dismissible && $event.preventDefault()"
      >
        <Frame
          v-bind="$attrs"
          class="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-background shadow-lg outline-none"
        >
          <DialogTitle class="sr-only">{{ title }}</DialogTitle>
          <DialogDescription v-if="description" class="sr-only">{{
            description
          }}</DialogDescription>
          <slot :close="close" />
          <DialogClose
            v-if="dismissible"
            :aria-label="closeLabel"
            class="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <XIcon aria-hidden="true" class="size-4" />
          </DialogClose>
        </Frame>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
