export interface SortableItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SortableRect {
  top: number;
  height: number;
}

export interface SortablePosition {
  label: string;
  position: number;
  total: number;
}

export interface SortableReorder<T extends SortableItem = SortableItem> {
  item: T;
  from: number;
  to: number;
}

export type SortableAnnouncementKind = "grabbed" | "moved" | "dropped" | "cancelled";

export function itemLabel(item: SortableItem): string {
  const label = item.label.trim();
  return label || item.id;
}

export function sameIds<T extends { id: string }>(
  left: readonly T[],
  right: readonly T[],
): boolean {
  return left.length === right.length && left.every((item, index) => item.id === right[index]?.id);
}

/** Returns a new array. `to` is the index in that array. The input is not changed. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  if (!Number.isInteger(from) || !Number.isInteger(to)) return items.slice();
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) {
    return items.slice();
  }
  const next = items.slice();
  const [item] = next.splice(from, 1);
  if (item === undefined) return items.slice();
  next.splice(to, 0, item);
  return next;
}

/**
 * Index to pass to `moveItem` so the dragged row lands where `clientY` falls
 * among the other rows. Midpoints decide the slot, so the row does not jump
 * back and forth while the pointer stays inside it.
 */
export function dropIndex(clientY: number, rects: readonly SortableRect[], from: number): number {
  if (!Number.isInteger(from) || from < 0 || from >= rects.length) return from;
  const others = rects.filter((_, index) => index !== from);
  let insertAt = others.length;
  for (let index = 0; index < others.length; index++) {
    const rect = others[index];
    if (!rect || rect.height <= 0) continue;
    if (clientY < rect.top + rect.height / 2) {
      insertAt = index;
      break;
    }
  }
  return insertAt;
}

export function announcement(kind: SortableAnnouncementKind, detail: SortablePosition): string {
  const place = `position ${detail.position} of ${detail.total}`;
  if (kind === "grabbed") {
    return `${detail.label} grabbed. Current ${place}. Use the arrow keys to move, Space to drop, Escape to cancel.`;
  }
  if (kind === "moved") return `${detail.label}. Position ${detail.position} of ${detail.total}.`;
  if (kind === "dropped") return `${detail.label} dropped. Final ${place}.`;
  return `Reorder cancelled. ${detail.label} returned to ${place}.`;
}
