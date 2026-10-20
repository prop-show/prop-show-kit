<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";
import { ConfigProvider } from "reka-ui";

// Attributes belong to the iframe, not the teleported preview content.
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ height?: number; fullscreen?: boolean }>(), { height: 240 });
const mounted = shallowRef(false);
onMounted(() => {
  mounted.value = true;
});
const target = shallowRef<HTMLElement>();
let styles: MutationObserver | undefined;
let theme: MutationObserver | undefined;

function initialize(event: Event) {
  const frame = event.target as HTMLIFrameElement;
  const doc = frame.contentDocument;
  if (!doc) return;
  const syncStyles = () => {
    doc.head.replaceChildren(
      ...Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]')).map((node) =>
        node.cloneNode(true),
      ),
    );
  };
  const syncTheme = () => {
    doc.documentElement.className = document.documentElement.className;
  };
  syncStyles();
  syncTheme();
  doc.documentElement.style.overscrollBehaviorY = "contain";
  doc.body.style.overscrollBehaviorY = "contain";
  doc.body.style.margin = "0";
  const container = doc.createElement("div");
  container.className = "registry-preview";
  doc.body.append(container);
  target.value = container;
  styles?.disconnect();
  styles = new MutationObserver(syncStyles);
  styles.observe(document.head, { childList: true, subtree: true, characterData: true });
  theme?.disconnect();
  theme = new MutationObserver(syncTheme);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

onBeforeUnmount(() => {
  styles?.disconnect();
  theme?.disconnect();
});
</script>

<template>
  <iframe
    v-if="mounted"
    v-bind="$attrs"
    title="Component preview"
    srcdoc="<!doctype html><html><head></head><body></body></html>"
    class="block w-full border-0"
    :style="{ height: fullscreen ? '100vh' : `${height}px` }"
    @load="initialize"
  />
  <Teleport v-if="target" :to="target">
    <ConfigProvider :teleport-to="target">
      <div
        class="registry-preview flex min-h-60 w-full items-center justify-center bg-background p-8 text-foreground"
        :style="{
          minHeight: fullscreen ? '100vh' : `${height}px`,
          padding: fullscreen ? '0' : undefined,
        }"
      >
        <slot />
      </div>
    </ConfigProvider>
  </Teleport>
</template>
