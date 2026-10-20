<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import { TabsContent, TabsRoot } from "reka-ui";
import RegistryInstall from "./RegistryInstall.vue";
import PreviewCanvas from "./PreviewCanvas.vue";
import PreviewSource from "./PreviewSource.vue";
import PreviewToolbar from "./PreviewToolbar.vue";

const props = defineProps<{
  source: string;
  code?: string;
  files?: { path: string; code: string }[];
  registry: string;
  height?: number;
}>();
const canvas = useTemplateRef<InstanceType<typeof PreviewCanvas>>("canvas");
const panelHeight = shallowRef((props.height ?? 240) + 60);
const tab = shallowRef<string | number>("preview");
const error = shallowRef("");

async function toggleFullscreen() {
  error.value = "";
  tab.value = "preview";
  try {
    await canvas.value?.toggleFullscreen();
  } catch {
    error.value = "Fullscreen is unavailable in this browser.";
  }
}
async function reset() {
  tab.value = "preview";
  error.value = "";
  try {
    await canvas.value?.reset();
  } catch {
    error.value = "Use Esc to exit fullscreen.";
  }
}
</script>

<template>
  <section
    class="registry-preview not-prose my-6 min-w-0 rounded-xl border border-border bg-background text-foreground"
  >
    <TabsRoot v-model="tab">
      <PreviewToolbar
        :width="canvas?.width"
        :fullscreen-supported="canvas?.isFullscreenSupported ?? false"
        @select-width="
          canvas?.setWidth($event);
          tab = 'preview';
        "
        @reset="reset"
        @toggle-fullscreen="toggleFullscreen"
      />
      <TabsContent
        value="preview"
        force-mount
        :hidden="tab !== 'preview'"
        class="outline-none"
        :style="{ minHeight: `${panelHeight}px` }"
      >
        <PreviewCanvas
          ref="canvas"
          :height="height"
          @height-change="panelHeight = Math.max(panelHeight, $event)"
          ><slot
        /></PreviewCanvas>
      </TabsContent>
      <TabsContent value="code" class="outline-none" :style="{ minHeight: `${panelHeight}px` }">
        <PreviewSource
          :source="source"
          :code="code"
          :files="files"
          :style="{ height: `${panelHeight}px`, maxHeight: `${panelHeight}px`, margin: '0' }"
        />
      </TabsContent>
    </TabsRoot>
    <div class="border-t border-border px-3">
      <RegistryInstall :url="`/r/${registry}.json`" />
    </div>
    <p v-if="error" role="status" class="px-3 pb-2 text-sm text-destructive">{{ error }}</p>
  </section>
</template>
