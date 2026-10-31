import { expect, test } from "vite-plus/test";
import {
  canvasBackground,
  clampPressure,
  isSignatureEmpty,
  normalizeImageType,
  paintStroke,
  pointFromClient,
  shouldAppendPoint,
  strokeCommands,
  undoStroke,
  type SignaturePoint,
  type StrokeContext,
} from "./stroke";

const origin: SignaturePoint = { x: 1, y: 2, pressure: 0.5 };

test("treats a pad with no points as empty", () => {
  expect(isSignatureEmpty([])).toBe(true);
  expect(isSignatureEmpty([[]])).toBe(true);
  expect(isSignatureEmpty([[origin]])).toBe(false);
});

test("undo drops only the last stroke", () => {
  const first = [origin];
  const second = [{ x: 4, y: 5, pressure: 1 }];
  expect(undoStroke([first, second])).toEqual([first]);
  expect(undoStroke([])).toEqual([]);
});

test("keeps the first point and skips tiny moves", () => {
  expect(shouldAppendPoint(undefined, origin)).toBe(true);
  expect(shouldAppendPoint(origin, { x: 1.2, y: 2.2, pressure: 0.5 })).toBe(false);
  expect(shouldAppendPoint(origin, { x: 3, y: 2, pressure: 0.5 })).toBe(true);
});

test("clamps a pointer into the pad and substitutes missing pressure", () => {
  expect(clampPressure(0)).toBe(0.5);
  expect(clampPressure(Number.NaN)).toBe(0.5);
  expect(clampPressure(1.4)).toBe(1);
  const rect = { left: 10, top: 20, width: 100, height: 40 };
  expect(pointFromClient(0, 0, rect, 0)).toEqual({ x: 0, y: 0, pressure: 0.5 });
  expect(pointFromClient(200, 80, rect, 0.25)).toEqual({ x: 100, y: 40, pressure: 0.25 });
  expect(pointFromClient(10, 20, { left: 0, top: 0, width: 0, height: 10 }, 1)).toBeNull();
});

test("fills JPEG exports and leaves PNG transparent unless a background is set", () => {
  expect(canvasBackground("image/jpeg")).toBe("#ffffff");
  expect(canvasBackground("image/jpeg", "#111111")).toBe("#111111");
  expect(canvasBackground("image/png")).toBeNull();
  expect(canvasBackground("image/webp", "#eeeeee")).toBe("#eeeeee");
  expect(normalizeImageType("image/gif")).toBe("image/png");
  expect(normalizeImageType("image/webp")).toBe("image/webp");
});

test("draws a tap as a dot and a longer stroke as midpoint curves", () => {
  const dot = strokeCommands([origin], 4);
  expect(dot).toEqual([{ op: "dot", x: 1, y: 2, radius: 2 }]);
  const curve = strokeCommands(
    [origin, { x: 5, y: 2, pressure: 0.5 }, { x: 9, y: 6, pressure: 0.5 }],
    2,
  );
  expect(curve.map((command) => command.op)).toEqual(["move", "quad", "line"]);
  expect(curve[1]).toMatchObject({ cx: 5, cy: 2, x: 7, y: 4 });
});

test("replays a dot with a fill and a curve with a stroke", () => {
  const calls: string[] = [];
  const ctx: StrokeContext = {
    lineWidth: 0,
    beginPath: () => calls.push("begin"),
    moveTo: (x, y) => calls.push(`move ${x} ${y}`),
    quadraticCurveTo: (cx, cy, x, y) => calls.push(`quad ${cx} ${cy} ${x} ${y}`),
    lineTo: (x, y) => calls.push(`line ${x} ${y}`),
    stroke: () => calls.push("stroke"),
    arc: (x, y, radius) => calls.push(`arc ${x} ${y} ${radius}`),
    fill: () => calls.push("fill"),
  };
  paintStroke(ctx, [origin], 4);
  expect(calls).toEqual(["begin", "arc 1 2 2", "fill"]);
  calls.length = 0;
  paintStroke(ctx, [origin, { x: 5, y: 2, pressure: 1 }], 3);
  expect(calls[0]).toBe("begin");
  expect(calls.at(-1)).toBe("stroke");
  expect(ctx.lineWidth).toBe(3);
});
