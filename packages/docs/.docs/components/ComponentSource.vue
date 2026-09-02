<script setup lang="ts">
import highlighter from "#mdc-highlighter";
import { useHead } from "#imports";
import { computed, h } from "vue";

type HighlightNode =
  | { type: "text"; value: string }
  | {
      type: "element";
      tagName: string;
      properties: Record<string, unknown>;
      children: HighlightNode[];
    };

const props = withDefaults(
  defineProps<{
    path: string;
    filename?: string;
    collapseAfter?: number;
    hideHeader?: boolean;
  }>(),
  { collapseAfter: 20 },
);

const sources = import.meta.glob<string>("../../../ui/registry/**/*.{ts,vue}", {
  eager: true,
  import: "default",
  query: "?raw",
});

const filename = computed(() => props.filename ?? props.path.split("/").at(-1) ?? props.path);
const source = computed(() => {
  const value = sources[`../../../ui/registry/${props.path}`];
  if (!value) throw new Error(`Unknown registry source: ${props.path}`);
  return value;
});
const language = computed(() => filename.value.split(".").at(-1));
const shouldCollapse = computed(
  () => source.value.trimEnd().split("\n").length > props.collapseAfter,
);
const highlighted = await highlighter(source.value, language.value, {
  default: "github-dark",
  dark: "github-dark",
  light: "github-light",
});
useHead({ style: [{ key: "component-source-shiki", textContent: highlighted.style }] });
// Shiki separates line spans with bare `\n` text nodes. Lines render as
// `display: block` with `white-space: pre-wrap`, so those separators would
// produce an empty line box per line. Token text lives inside the spans and
// is unaffected.
const nodes = (highlighted.tree as HighlightNode[]).filter(
  (node) => node.type !== "text" || node.value.trim() !== "",
);

function renderNode(node: HighlightNode): ReturnType<typeof h> | string {
  if (node.type === "text") return node.value;
  return h(node.tagName, node.properties, node.children.map(renderNode));
}

const HighlightedCode = () => h("code", nodes.map(renderNode));
</script>

<template>
  <ProseCodeCollapse v-if="shouldCollapse" name="source">
    <ProsePre
      :class="highlighted.className"
      :code="source"
      :filename="filename"
      :hide-header="props.hideHeader"
      :language="language"
    >
      <HighlightedCode />
    </ProsePre>
  </ProseCodeCollapse>
  <ProsePre
    v-else
    :class="highlighted.className"
    :code="source"
    :filename="filename"
    :hide-header="props.hideHeader"
    :language="language"
  >
    <HighlightedCode />
  </ProsePre>
</template>
