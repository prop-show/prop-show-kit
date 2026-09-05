<script setup lang="ts">
import { computed, shallowRef } from "vue";
import ProsePre from "undocs/src/app/content/ProsePre.vue";
import { highlightCode } from "undocs/src/server/content/highlight.ts";

const props = withDefaults(
  defineProps<{
    path: string;
    filename?: string | null;
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

const filename = computed(() =>
  props.filename === undefined ? props.path.split("/").at(-1) : props.filename,
);
const source = computed(() => {
  const value = sources[`../../../ui/registry/${props.path}`];
  if (!value) throw new Error(`Unknown registry source: ${props.path}`);
  return value;
});
const language = computed(() => props.path.split(".").at(-1));
const shouldCollapse = computed(
  () => source.value.trimEnd().split("\n").length > props.collapseAfter,
);
const expanded = shallowRef(false);
const highlighted = computed(() => highlightCode(source.value, language.value));
</script>

<template>
  <div>
    <div :class="{ 'max-h-96 overflow-hidden': shouldCollapse && !expanded }">
      <ProsePre
        :highlighted="highlighted"
        :code="source"
        :filename="props.hideHeader ? undefined : filename || undefined"
        :language="language"
      />
    </div>
    <button
      v-if="shouldCollapse"
      type="button"
      class="w-full border-t border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      {{ expanded ? "Collapse code" : "Expand code" }}
    </button>
  </div>
</template>
