<script setup lang="ts">
import { ref } from "vue";

import { SortableList, type SortableItem } from "../../../ui/registry/sortable-list";

const sections = ref<SortableItem[]>([
  { id: "hero", label: "Hero", description: "Opening statement" },
  { id: "proof", label: "Proof", description: "Logos and quotes" },
  { id: "pricing", label: "Pricing", description: "Plans and comparison" },
  { id: "faq", label: "FAQ", description: "Common questions" },
]);
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-md gap-3">
      <SortableList v-model="sections" label="Page sections" />
      <p class="text-sm text-muted-foreground">
        Order: {{ sections.map((section) => section.label).join(", ") }}
      </p>
    </div>
  </PreviewFrame>
</template>
