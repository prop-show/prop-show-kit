<script setup lang="ts">
import { computed, readonly, shallowRef, useTemplateRef, watch } from "vue";
import { useFullscreen, useResizeObserver } from "@vueuse/core";
import PreviewViewport from "./PreviewViewport.vue";

defineProps<{ height?: number; autoHeight?: boolean }>();
const emit = defineEmits<{ heightChange: [height: number] }>();
const container = useTemplateRef<HTMLElement>("container");
const viewport = useTemplateRef<HTMLElement>("viewport");
const previewPanel = useTemplateRef<HTMLElement>("previewPanel");
const maxWidth = shallowRef(280);
const minWidth = computed(() => Math.min(280, maxWidth.value));
const width = shallowRef<number>();
const currentWidth = computed(() => width.value ?? maxWidth.value);
const dragging = shallowRef(false);
const {
  isFullscreen,
  isSupported: isFullscreenSupported,
  toggle: toggleFullscreen,
  exit,
} = useFullscreen(viewport);

useResizeObserver(container, ([entry]) => {
  if (entry.contentRect.width > 0)
    maxWidth.value = Math.max(1, Math.floor(entry.contentRect.width) - 2);
});
useResizeObserver(previewPanel, ([entry]) => {
  if (entry.contentRect.height > 0 && !isFullscreen.value)
    emit("heightChange", Math.ceil(entry.contentRect.height));
});
watch(maxWidth, () => {
  if (width.value !== undefined) setWidth(width.value);
});

function setWidth(value: number) {
  width.value = Math.max(minWidth.value, Math.min(maxWidth.value, value));
}
async function reset() {
  width.value = undefined;
  if (isFullscreen.value) await exit();
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

defineExpose({
  width: readonly(width),
  isFullscreenSupported,
  setWidth,
  reset,
  toggleFullscreen,
});
</script>

<template>
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
          :auto-height="autoHeight"
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
</template>
