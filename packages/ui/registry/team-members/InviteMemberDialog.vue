<script setup lang="ts">
import { computed, shallowRef, useId, watch } from "vue";
import { UserPlusIcon } from "@lucide/vue";
import { LayerDialog } from "@/components/layer-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const props = defineProps<{ emails: string[] }>();
const emit = defineEmits<{ invite: [name: string, email: string] }>();
const formId = useId();
const open = shallowRef(false);
const name = shallowRef("");
const email = shallowRef("");
const error = computed(() =>
  props.emails.includes(email.value.trim().toLowerCase())
    ? "This person is already on the team."
    : "",
);
watch(open, () => {
  name.value = "";
  email.value = "";
});
function invite() {
  if (error.value || !name.value.trim() || !email.value.trim()) return;
  emit("invite", name.value.trim(), email.value.trim().toLowerCase());
  open.value = false;
}
</script>

<template>
  <LayerDialog
    v-model:open="open"
    title="Invite a teammate"
    description="Add someone to this example workspace. No email will be sent."
    action-label="Add teammate"
    action-type="submit"
    :form="formId"
    :action-disabled="!!error"
  >
    <template #trigger>
      <Button type="button"
        ><UserPlusIcon aria-hidden="true" class="size-4" />Invite teammate</Button
      >
    </template>
    <form :id="formId" class="space-y-4" @submit.prevent="invite">
      <div class="space-y-2">
        <label :for="`${formId}-name`" class="text-sm font-medium">Full name</label>
        <Input :id="`${formId}-name`" v-model="name" name="name" autocomplete="name" required />
      </div>
      <div class="space-y-2">
        <label :for="`${formId}-email`" class="text-sm font-medium">Email address</label>
        <Input
          :id="`${formId}-email`"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="!!error || undefined"
          :aria-describedby="error ? `${formId}-error` : undefined"
        />
        <p v-if="error" :id="`${formId}-error`" role="alert" class="text-sm text-destructive">
          {{ error }}
        </p>
      </div>
    </form>
  </LayerDialog>
</template>
