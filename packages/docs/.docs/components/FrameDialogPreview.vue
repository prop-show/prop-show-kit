<script setup lang="ts">
import { InfoIcon } from "@lucide/vue";
import { ref } from "vue";
import {
  FrameDescription,
  FrameDialog,
  FrameFooter,
  FramePanel,
  FrameTitle,
} from "../../../ui/registry/frame";
import { Button } from "@/components/ui/button";

const open = ref(false);
const deleted = ref(false);
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col items-center gap-3">
      <FrameDialog
        v-model:open="open"
        title="Delete invoice?"
        description="Move invoice INV-2026-0412 to trash. You can restore it later."
        tone="destructive"
        class="registry-preview not-prose"
      >
        <template #trigger><Button variant="outline">Open framed dialog</Button></template>
        <template #default="{ close }">
          <FramePanel patterned class="pr-12">
            <div class="flex items-start gap-3">
              <div class="shrink-0 rounded-md bg-destructive/10 p-2 text-destructive">
                <InfoIcon aria-hidden="true" class="size-5" />
              </div>
              <div class="min-w-0">
                <FrameTitle>Delete invoice?</FrameTitle
                ><FrameDescription
                  >Move invoice INV-2026-0412 to trash. You can restore it later.</FrameDescription
                >
              </div>
            </div>
          </FramePanel>
          <FrameFooter class="justify-between"
            ><span>No permanent deletion</span>
            <div class="flex gap-2">
              <Button variant="ghost" size="sm" @click="close">Cancel</Button
              ><Button
                variant="destructive"
                size="sm"
                @click="
                  deleted = true;
                  close();
                "
                >Move to trash</Button
              >
            </div></FrameFooter
          >
        </template>
      </FrameDialog>
      <p v-if="deleted" role="status" class="text-sm text-muted-foreground">
        Invoice moved to trash in this demo.
      </p>
    </div>
  </PreviewFrame>
</template>
