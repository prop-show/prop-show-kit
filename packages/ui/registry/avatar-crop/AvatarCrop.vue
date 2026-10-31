<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { ImagePlusIcon } from "@lucide/vue";
import { computed, onMounted, onUnmounted, shallowRef, useId, useTemplateRef, watch } from "vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AvatarCropResult, CropFrame, ImageSize } from "./crop";

import {
  coverScale,
  initialFrame,
  normalizeOutputSize,
  panBy,
  resizeFrame,
  sourceRect,
  zoomAt,
  zoomFactor,
} from "./crop";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    src?: string;
    shape?: "circle" | "square";
    outputSize?: number;
    outputType?: "image/png" | "image/jpeg" | "image/webp";
    quality?: number;
    background?: string;
    maxZoom?: number;
    accept?: string;
    disabled?: boolean;
    label?: string;
    chooseLabel?: string;
    replaceLabel?: string;
    zoomLabel?: string;
    applyLabel?: string;
    resetLabel?: string;
    emptyLabel?: string;
    instructions?: string;
    loadError?: string;
    typeError?: string;
    exportError?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    shape: "circle",
    outputSize: 256,
    outputType: "image/png",
    quality: 0.92,
    maxZoom: 4,
    accept: "image/png,image/jpeg,image/webp,image/gif",
    chooseLabel: "Choose image",
    replaceLabel: "Replace image",
    zoomLabel: "Zoom",
    applyLabel: "Apply crop",
    resetLabel: "Reset",
    emptyLabel: "No image selected",
    instructions:
      "Crop image. Drag to move it. Arrow keys move the image. Plus and minus change zoom.",
    loadError: "This image could not be opened.",
    typeError: "Choose an image file.",
    exportError: "The browser blocked reading this image. Choose a file from this device.",
  },
);

const cropped = defineModel<string | null>({ default: null });
const emit = defineEmits<{ crop: [result: AvatarCropResult] }>();

const viewportEl = useTemplateRef<HTMLElement>("viewport");
const fileEl = useTemplateRef<HTMLInputElement>("file");
const zoomId = useId();
const errorId = useId();

const workingUrl = shallowRef(props.src ?? "");
const ownedUrl = shallowRef<string | null>(null);
const natural = shallowRef<ImageSize | null>(null);
const frame = shallowRef<CropFrame | null>(null);
const loadedImage = shallowRef<HTMLImageElement | null>(null);
const viewport = shallowRef(0);
const error = shallowRef("");
const applying = shallowRef(false);
const draggingFile = shallowRef(false);
const drag = shallowRef<{
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
} | null>(null);

const zoomValue = computed(() => {
  if (!frame.value || !natural.value || viewport.value <= 0) return 1;
  return zoomFactor(frame.value, natural.value, viewport.value);
});

const imageStyle = computed(() => {
  if (!frame.value || !natural.value) return undefined;
  return {
    width: `${natural.value.width * frame.value.scale}px`,
    height: `${natural.value.height * frame.value.scale}px`,
    maxWidth: "none",
    maxHeight: "none",
    transform: `translate(${frame.value.x}px, ${frame.value.y}px)`,
  };
});

function releaseOwnedUrl() {
  if (!ownedUrl.value) return;
  URL.revokeObjectURL(ownedUrl.value);
  ownedUrl.value = null;
}

function setWorkingUrl(url: string, owned: boolean) {
  releaseOwnedUrl();
  if (owned) ownedUrl.value = url;
  workingUrl.value = url;
  error.value = "";
  loadedImage.value = null;
  natural.value = null;
  frame.value = null;
  drag.value = null;
}

watch(
  () => props.src,
  (src, previous) => {
    if (!src || src === previous) return;
    setWorkingUrl(src, false);
  },
);

function measure() {
  const next = viewportEl.value?.clientWidth ?? 0;
  if (next <= 0 || next === viewport.value) return;
  if (natural.value && frame.value && viewport.value > 0) {
    frame.value = resizeFrame(frame.value, natural.value, viewport.value, next, props.maxZoom);
  } else if (natural.value) {
    frame.value = initialFrame(natural.value, next, 1, props.maxZoom);
  }
  viewport.value = next;
}

let observer: ResizeObserver | undefined;
onMounted(() => {
  measure();
  if (!viewportEl.value) return;
  observer = new ResizeObserver(() => measure());
  observer.observe(viewportEl.value);
});
onUnmounted(() => {
  observer?.disconnect();
  releaseOwnedUrl();
});

