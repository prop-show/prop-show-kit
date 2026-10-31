<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { CheckIcon, EraserIcon, Undo2Icon } from "@lucide/vue";
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, useTemplateRef } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  SignatureExport,
  SignatureImageType,
  SignaturePoint,
  SignatureStroke,
} from "./stroke";
import {
  canvasBackground,
  clampQuality,
  isSignatureEmpty,
  normalizeImageType,
  normalizeStrokeWidth,
  paintStroke,
  pointFromClient,
  shouldAppendPoint,
  undoStroke,
} from "./stroke";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    penColor?: string;
    background?: string;
    strokeWidth?: number;
    outputType?: SignatureImageType;
    quality?: number;
    disabled?: boolean;
    emptyLabel?: string;
    clearLabel?: string;
    undoLabel?: string;
    exportLabel?: string;
    instructions?: string;
    emptyStatus?: string;
    signedStatus?: string;
    clearedStatus?: string;
    undoStatus?: string;
    savedStatus?: string;
    exportError?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    penColor: "#171717",
    strokeWidth: 2.25,
    outputType: "image/png",
    quality: 0.92,
    disabled: false,
    emptyLabel: "Sign here",
    clearLabel: "Clear",
    undoLabel: "Undo",
    exportLabel: "Save signature",
    instructions:
      "Signature pad. Draw with a pointer, finger, or pen. Backspace undoes the last stroke. Delete clears the signature.",
    emptyStatus: "Signature is empty.",
    signedStatus: "Stroke added.",
    clearedStatus: "Signature cleared.",
    undoStatus: "Last stroke removed.",
    savedStatus: "Signature saved.",
    exportError: "The browser could not read this signature.",
  },
);

const signature = defineModel<string | null>({ default: null });

const emit = defineEmits<{
  export: [result: SignatureExport];
  clear: [];
  undo: [];
  change: [state: { empty: boolean }];
}>();

const baseId = useId();
const labelId = `${baseId}-label`;
const hintId = `${baseId}-hint`;
const canvasRef = useTemplateRef<HTMLCanvasElement>("canvas");
const strokes = ref<SignatureStroke[]>([]);
const error = shallowRef("");
const status = shallowRef(props.emptyStatus);
const empty = computed(() => isSignatureEmpty(strokes.value));
let drawing = false;
let pointerId: number | null = null;
let observer: ResizeObserver | undefined;

function pen() {
  return props.penColor || "#171717";
}

function paint() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(rect.width, 1);
  const cssHeight = Math.max(rect.height, 1);
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 3);
  const width = Math.max(1, Math.round(cssWidth * dpr));
  const height = Math.max(1, Math.round(cssHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = pen();
  ctx.fillStyle = pen();
  const widthPx = normalizeStrokeWidth(props.strokeWidth);
  for (const stroke of strokes.value) paintStroke(ctx, stroke, widthPx);
}

function invalidateSaved() {
  if (signature.value != null) signature.value = null;
}

function pointFromEvent(event: PointerEvent): SignaturePoint | null {
  const canvas = canvasRef.value;
  if (!canvas) return null;
  return pointFromClient(
    event.clientX,
    event.clientY,
    canvas.getBoundingClientRect(),
    event.pressure,
  );
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0 || pointerId != null) return;
  const point = pointFromEvent(event);
  const canvas = canvasRef.value;
  if (!point || !canvas) return;
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  pointerId = event.pointerId;
  drawing = true;
  error.value = "";
  invalidateSaved();
  strokes.value = [...strokes.value, [point]];
  paint();
}

function onPointerMove(event: PointerEvent) {
  if (!drawing || pointerId !== event.pointerId) return;
  const point = pointFromEvent(event);
  if (!point) return;
  const next = strokes.value.slice();
  const current = next[next.length - 1];
  if (!current || !shouldAppendPoint(current[current.length - 1], point)) return;
  next[next.length - 1] = [...current, point];
  strokes.value = next;
  paint();
}

function endStroke(event: PointerEvent) {
  if (pointerId !== event.pointerId) return;
  const canvas = canvasRef.value;
  if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  pointerId = null;
  if (!drawing) return;
  drawing = false;
  status.value = props.signedStatus;
  emit("change", { empty: isSignatureEmpty(strokes.value) });
}

function clear() {
  if (props.disabled || empty.value) return;
  drawing = false;
  pointerId = null;
  strokes.value = [];
  signature.value = null;
  error.value = "";
  status.value = props.clearedStatus;
  emit("clear");
  emit("change", { empty: true });
  paint();
}

