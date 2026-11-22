<script setup lang="ts">
import { ChevronsUpDownIcon } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { shallowRef } from "vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/registry/ui-sdk/collapsible";

const open = shallowRef(false);
</script>

<template>
  <PreviewFrame>
    <Collapsible v-model="open" class="w-full max-w-88 space-y-2">
      <div class="flex items-center justify-between gap-4">
        <p class="px-3 text-sm font-semibold">Delivery details</p>
        <CollapsibleTrigger>
          <template #render="{ props }">
            <Button v-bind="props" variant="ghost" size="icon" aria-label="Toggle delivery details">
              <ChevronsUpDownIcon aria-hidden="true" />
            </Button>
          </template>
        </CollapsibleTrigger>
      </div>
      <div class="rounded-md border px-4 py-2 font-mono text-sm">Daily digest</div>
      <CollapsibleContent class="rounded-md border px-4 py-2 text-sm text-muted-foreground">
        Arrives at 9:00 AM in your workspace time zone.
      </CollapsibleContent>
    </Collapsible>
  </PreviewFrame>
</template>
