<script setup lang="ts">
import { computed, shallowRef } from "vue";
import CodeTree from "undocs/src/app/content/CodeTree.vue";
import ProsePre from "undocs/src/app/content/ProsePre.vue";
import { highlightCode } from "undocs/src/server/content/highlight.ts";

const props = defineProps<{
  source: string;
  code?: string;
  files?: { path: string; code: string }[];
}>();
// Lazy so the code tab fetches this block's source, not the whole registry.
const sources = import.meta.glob<string>("../../../ui/registry/**/*.{ts,vue}", {
  import: "default",
  query: "?raw",
});
const sourceFiles = shallowRef<{ path: string; code: string }[]>([]);
if (props.files?.length) {
  sourceFiles.value = props.files;
} else if (props.code != null) {
  sourceFiles.value = [{ path: props.source, code: props.code }];
} else {
  const load = sources[`../../../ui/registry/${props.source}`];
  if (!load) throw new Error(`Unknown registry source: ${props.source}`);
  sourceFiles.value = [{ path: props.source, code: await load() }];
}
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
