<script setup lang="ts" generic="T extends SortableItem">
import type { HTMLAttributes, VNode } from "vue";

import { GripVerticalIcon } from "@lucide/vue";
import { computed, nextTick, ref, useId, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { SortableItem } from "./order";

import { announcement, dropIndex, itemLabel, moveItem, sameIds } from "./order";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue: T[];
    label: string;
    disabled?: boolean;
    instructions?: string;
    emptyLabel?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    disabled: false,
    instructions:
      "Press Space or Enter to pick up a row. Use the arrow keys to move it, Home and End to move it to the start or end, Space or Enter to drop it, and Escape to cancel.",
    emptyLabel: "No items to reorder.",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: T[]];
  reorder: [payload: { item: T; from: number; to: number }];
}>();

defineSlots<{
  item?: (props: { item: T; index: number }) => VNode[];
}>();

const baseId = useId();
const labelId = `${baseId}-label`;
const instructionsId = `${baseId}-instructions`;
const listRef = useTemplateRef<HTMLElement>("list");
const activeId = ref<string | null>(null);
const origin = ref<T[] | null>(null);
const status = ref("");
let pointerId: number | null = null;
let reordering = false;

const rootClass = computed(() =>
  cn("flex w-full flex-col gap-2", activeId.value && "select-none", props.class),
);

function positionOf(id: string, list: readonly T[] = props.modelValue) {
  const index = list.findIndex((item) => item.id === id);
  const item = list[index];
  if (!item || index < 0) return null;
  return {
    item,
    index,
    label: itemLabel(item),
    position: index + 1,
    total: list.length,
  };
}

function grab(id: string) {
  const current = positionOf(id);
  if (!current || props.disabled || current.item.disabled) return;
  if (activeId.value !== id) {
    activeId.value = id;
    origin.value = props.modelValue.slice();
  }
  status.value = announcement("grabbed", current);
}

function drop(id: string) {
  if (activeId.value !== id) return;
  const current = positionOf(id);
  activeId.value = null;
  origin.value = null;
  pointerId = null;
  if (current) status.value = announcement("dropped", current);
}

function cancel(id: string) {
  if (activeId.value !== id) return;
  const snapshot = origin.value;
  activeId.value = null;
  origin.value = null;
  pointerId = null;
  if (!snapshot) return;
  const restored = positionOf(id, snapshot);
  if (!sameIds(snapshot, props.modelValue)) emit("update:modelValue", snapshot.slice());
  if (restored) status.value = announcement("cancelled", restored);
}

function applyMove(from: number, to: number, announceMove = true) {
  if (props.disabled) return;
  const current = props.modelValue;
  const item = current[from];
  if (!item || item.disabled) return;
  const next = moveItem(current, from, to);
  if (sameIds(current, next)) return;
  reordering = true;
  emit("update:modelValue", next);
  emit("reorder", { item, from, to });
  if (announceMove) {
    const placed = positionOf(item.id, next);
    if (placed) status.value = announcement("moved", placed);
  }
  void nextTick(() => {
    if (activeId.value === item.id) focusHandle(item.id);
    reordering = false;
  });
}

function domInSync() {
  const list = listRef.value;
  if (!list) return false;
  const domIds = [...list.querySelectorAll<HTMLElement>("[data-sortable-item]")].map((row) => ({
    id: row.dataset.sortableId ?? "",
  }));
  return sameIds(props.modelValue, domIds);
}

function focusHandle(id: string) {
  const list = listRef.value;
  if (!list || typeof CSS === "undefined") return;
  list
    .querySelector<HTMLElement>(`[data-sortable-id="${CSS.escape(id)}"] [data-sortable-handle]`)
    ?.focus();
}

function firstEnabled(start: number, step: number) {
  for (let index = start; index >= 0 && index < props.modelValue.length; index += step) {
    const item = props.modelValue[index];
    if (item && !item.disabled && !props.disabled) return index;
  }
  return -1;
}

