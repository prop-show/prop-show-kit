<script setup lang="ts">
import { ref, useId } from "vue";
import { LayerDialog } from "../../../ui/registry/layer-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const props = defineProps<{ variant?: "info" | "alert" }>();
const open = ref(false);
const pending = ref(false);
const message = ref("");
const formId = useId();
async function save() {
  pending.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  pending.value = false;
  open.value = false;
  message.value =
    props.variant === "alert" ? "Deployment deleted in this demo." : "Settings saved in this demo.";
}
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col items-center gap-3">
      <LayerDialog
        v-model:open="open"
        class="registry-preview not-prose"
        :title="
          variant === 'info'
            ? 'Keyboard shortcuts'
            : variant === 'alert'
              ? 'Delete deployment?'
              : 'Configure hostname'
        "
        :description="
          variant === 'info'
            ? 'Browse the shortcuts available in your workspace.'
            : variant === 'alert'
              ? 'This action cannot be undone.'
              : 'Route requests for this hostname to your application.'
        "
        :alert="variant === 'alert'"
        :action-label="
          variant === 'info'
            ? undefined
            : pending
              ? 'Working…'
              : variant === 'alert'
                ? 'Delete deployment'
                : 'Save hostname'
        "
        :action-variant="variant === 'alert' ? 'destructive' : 'default'"
        action-type="submit"
        :form="formId"
        :pending="pending"
      >
        <template #trigger
          ><Button variant="outline">{{
            variant === "info"
              ? "View shortcuts"
              : variant === "alert"
                ? "Delete deployment"
                : "Open settings"
          }}</Button></template
        >
        <ul v-if="variant === 'info'" class="m-0 divide-y divide-border p-0">
          <li
            v-for="(shortcut, index) in [
              'Search',
              'Open dashboard',
              'Create project',
              'View activity',
              'Open settings',
              'Switch workspace',
              'Open notifications',
              'Go back',
              'Go forward',
              'Help',
              'Toggle sidebar',
              'Close panel',
            ]"
            :key="shortcut"
            class="flex justify-between gap-4 py-5"
          >
            <span>{{ shortcut }}</span
            ><kbd class="rounded border px-2 text-xs">Alt {{ index + 1 }}</kbd>
          </li>
        </ul>
        <form v-else :id="formId" class="space-y-4" @submit.prevent="save">
          <p v-if="variant === 'alert'" class="m-0 text-muted-foreground">
            The deployment and its configuration will be removed. This preview does not delete real
            data.
          </p>
          <template v-else>
            <div class="space-y-2">
              <label :for="`${formId}-hostname`">Hostname</label
              ><Input
                :id="`${formId}-hostname`"
                name="hostname"
                default-value="api.example.com"
                required
                :disabled="pending"
              />
            </div>
            <div class="space-y-2">
              <label :for="`${formId}-name`">Display name</label
              ><Input
                :id="`${formId}-name`"
                name="name"
                default-value="Production API"
                required
                :disabled="pending"
              />
            </div>
          </template>
        </form>
      </LayerDialog>
      <p v-if="message" role="status" class="text-sm text-muted-foreground">{{ message }}</p>
    </div>
  </PreviewFrame>
</template>
