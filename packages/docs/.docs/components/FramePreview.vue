<script setup lang="ts">
import { ArrowRightIcon, InfoIcon, ReceiptTextIcon, RotateCcwIcon, XIcon } from "@lucide/vue";
import { ref } from "vue";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FramePanel,
  FrameTitle,
} from "../../../ui/registry/frame";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const dismissed = ref<number[]>([]);
const feedback = ref("");
const paid = ref(false);
const tones = ["default", "info", "destructive"] as const;
function dismiss(index: number, undo = false) {
  dismissed.value.push(index);
  feedback.value = undo ? "Change undone." : "Notification dismissed.";
}
function reset() {
  dismissed.value = [];
  paid.value = false;
  feedback.value = "";
}
</script>

<template>
  <PreviewFrame>
    <div class="w-full min-w-0 space-y-5">
      <div class="mx-auto grid max-w-lg items-start gap-5">
        <template v-for="(tone, index) in tones" :key="tone">
          <Frame
            v-if="!dismissed.includes(index)"
            :tone="tone"
            :dense="index === 0"
            class="shadow-sm"
          >
            <FramePanel patterned>
              <div class="flex items-start gap-3">
                <div
                  class="shrink-0 rounded-md border bg-muted/50 p-2"
                  :class="
                    tone === 'destructive'
                      ? 'text-destructive'
                      : tone === 'info'
                        ? 'text-blue-500'
                        : 'text-muted-foreground'
                  "
                >
                  <InfoIcon aria-hidden="true" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <FrameTitle>{{ index === 2 ? "Invoice deleted" : "Changes saved" }}</FrameTitle>
                  <FrameDescription>{{
                    index === 2 ? "INV-2026-0412 moved to trash." : "Your workspace is up to date."
                  }}</FrameDescription>
                  <div class="-ml-2 mt-1 flex flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground"
                      @click="dismiss(index)"
                      >Dismiss</Button
                    >
                    <Button variant="ghost" size="sm" @click="dismiss(index, true)">Undo</Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Dismiss notification"
                  @click="dismiss(index)"
                  ><XIcon
                /></Button>
              </div>
            </FramePanel>
            <FrameFooter v-if="index > 0" class="justify-center">{{
              index === 2
                ? "You can restore this invoice from trash."
                : "All changes have been synced."
            }}</FrameFooter>
          </Frame>
        </template>

        <Frame dense class="shadow-sm">
          <FramePanel patterned>
            <div class="flex items-center gap-3">
              <div class="shrink-0 rounded-md border px-3 py-1 text-center shadow-sm">
                <div class="text-[10px] text-muted-foreground">NOV</div>
                <div class="text-xl font-medium">15</div>
              </div>
              <div class="min-w-0">
                <FrameTitle>Invoice INV-0412 from Acme Inc.</FrameTitle
                ><FrameDescription>{{
                  paid ? "Paid in full" : "EUR 1,240 · in 3 days"
                }}</FrameDescription>
              </div>
            </div>
          </FramePanel>
          <FrameFooter class="justify-center p-1"
            ><Button variant="ghost" size="sm" class="w-full" :disabled="paid" @click="paid = true"
              ><ReceiptTextIcon />{{ paid ? "Invoice paid" : "Pay invoice" }}</Button
            ></FrameFooter
          >
        </Frame>

        <Frame tone="destructive" class="shadow-sm">
          <FramePanel patterned>
            <FrameTitle>Your workspace has used 95% of its available storage</FrameTitle>
            <FrameDescription class="mt-1 text-xs leading-5"
              >Uploads, syncing and backups will stop once storage is full. Free up space or upgrade
              your plan.</FrameDescription
            >
            <div class="mt-3 flex flex-wrap gap-2">
              <Badge class="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                >Storage limit warning</Badge
              ><Badge variant="secondary">47.5 / 50 GB</Badge>
            </div>
          </FramePanel>
          <FrameFooter class="justify-between"
            ><span>Upgrade storage and resume backups</span
            ><Button
              variant="ghost"
              size="sm"
              class="text-destructive"
              @click="feedback = 'Storage plans start at 100 GB.'"
              >Learn more <ArrowRightIcon /></Button
          ></FrameFooter>
        </Frame>

        <Frame dense class="shadow-sm">
          <FramePanel patterned>
            <FrameTitle>Production deploy finished for api-gateway v2.4.1</FrameTitle>
            <FrameDescription class="mt-1 text-xs leading-5"
              >All 12 services passed their health checks. The rollout took 3 minutes 42 seconds,
              with no errors reported.</FrameDescription
            >
          </FramePanel>
          <FrameFooter
            ><Badge class="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
              >Production</Badge
            ><Badge variant="secondary">v2.4.1</Badge
            ><Badge variant="secondary">3m 42s</Badge></FrameFooter
          >
        </Frame>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p role="status" class="text-sm text-muted-foreground">{{ feedback }}</p>
        <Button variant="outline" size="sm" @click="reset"><RotateCcwIcon />Reset examples</Button>
      </div>
    </div>
  </PreviewFrame>
</template>