function onLoad(event: Event) {
  const image = event.currentTarget;
  if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
    error.value = props.loadError;
    return;
  }
  loadedImage.value = image;
  natural.value = { width: image.naturalWidth, height: image.naturalHeight };
  error.value = "";
  const size = viewport.value || viewportEl.value?.clientWidth || 0;
  if (size > 0) {
    viewport.value = size;
    frame.value = initialFrame(natural.value, size, 1, props.maxZoom);
  }
}

function onImageError() {
  loadedImage.value = null;
  natural.value = null;
  frame.value = null;
  error.value = props.loadError;
}

function useFile(file: File | undefined) {
  if (!file || props.disabled) return;
  if (!file.type.startsWith("image/")) {
    error.value = props.typeError;
    return;
  }
  setWorkingUrl(URL.createObjectURL(file), true);
}

function onFile(event: Event) {
  const input = event.currentTarget;
  if (!(input instanceof HTMLInputElement)) return;
  useFile(input.files?.[0]);
  input.value = "";
}

function openFileDialog() {
  fileEl.value?.click();
}

function onDragOver(event: DragEvent) {
  if (props.disabled) return;
  event.preventDefault();
  draggingFile.value = true;
}

function onDragLeave(event: DragEvent) {
  const next = event.relatedTarget;
  const current = event.currentTarget;
  if (current instanceof Node && next instanceof Node && current.contains(next)) return;
  draggingFile.value = false;
}

function onDrop(event: DragEvent) {
  if (props.disabled) return;
  event.preventDefault();
  draggingFile.value = false;
  useFile(event.dataTransfer?.files?.[0]);
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || !frame.value) return;
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return;
  try {
    target.setPointerCapture(event.pointerId);
  } catch {
    // Capture needs an active pointer. Drag still follows this pointer id.
  }
  drag.value = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    originX: frame.value.x,
    originY: frame.value.y,
  };
}

function onPointerMove(event: PointerEvent) {
  const current = drag.value;
  if (!current || current.id !== event.pointerId || !frame.value || !natural.value) return;
  frame.value = panBy(
    { ...frame.value, x: current.originX, y: current.originY },
    event.clientX - current.x,
    event.clientY - current.y,
    natural.value,
    viewport.value,
    props.maxZoom,
  );
}

function onPointerUp(event: PointerEvent) {
  if (drag.value?.id === event.pointerId) drag.value = null;
}

function move(dx: number, dy: number) {
  if (!frame.value || !natural.value) return;
  frame.value = panBy(frame.value, dx, dy, natural.value, viewport.value, props.maxZoom);
}

function zoomBy(multiplier: number) {
  if (!frame.value || !natural.value || viewport.value <= 0) return;
  frame.value = zoomAt(
    frame.value,
    natural.value,
    viewport.value,
    frame.value.scale * multiplier,
    viewport.value / 2,
    viewport.value / 2,
    props.maxZoom,
  );
}

function onZoomInput(event: Event) {
  const value = Number((event.currentTarget as HTMLInputElement).value);
  if (!frame.value || !natural.value || viewport.value <= 0) return;
  frame.value = zoomAt(
    frame.value,
    natural.value,
    viewport.value,
    coverScale(natural.value, viewport.value) * value,
    viewport.value / 2,
    viewport.value / 2,
    props.maxZoom,
  );
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || !frame.value) return;
  const key = event.key;
  if (key === "ArrowLeft") move(-12, 0);
  else if (key === "ArrowRight") move(12, 0);
  else if (key === "ArrowUp") move(0, -12);
  else if (key === "ArrowDown") move(0, 12);
  else if (key === "+" || key === "=") zoomBy(1.1);
  else if (key === "-" || key === "_") zoomBy(1 / 1.1);
  else if (key === "Home") reset();
  else return;
  event.preventDefault();
}

function onWheel(event: WheelEvent) {
  if (props.disabled || !frame.value || !natural.value || !viewportEl.value) return;
  const bounds = viewportEl.value.getBoundingClientRect();
  const next = frame.value.scale * (event.deltaY < 0 ? 1.08 : 1 / 1.08);
  frame.value = zoomAt(
    frame.value,
    natural.value,
    viewport.value,
    next,
    event.clientX - bounds.left,
    event.clientY - bounds.top,
    props.maxZoom,
  );
}

