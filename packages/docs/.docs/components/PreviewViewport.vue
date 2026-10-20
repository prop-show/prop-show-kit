<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef } from "vue";
import { ConfigProvider } from "reka-ui";

// Attributes belong to the iframe, not the teleported preview content.
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ height?: number; fullscreen?: boolean }>(), { height: 240 });
const mounted = shallowRef(false);
const srcdoc = shallowRef("");
onMounted(() => {
  const scheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
  // Set the canvas color before the iframe loads its copied styles.
  srcdoc.value = `<!doctype html><html style="color-scheme: ${scheme}"><head></head><body></body></html>`;
  mounted.value = true;
});
const target = shallowRef<HTMLElement>();
const ready = shallowRef(false);
let styles: MutationObserver | undefined;
let theme: MutationObserver | undefined;

async function initialize(event: Event) {
  const frame = event.target as HTMLIFrameElement;
  const doc = frame.contentDocument;
  if (!doc) return;
  const syncStyles = () => {
    const nodes = Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]')).map(
      (node) => node.cloneNode(true) as HTMLElement,
    );
    const loaded = nodes
      .filter((node) => node.tagName === "LINK")
      .map(
        (node) =>
          new Promise<void>((resolve) => {
            node.addEventListener("load", () => resolve(), { once: true });
            node.addEventListener("error", () => resolve(), { once: true });
          }),
      );
    doc.head.replaceChildren(...nodes);
    return Promise.all(loaded);
  };
  const syncTheme = () => {
    doc.documentElement.className = document.documentElement.className;
    doc.documentElement.style.colorScheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  };
  ready.value = false;
  const stylesLoaded = syncStyles();
  syncTheme();
  doc.documentElement.style.overscrollBehaviorY = "contain";
  doc.body.style.overscrollBehaviorY = "contain";
  doc.body.style.margin = "0";
  theme?.disconnect();
  theme = new MutationObserver(syncTheme);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  await stylesLoaded;
  if (!frame.isConnected || frame.contentDocument !== doc) return;
  const container = doc.createElement("div");
  container.className = "registry-preview";
  doc.body.append(container);
  target.value = container;
  styles?.disconnect();
  styles = new MutationObserver(() => {
    void syncStyles();
  });
  styles.observe(document.head, { childList: true, subtree: true, characterData: true });
  await nextTick();
  if (frame.isConnected && frame.contentDocument === doc) ready.value = true;
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
    :srcdoc="srcdoc"
    class="block w-full border-0 bg-background [color-scheme:light] dark:[color-scheme:dark]"
    :style="{
      height: fullscreen ? '100vh' : `${height}px`,
      visibility: ready ? 'visible' : 'hidden',
    }"
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
