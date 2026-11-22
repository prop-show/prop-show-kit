<script setup lang="ts">
import { shallowRef } from "vue";
import { Button } from "../../../ui/registry/ui-sdk/ui-sdk-button";

const saved = shallowRef(false);

async function save() {
  saved.value = false;
  await new Promise((resolve) => setTimeout(resolve, 800));
  saved.value = true;
}
</script>

<template>
  <PreviewFrame>
    <div class="grid justify-items-center gap-3">
      <div class="flex flex-wrap items-center justify-center gap-2">
        <Button v-slot="{ state }" class="min-w-30" @click="save">
          {{ state.pending ? "Saving…" : "Save changes" }}
        </Button>
        <Button variant="outline" size="sm" @click="saved = false">Reset</Button>
        <Button variant="secondary" disabled>Publish</Button>
      </div>
      <p role="status" class="min-h-5 text-sm text-muted-foreground">
        {{ saved ? "Changes saved." : "" }}
      </p>
    </div>
  </PreviewFrame>
</template>