function reset() {
  if (!natural.value || viewport.value <= 0) return;
  frame.value = initialFrame(natural.value, viewport.value, 1, props.maxZoom);
  error.value = "";
}

function backgroundColor() {
  if (props.background) return props.background;
  if (props.outputType === "image/jpeg") return "#ffffff";
  return "";
}

async function apply() {
  const image = loadedImage.value;
  const current = frame.value;
  const size = viewport.value;
  if (!image || !current || size <= 0 || props.disabled || applying.value) return;
  const output = normalizeOutputSize(props.outputSize);
  const canvas = document.createElement("canvas");
  canvas.width = output;
  canvas.height = output;
  const context = canvas.getContext("2d");
  if (!context) {
    error.value = props.exportError;
    return;
  }
  const fill = backgroundColor();
  if (fill) {
    context.fillStyle = fill;
    context.fillRect(0, 0, output, output);
  }
  context.save();
  if (props.shape === "circle") {
    context.beginPath();
    context.arc(output / 2, output / 2, output / 2, 0, Math.PI * 2);
    context.clip();
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  const rect = sourceRect(current, size);
  context.drawImage(image, rect.x, rect.y, rect.size, rect.size, 0, 0, output, output);
  context.restore();

  applying.value = true;
  try {
    const dataUrl = canvas.toDataURL(props.outputType, props.quality);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, props.outputType, props.quality);
    });
    if (!blob) {
      error.value = props.exportError;
      return;
    }
    error.value = "";
    cropped.value = dataUrl;
    emit("crop", { blob, dataUrl, width: output, height: output });
  } catch {
    error.value = props.exportError;
  } finally {
    applying.value = false;
  }
}
</script>

<template>
  <div
    data-slot="avatar-crop"
    :class="
      cn('grid w-full max-w-xs gap-3', draggingFile && 'rounded-lg ring-2 ring-ring', props.class)
    "
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <label v-if="props.label" class="text-sm font-medium text-foreground">{{ props.label }}</label>

    <input
      ref="file"
      type="file"
      class="sr-only"
      :accept="props.accept"
      :disabled="props.disabled"
      :aria-label="natural ? props.replaceLabel : props.chooseLabel"
      @change="onFile"
    />

    <div
      ref="viewport"
      data-slot="avatar-crop-viewport"
      role="application"
      tabindex="0"
      :aria-label="props.instructions"
      :aria-disabled="props.disabled || undefined"
      :aria-describedby="error ? errorId : undefined"
      class="relative aspect-square w-full touch-none overflow-hidden bg-muted outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50"
      :class="[
        props.shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        natural ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        props.disabled && 'pointer-events-none opacity-50',
      ]"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
      @wheel.prevent="onWheel"
    >
      <img
        v-if="workingUrl"
        :src="workingUrl"
        alt=""
        draggable="false"
        class="pointer-events-none absolute top-0 left-0 max-w-none"
        :style="imageStyle"
        @load="onLoad"
        @error="onImageError"
      />
      <div v-else class="grid h-full place-items-center px-6 text-center text-muted-foreground">
        <slot name="empty">
          <span class="flex flex-col items-center gap-2 text-sm">
            <ImagePlusIcon class="size-6" />
            {{ props.emptyLabel }}
          </span>
        </slot>
      </div>
    </div>

    <div class="grid gap-1.5">
      <div class="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <label :for="zoomId">{{ props.zoomLabel }}</label>
        <span class="tabular-nums">{{ Math.round(zoomValue * 100) }}%</span>
      </div>
      <input
        :id="zoomId"
        type="range"
        min="1"
        :max="props.maxZoom"
        step="0.01"
        :value="zoomValue"
        :disabled="props.disabled || !natural"
        :aria-valuetext="`${Math.round(zoomValue * 100)} percent`"
        class="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        @input="onZoomInput"
      />
    </div>

    <p v-if="error" :id="errorId" role="alert" class="text-sm text-destructive">{{ error }}</p>

    <div class="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        :disabled="props.disabled"
        @click="openFileDialog"
      >
        {{ natural ? props.replaceLabel : props.chooseLabel }}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        :disabled="props.disabled || !natural"
        @click="reset"
      >
        {{ props.resetLabel }}
      </Button>
      <Button
        type="button"
        size="sm"
        :disabled="props.disabled || !natural || applying"
        @click="apply"
      >
        {{ props.applyLabel }}
      </Button>
    </div>
  </div>
</template>
