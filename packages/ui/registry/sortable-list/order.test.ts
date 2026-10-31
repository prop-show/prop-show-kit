import { expect, test } from "vite-plus/test";

import { announcement, dropIndex, itemLabel, moveItem, sameIds } from "./order";

const rows = ["hero", "proof", "pricing", "faq"];

test("moves an item without changing the input", () => {
  const input = rows.slice();
  expect(moveItem(input, 0, 2)).toEqual(["proof", "pricing", "hero", "faq"]);
  expect(moveItem(input, 3, 1)).toEqual(["hero", "faq", "proof", "pricing"]);
  expect(input).toEqual(rows);
});

test("leaves the order alone for a no-op or an out-of-range index", () => {
  expect(moveItem(rows, 1, 1)).toEqual(rows);
  expect(moveItem(rows, -1, 0)).toEqual(rows);
  expect(moveItem(rows, 0, 4)).toEqual(rows);
  expect(moveItem(rows, 1.5, 2)).toEqual(rows);
  expect(
    sameIds(
      moveItem(rows, 0, 0).map((id) => ({ id })),
      rows.map((id) => ({ id })),
    ),
  ).toBe(true);
});

test("picks the slot from row midpoints", () => {
  const rects = [
    { top: 0, height: 40 },
    { top: 48, height: 40 },
    { top: 96, height: 40 },
  ];
  expect(dropIndex(10, rects, 0)).toBe(0);
  expect(dropIndex(70, rects, 0)).toBe(1);
  expect(dropIndex(120, rects, 0)).toBe(2);
  expect(dropIndex(10, rects, 2)).toBe(0);
  expect(dropIndex(50, rects, 2)).toBe(1);
  expect(dropIndex(100, rects, 2)).toBe(2);
  expect(dropIndex(20, rects, -1)).toBe(-1);
  expect(dropIndex(20, [], 0)).toBe(0);
});

test("announces grab, move, drop, and cancel with a 1-based position", () => {
  const detail = { label: "Hero", position: 2, total: 4 };
  expect(announcement("grabbed", detail)).toBe(
    "Hero grabbed. Current position 2 of 4. Use the arrow keys to move, Space to drop, Escape to cancel.",
  );
  expect(announcement("moved", detail)).toBe("Hero. Position 2 of 4.");
  expect(announcement("dropped", detail)).toBe("Hero dropped. Final position 2 of 4.");
  expect(announcement("cancelled", detail)).toBe(
    "Reorder cancelled. Hero returned to position 2 of 4.",
  );
  expect(itemLabel({ id: "hero", label: "  Hero  " })).toBe("Hero");
  expect(itemLabel({ id: "hero", label: "   " })).toBe("hero");
});
