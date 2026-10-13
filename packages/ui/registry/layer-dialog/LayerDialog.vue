<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { XIcon } from "@lucide/vue";
import {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "reka-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    alert?: boolean;
    actionLabel?: string;
    actionVariant?: "default" | "destructive";
    actionDisabled?: boolean;
    actionType?: "button" | "submit";
    form?: string;
    dismissLabel?: string;
    pending?: boolean;
  }>(),
  { actionVariant: "default", actionType: "button" },
);
const emit = defineEmits<{ action: [event: MouseEvent] }>();
const open = defineModel<boolean>("open", { default: false });
const scrolled = ref(false);
watch(open, () => {
  scrolled.value = false;
});
const dismissText = computed(() => props.dismissLabel ?? (props.alert ? "Cancel" : "Close"));
const close = () => {
  if (!props.pending) open.value = false;
};
</script>

<template>
  <component :is="alert ? AlertDialogRoot : DialogRoot" v-model:open="open">
    <component :is="alert ? AlertDialogTrigger : DialogTrigger" v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </component>
    <component :is="alert ? AlertDialogPortal : DialogPortal">
      <component
        :is="alert ? AlertDialogOverlay : DialogOverlay"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
      />
      <component
        :is="alert ? AlertDialogContent : DialogContent"
        v-bind="{ ...$attrs, ...(!description ? { 'aria-describedby': undefined } : {}) }"
        data-slot="layer-dialog"
        :aria-busy="pending || undefined"
        :class="
          cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[calc(100dvh-1rem)] flex-col gap-1 rounded-t-2xl border border-border bg-muted p-1 text-foreground shadow-xl outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100dvh-4rem)] sm:w-[calc(100%-4rem)] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
            $attrs.class as string,
          )
        "
        @escape-key-down="pending && $event.preventDefault()"
        @interact-outside="pending && $event.preventDefault()"
      >
        <div
          class="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background"
        >
          <header
            :class="cn('relative shrink-0 px-5 py-4', scrolled && 'shadow-[0_1px_0_var(--border)]')"
          >
            <component
              :is="alert ? AlertDialogTitle : DialogTitle"
              :class="
                cn(
                  'm-0 text-base font-semibold leading-6 [overflow-wrap:anywhere]',
                  !actionLabel && !alert && 'pr-9',
                )
              "
            >
              {{ title }}
            </component>
            <component
              :is="alert ? AlertDialogDescription : DialogDescription"
              v-if="description"
              :class="
                cn(
                  'm-0 text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]',
                  scrolled ? 'sr-only' : 'mt-1',
                )
              "
              >{{ description }}</component
            >
            <DialogClose v-if="!actionLabel && !alert" as-child>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                class="absolute right-3 top-3"
                :aria-label="dismissText"
                :disabled="pending"
              >
                <XIcon aria-hidden="true" class="size-4" />
              </Button>
            </DialogClose>
          </header>
          <div
            data-slot="layer-dialog-body"
            class="min-h-0 overflow-y-auto overscroll-contain px-5 pb-5 pt-2 text-sm [overflow-wrap:anywhere]"
            @scroll="scrolled = ($event.currentTarget as HTMLElement).scrollTop > 0"
          >
            <slot :close="close" />
          </div>
        </div>
        <footer
          v-if="actionLabel || alert"
          class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-border px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:border-0 sm:pb-3"
        >
          <component :is="alert ? AlertDialogCancel : DialogClose" as-child>
            <Button type="button" variant="ghost" :disabled="pending">{{ dismissText }}</Button>
          </component>
          <Button
            v-if="actionLabel"
            :type="actionType"
            :form="form"
            :variant="actionVariant"
            :disabled="actionDisabled || pending"
            @click="emit('action', $event)"
          >
            {{ actionLabel }}
          </Button>
        </footer>
      </component>
    </component>
  </component>
</template>
