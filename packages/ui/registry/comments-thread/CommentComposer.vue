<script setup lang="ts">
import { useId } from "vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const draft = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    submitLabel: string;
    cancelLabel?: string;
    showCancel?: boolean;
    autofocus?: boolean;
    disabled?: boolean;
    formId?: string;
  }>(),
  {
    placeholder: "",
    cancelLabel: "Cancel",
    showCancel: false,
    autofocus: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  submit: [body: string];
  cancel: [];
}>();

const fieldId = useId();

function submit() {
  const body = draft.value.trim();
  if (!body || props.disabled) return;
  emit("submit", body);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.showCancel) {
    event.preventDefault();
    emit("cancel");
    return;
  }
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    submit();
  }
}
</script>

<template>
  <form
    :id="formId"
    data-slot="comments-thread-composer"
    class="flex flex-col gap-2"
    @submit.prevent="submit"
  >
    <label class="text-sm font-medium" :class="showCancel ? '' : 'sr-only'" :for="fieldId">
      {{ label }}
    </label>
    <Textarea
      :id="fieldId"
      v-model="draft"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      class="min-h-16"
      @keydown="onKeydown"
    />
    <div class="flex justify-end gap-2">
      <Button v-if="showCancel" type="button" variant="ghost" size="sm" @click="emit('cancel')">
        {{ cancelLabel }}
      </Button>
      <Button type="submit" size="sm" :disabled="disabled || !draft.trim()">
        {{ submitLabel }}
      </Button>
    </div>
  </form>
</template>
