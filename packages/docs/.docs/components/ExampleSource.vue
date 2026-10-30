<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ path: string }>();
const sources = import.meta.glob<string>("./*Preview.vue", {
  eager: true,
  import: "default",
  query: "?raw",
});
const source = computed(() => {
  const code = sources[`./${props.path}`];
  if (!code) throw new Error(`Unknown preview source: ${props.path}`);
  return code
    .replaceAll("../../../ui/registry/", "@/components/")
    .replace(
      /^([ \t]*)<PreviewFrame>\r?\n([\s\S]*?)^\1<\/PreviewFrame>\r?\n/gm,
      (_, indent, content) => content.replace(new RegExp(`^${indent}  `, "gm"), indent),
    );
});
</script>

<template>
  <ComponentSource :path="path" :code="source" />
</template>
