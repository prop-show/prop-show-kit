<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ path: string }>();
// Lazy so an example page fetches that preview's source, not every preview.
const sources = import.meta.glob<string>("./*Preview.vue", {
  import: "default",
  query: "?raw",
});
const load = sources[`./${props.path}`];
if (!load) throw new Error(`Unknown preview source: ${props.path}`);
const raw = await load();
const source = computed(() =>
  raw
    .replaceAll("../../../ui/registry/", "@/components/")
    .replace(
      /^([ \t]*)<PreviewFrame>\r?\n([\s\S]*?)^\1<\/PreviewFrame>\r?\n/gm,
      (_, indent, content) => content.replace(new RegExp(`^${indent}  `, "gm"), indent),
    ),
);
</script>

<template>
  <ComponentSource :path="path" :code="source" />
</template>
