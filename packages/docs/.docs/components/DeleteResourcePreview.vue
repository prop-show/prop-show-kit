<script setup lang="ts">
import { ref } from "vue";
import { DeleteResource } from "../../../ui/registry/delete-resource";
import { Button } from "@/components/ui/button";

const props = defineProps<{ variant?: "error" }>();
const open = ref(false);
const isDeleting = ref(false);
const errorMessage = ref("");
const deleted = ref(false);
async function handleDelete() {
  isDeleting.value = true;
  errorMessage.value = "";
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (props.variant === "error") {
      errorMessage.value = "Unable to delete this zone. Please try again.";
      return;
    }
    open.value = false;
    deleted.value = true;
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col items-center gap-3">
      <DeleteResource
        v-model:open="open"
        resource-type="Zone"
        resource-name="example.com"
        :is-deleting="isDeleting"
        :error-message="errorMessage"
        class="registry-preview not-prose"
        @delete="handleDelete"
        @update:open="
          errorMessage = '';
          deleted = false;
        "
      >
        <template #trigger
          ><Button variant="destructive">{{
            variant === "error" ? "Try failed deletion" : "Delete Zone"
          }}</Button></template
        >
      </DeleteResource>
      <p v-if="deleted" role="status" class="text-sm text-muted-foreground">
        Zone deleted in this demo. No real data was removed.
      </p>
    </div>
  </PreviewFrame>
</template>
