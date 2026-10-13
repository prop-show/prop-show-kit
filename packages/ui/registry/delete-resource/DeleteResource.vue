<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { LoaderCircleIcon, TriangleAlertIcon } from "@lucide/vue";
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";
import { computed, ref, useId, watch } from "vue";
import { InlineCopyText } from "@/components/inline-copy-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { matchesResourceName } from "./confirmation";

defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    resourceType: string;
    resourceName: string;
    isDeleting?: boolean;
    caseSensitive?: boolean;
    deleteButtonText?: string;
    errorMessage?: string;
    class?: HTMLAttributes["class"];
  }>(),
  { isDeleting: false, caseSensitive: true },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ delete: [] }>();
const confirmation = ref("");
const inputId = useId();
const canDelete = computed(
  () =>
    !props.isDeleting &&
    matchesResourceName(confirmation.value, props.resourceName, props.caseSensitive),
);
watch(
  [open, () => props.resourceName, () => props.resourceType],
  () => {
    confirmation.value = "";
  },
  { flush: "sync" },
);
function updateOpen(value: boolean) {
  if (!props.isDeleting) open.value = value;
}
function submit() {
  if (open.value && canDelete.value) emit("delete");
}
</script>

<template>
  <DialogRoot :open="open" @update:open="updateOpen">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent
        v-bind="$attrs"
        :class="
          cn(
            'fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-xl border border-border bg-background p-6 text-foreground shadow-lg outline-none',
            props.class,
          )
        "
        @escape-key-down="props.isDeleting && $event.preventDefault()"
        @interact-outside="$event.preventDefault()"
      >
        <div class="flex items-start gap-3">
          <div class="rounded-full bg-destructive/10 p-2 text-destructive">
            <TriangleAlertIcon class="size-5" aria-hidden="true" />
          </div>
          <div class="min-w-0 space-y-2">
            <DialogTitle class="text-lg font-semibold">Delete {{ resourceType }}?</DialogTitle>
            <DialogDescription class="text-sm text-muted-foreground">
              <slot name="description"
                >This will permanently delete
                <strong class="break-all font-medium text-foreground">{{ resourceName }}</strong
                >. This action cannot be undone.</slot
              >
            </DialogDescription>
          </div>
        </div>
        <form class="grid gap-4" :aria-busy="isDeleting" @submit.prevent="submit">
          <div class="grid gap-2">
            <div class="flex flex-wrap items-baseline gap-x-1.5 text-sm">
              <label :for="inputId">Type</label>
              <InlineCopyText
                :value="resourceName"
                variant="body"
                size="sm"
                :truncate="false"
                class="break-all rounded-md bg-muted px-1.5 py-0.5 font-semibold [&_svg]:opacity-100"
                :labels="{
                  copyAction: `Copy ${resourceType} name`,
                  copied: `${resourceType} name copied`,
                }"
                >{{ resourceName }}</InlineCopyText
              >
              <label :for="inputId">to confirm.</label>
            </div>
            <Input
              :id="inputId"
              v-model="confirmation"
              :aria-label="`Type ${resourceName} to confirm.`"
              :disabled="isDeleting"
              autocomplete="off"
              autocapitalize="off"
              :spellcheck="false"
            />
          </div>
          <p v-if="errorMessage" role="alert" class="text-sm text-destructive">
            {{ errorMessage }}
          </p>
          <div class="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              :disabled="isDeleting"
              @click="updateOpen(false)"
              >Cancel</Button
            >
            <Button type="submit" variant="destructive" :disabled="!canDelete">
              <LoaderCircleIcon
                v-if="isDeleting"
                class="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              {{ isDeleting ? "Deleting…" : deleteButtonText || `Delete ${resourceType}` }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