function undo() {
  if (props.disabled || empty.value) return;
  drawing = false;
  pointerId = null;
  strokes.value = undoStroke(strokes.value);
  signature.value = null;
  error.value = "";
  status.value = props.undoStatus;
  emit("undo");
  emit("change", { empty: isSignatureEmpty(strokes.value) });
  paint();
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return;
  if (event.key === "Backspace") {
    event.preventDefault();
    undo();
  } else if (event.key === "Delete") {
    event.preventDefault();
    clear();
  }
}

async function rasterize(): Promise<SignatureExport | null> {
  const canvas = canvasRef.value;
  if (!canvas || isSignatureEmpty(strokes.value)) return null;
  paint();
  const type = normalizeImageType(props.outputType);
  const quality = clampQuality(props.quality);
  const copy = document.createElement("canvas");
  copy.width = canvas.width;
  copy.height = canvas.height;
  const ctx = copy.getContext("2d");
  if (!ctx) return null;
  const background = canvasBackground(type, props.background);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, copy.width, copy.height);
  }
  ctx.drawImage(canvas, 0, 0);
  let dataUrl: string;
  try {
    dataUrl = copy.toDataURL(type, quality);
  } catch {
    return null;
  }
  const blob = await new Promise<Blob | null>((resolve) => {
    copy.toBlob((value) => resolve(value), type, quality);
  });
  if (!blob) return null;
  return { dataUrl, blob, width: copy.width, height: copy.height };
}

async function exportSignature(): Promise<SignatureExport | null> {
  if (props.disabled) return null;
  const result = await rasterize();
  if (!result) {
    if (!isSignatureEmpty(strokes.value)) error.value = props.exportError;
    return null;
  }
  signature.value = result.dataUrl;
  error.value = "";
  status.value = props.savedStatus;
  emit("export", result);
  return result;
}

async function toDataURL() {
  return (await rasterize())?.dataUrl ?? null;
}

async function toBlob() {
  return (await rasterize())?.blob ?? null;
}

function isEmpty() {
  return isSignatureEmpty(strokes.value);
}

function onExportClick() {
  void exportSignature();
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  observer = new ResizeObserver(() => paint());
  observer.observe(canvas);
  paint();
});

onBeforeUnmount(() => observer?.disconnect());

defineExpose({ clear, undo, exportSignature, toDataURL, toBlob, isEmpty });
</script>

<template>
  <div
    data-slot="signature-pad"
    :data-empty="empty ? '' : undefined"
    :class="cn('grid gap-3 text-foreground', props.disabled && 'opacity-60', props.class)"
  >
    <div v-if="props.label" :id="labelId" class="text-sm font-medium">{{ props.label }}</div>
    <div class="relative h-40 overflow-hidden rounded-lg border border-border bg-white">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-8 bottom-8 border-b border-dashed border-neutral-300"
      />
      <p
        v-if="empty"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-4 top-6 text-center text-sm text-neutral-400"
      >
        {{ props.emptyLabel }}
      </p>
      <canvas
        ref="canvas"
        class="relative z-10 block size-full touch-none bg-transparent"
        :class="props.disabled && 'pointer-events-none'"
        :aria-labelledby="props.label ? labelId : hintId"
        :aria-describedby="props.label ? hintId : undefined"
        :aria-disabled="props.disabled || undefined"
        :tabindex="props.disabled ? -1 : 0"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="endStroke"
        @pointercancel="endStroke"
        @keydown="onKeydown"
      >
        {{ props.instructions }}
      </canvas>
    </div>
    <p :id="hintId" class="sr-only">{{ props.instructions }}</p>
    <div class="flex flex-wrap justify-end gap-2">
      <Button type="button" variant="outline" :disabled="props.disabled || empty" @click="undo">
        <Undo2Icon aria-hidden="true" />
        {{ props.undoLabel }}
      </Button>
      <Button type="button" variant="outline" :disabled="props.disabled || empty" @click="clear">
        <EraserIcon aria-hidden="true" />
        {{ props.clearLabel }}
      </Button>
      <Button type="button" :disabled="props.disabled || empty" @click="onExportClick">
        <CheckIcon aria-hidden="true" />
        {{ props.exportLabel }}
      </Button>
    </div>
    <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>
    <p class="sr-only" aria-live="polite">{{ status }}</p>
  </div>
</template>