function onKeydown(event: KeyboardEvent, item: T, index: number) {
  if (props.disabled || item.disabled) return;
  const key = event.key;
  if ((key === " " || key === "Enter") && !event.repeat) {
    event.preventDefault();
    if (activeId.value === item.id) drop(item.id);
    else grab(item.id);
    return;
  }
  const grabbed = activeId.value === item.id;
  if (key === "ArrowUp" || key === "ArrowDown") {
    event.preventDefault();
    const step = key === "ArrowUp" ? -1 : 1;
    if (grabbed) {
      applyMove(index, index + step);
      return;
    }
    const next = props.modelValue[firstEnabled(index + step, step)];
    if (next) focusHandle(next.id);
    return;
  }
  if (key === "Home" || key === "End") {
    event.preventDefault();
    const targetIndex = key === "Home" ? 0 : props.modelValue.length - 1;
    if (grabbed) {
      applyMove(index, targetIndex);
      return;
    }
    const step = key === "Home" ? 1 : -1;
    const next = props.modelValue[firstEnabled(targetIndex, step)];
    if (next) focusHandle(next.id);
    return;
  }
  if (key === "Escape" && grabbed) {
    event.preventDefault();
    cancel(item.id);
  }
}

function onPointerDown(event: PointerEvent, item: T) {
  if (event.button !== 0 || props.disabled || item.disabled) return;
  const handle = event.currentTarget;
  if (!(handle instanceof HTMLElement)) return;
  event.preventDefault();
  handle.focus();
  try {
    handle.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture is optional. Keyboard reorder still works.
  }
  pointerId = event.pointerId;
  grab(item.id);
}

function onPointerMove(event: PointerEvent) {
  const list = listRef.value;
  if (event.pointerId !== pointerId || !activeId.value || !list || !domInSync()) return;
  const rows = [...list.querySelectorAll<HTMLElement>("[data-sortable-item]")];
  const from = rows.findIndex((row) => row.dataset.sortableId === activeId.value);
  if (from < 0) return;
  const rects = rows.map((row) => {
    const rect = row.getBoundingClientRect();
    return { top: rect.top, height: rect.height };
  });
  applyMove(from, dropIndex(event.clientY, rects, from), false);
}

function onPointerUp(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;
  const id = activeId.value;
  pointerId = null;
  if (id) drop(id);
}

function onPointerCancel(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;
  const id = activeId.value;
  pointerId = null;
  if (id) cancel(id);
}

function onBlur(item: T) {
  if (reordering || pointerId !== null || activeId.value !== item.id) return;
  pointerId = null;
  drop(item.id);
}

function itemClass(item: T) {
  return cn(
    "flex items-center gap-2 rounded-lg border bg-card p-2 text-card-foreground shadow-xs",
    activeId.value === item.id && "relative z-10 border-ring bg-accent shadow-md",
    (props.disabled || item.disabled) && "opacity-60",
  );
}
</script>

<template>
  <div data-slot="sortable-list" :class="rootClass">
    <p :id="labelId" class="text-sm font-medium text-foreground">{{ label }}</p>
    <p v-if="modelValue.length === 0" class="text-sm text-muted-foreground">{{ emptyLabel }}</p>
    <ul v-else ref="list" :aria-labelledby="labelId" class="flex list-none flex-col gap-2 p-0">
      <li
        v-for="(item, index) in modelValue"
        :key="item.id"
        data-sortable-item
        :data-sortable-id="item.id"
        :class="itemClass(item)"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          data-sortable-handle
          class="shrink-0 touch-none text-muted-foreground"
          :class="activeId === item.id ? 'cursor-grabbing' : 'cursor-grab'"
          :aria-label="`Reorder ${itemLabel(item)}`"
          :aria-describedby="instructionsId"
          :aria-pressed="activeId === item.id"
          :disabled="disabled || item.disabled"
          @keydown="onKeydown($event, item, index)"
          @pointerdown="onPointerDown($event, item)"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @blur="onBlur(item)"
        >
          <GripVerticalIcon aria-hidden="true" />
        </Button>
        <div class="min-w-0 flex-1">
          <slot name="item" :item="item" :index="index">
            <p class="truncate text-sm font-medium text-foreground">{{ itemLabel(item) }}</p>
            <p v-if="item.description" class="truncate text-sm text-muted-foreground">
              {{ item.description }}
            </p>
          </slot>
        </div>
      </li>
    </ul>
    <p :id="instructionsId" class="sr-only">{{ instructions }}</p>
    <div class="sr-only" aria-live="polite" aria-atomic="true">{{ status }}</div>
  </div>
</template>
