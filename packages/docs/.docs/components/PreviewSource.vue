<script setup lang="ts">
import { computed } from "vue";
import CodeTree from "undocs/src/app/content/CodeTree.vue";
import ProsePre from "undocs/src/app/content/ProsePre.vue";
import { highlightCode } from "undocs/src/server/content/highlight.ts";

const props = defineProps<{
  source: string;
  code?: string;
  files?: { path: string; code: string }[];
}>();
const sources = import.meta.glob<string>("../../../ui/registry/**/*.{ts,vue}", {
  eager: true,
  import: "default",
  query: "?raw",
});
const sourceFiles = computed(() => {
  if (props.files?.length) return props.files;
  const code = props.code ?? sources[`../../../ui/registry/${props.source}`];
  if (!code) throw new Error(`Unknown registry source: ${props.source}`);
  return [{ path: props.source, code }];
});
const highlightedFiles = computed(() =>
  sourceFiles.value.map((file) => {
    const language = file.path.split(".").at(-1);
    return { ...file, language, highlighted: highlightCode(file.code ?? "", language) };
  }),
);
</script>

<template>
  <CodeTree :default-value="source" expand-all>
    <ProsePre
      v-for="file in highlightedFiles"
      :key="file.path"
      :filename="file.path"
      :code="file.code"
      :language="file.language"
      :highlighted="file.highlighted"
    />
  </CodeTree>
</template>
