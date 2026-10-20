<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";
import { useFullscreen, useResizeObserver } from "@vueuse/core";
import { MaximizeIcon, MonitorIcon, RotateCcwIcon, SmartphoneIcon, TabletIcon } from "@lucide/vue";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "reka-ui";
import { Button } from "@/components/ui/button";
import RegistryInstall from "./RegistryInstall.vue";
import CodeTree from "undocs/src/app/content/CodeTree.vue";
import ProsePre from "undocs/src/app/content/ProsePre.vue";
import { highlightCode } from "undocs/src/server/content/highlight.ts";
import PreviewViewport from "./PreviewViewport.vue";

const props = defineProps<{
  source: string;
  code?: string;
  files?: { path: string; code: string }[];
  registry: string;
  height?: number;
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
const container = shallowRef<HTMLElement>();
const maxWidth = shallowRef(280);
const minWidth = computed(() => Math.min(280, maxWidth.value));
useResizeObserver(container, ([entry]) => {
  if (entry.contentRect.width > 0)
    maxWidth.value = Math.max(1, Math.floor(entry.contentRect.width) - 2);
});
const viewport = shallowRef<HTMLElement>();
const width = shallowRef<number>();
const currentWidth = computed(() => width.value ?? maxWidth.value);
function setWidth(value: number) {
  width.value = Math.max(minWidth.value, Math.min(maxWidth.value, value));
}
watch(maxWidth, () => {
  if (width.value !== undefined) setWidth(width.value);
});
const previewPanel = shallowRef<HTMLElement>();
const panelHeight = shallowRef((props.height ?? 240) + 60);
useResizeObserver(previewPanel, ([entry]) => {
  if (entry.contentRect.height > 0 && !isFullscreen.value)
    panelHeight.value = Math.max(panelHeight.value, Math.ceil(entry.contentRect.height));
});
const tab = shallowRef<string | number>("preview");
const dragging = shallowRef(false);
const error = shallowRef("");
const { isFullscreen, isSupported, toggle, exit } = useFullscreen(viewport);
const devices = [
  { label: "PC", width: 1440, icon: MonitorIcon },
  { label: "iPad", width: 768, icon: TabletIcon },
  { label: "Phone", width: 390, icon: SmartphoneIcon },
];

async function toggleFullscreen() {
  error.value = "";
  tab.value = "preview";
  try {
    await toggle();
  } catch {
    error.value = "Fullscreen is unavailable in this browser.";
  }
}
async function reset() {
  width.value = undefined;
  tab.value = "preview";
  error.value = "";
  if (isFullscreen.value) {
    try {
      await exit();
    } catch {
      error.value = "Use Esc to exit fullscreen.";
    }
  }
}
function startResize(event: PointerEvent) {
  if (event.button !== 0) return;
  const handle = event.currentTarget as HTMLElement;
  handle.setPointerCapture(event.pointerId);
  dragging.value = true;
}
function resize(event: PointerEvent) {
  if (!dragging.value || !viewport.value) return;
  setWidth(Math.round(event.clientX - viewport.value.getBoundingClientRect().left) - 2);
}
function resizeWithKeyboard(event: KeyboardEvent) {
  const current = currentWidth.value;
  const widths: Record<string, number> = {
    ArrowLeft: current - 10,
    ArrowRight: current + 10,
    Home: minWidth.value,
    End: maxWidth.value,
  };
  if (!(event.key in widths)) return;
  event.preventDefault();
  setWidth(widths[event.key]);
}
</script>

<template>
  <section
    class="registry-preview not-prose my-6 min-w-0 rounded-xl border border-border bg-background text-foreground"
  >
    <TabsRoot v-model="tab">
      <div class="flex flex-wrap items-center gap-2 border-b border-border p-2">
        <TabsList aria-label="Component example" class="flex gap-1">
          <TabsTrigger
            v-for="value in ['preview', 'code']"
            :key="value"
            :value="value"
            class="rounded-md px-3 py-1.5 text-sm capitalize text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >{{ value }}</TabsTrigger
          >
        </TabsList>
        <div class="ml-auto flex items-center gap-1">
          <Button
            v-for="device in devices"
            :key="device.label"
            type="button"
            variant="ghost"
            size="icon-sm"
            :aria-label="`${device.label} (${device.width}px)`"
            :title="`${device.label} (${device.width}px)`"
            :aria-pressed="width === device.width"
            :class="{ 'bg-muted': width === device.width }"
            @click="
              setWidth(device.width);
              tab = 'preview';
            "
          >
            <component :is="device.icon" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Reset preview"
            title="Reset preview"
            @click="reset"
            ><RotateCcwIcon aria-hidden="true"
          /></Button>
          <Button
            v-if="isSupported"
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Enter fullscreen"
            title="Enter fullscreen"
            @click="toggleFullscreen"
            ><MaximizeIcon aria-hidden="true"
          /></Button>
        </div>
      </div>
      <TabsContent
        value="preview"
        force-mount
        :hidden="tab !== 'preview'"
        class="outline-none"
        :style="{ minHeight: `${panelHeight}px` }"
      >
        <div ref="previewPanel">
          <div ref="container" class="min-w-0 bg-muted/30 p-3">
            <div
              ref="viewport"
              class="registry-preview relative min-w-0 border border-border bg-background fullscreen:h-screen fullscreen:overflow-auto fullscreen:border-0"
              :style="{
                width: !isFullscreen && width ? `${width + 2}px` : '100%',
                borderWidth: isFullscreen ? '0' : undefined,
                maxWidth: '100%',
              }"
            >
              <PreviewViewport
                :fullscreen="isFullscreen"
                :height="height"
                :class="{ 'pointer-events-none': dragging }"
                ><slot
              /></PreviewViewport>
              <div
                v-if="!isFullscreen"
                role="separator"
                tabindex="0"
                aria-label="Resize preview width"
                aria-orientation="vertical"
                :aria-valuenow="currentWidth"
                :aria-valuemin="minWidth"
                :aria-valuemax="maxWidth"
                class="absolute inset-y-0 -right-3 z-10 flex w-3 touch-none cursor-col-resize items-center justify-center bg-muted/70 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @pointerdown="startResize"
                @pointermove="resize"
                @pointerup="dragging = false"
                @pointercancel="dragging = false"
                @lostpointercapture="dragging = false"
                @keydown="resizeWithKeyboard"
              >
                <span class="h-8 w-1 rounded-full bg-border" />
              </div>
            </div>
          </div>
          <p class="m-0 border-t border-border px-3 py-2 text-xs text-muted-foreground">
            {{ width ? `${width}px` : "Auto width" }} · Drag the right edge to resize
          </p>
        </div>
      </TabsContent>
      <TabsContent value="code" class="outline-none" :style="{ minHeight: `${panelHeight}px` }">
        <CodeTree
          :default-value="source"
          expand-all
          :style="{ height: `${panelHeight}px`, maxHeight: `${panelHeight}px`, margin: '0' }"
        >
          <ProsePre
            v-for="file in sourceFiles"
            :key="file.path"
            :filename="file.path"
            :code="file.code"
            :language="file.path.split('.').at(-1)"
            :highlighted="highlightCode(file.code ?? '', file.path.split('.').at(-1))"
          />
        </CodeTree>
      </TabsContent>
    </TabsRoot>
    <div class="border-t border-border px-3">
      <RegistryInstall :url="`/r/${registry}.json`" />
    </div>
    <p v-if="error" role="status" class="px-3 pb-2 text-sm text-destructive">{{ error }}</p>
  </section>
</template>
