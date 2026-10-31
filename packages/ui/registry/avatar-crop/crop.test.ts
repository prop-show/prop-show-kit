import { expect, test } from "vite-plus/test";

import {
  clampFrame,
  coverScale,
  initialFrame,
  normalizeOutputSize,
  panBy,
  resizeFrame,
  sourceRect,
  zoomAt,
  zoomFactor,
} from "./crop";
import type { CropFrame, ImageSize } from "./crop";

const landscape: ImageSize = { width: 400, height: 200 };
const portrait: ImageSize = { width: 200, height: 400 };

function covers(frame: CropFrame, image: ImageSize, viewport: number) {
  const right = frame.x + image.width * frame.scale;
  const bottom = frame.y + image.height * frame.scale;
  return (
    frame.x <= 0.001 && frame.y <= 0.001 && right >= viewport - 0.001 && bottom >= viewport - 0.001
  );
}

function sourceInside(frame: CropFrame, image: ImageSize, viewport: number) {
  const rect = sourceRect(frame, viewport);
  expect(rect.size).toBeGreaterThan(0);
  expect(rect.x).toBeGreaterThanOrEqual(-0.001);
  expect(rect.y).toBeGreaterThanOrEqual(-0.001);
  expect(rect.x + rect.size).toBeLessThanOrEqual(image.width + 0.001);
  expect(rect.y + rect.size).toBeLessThanOrEqual(image.height + 0.001);
}

test("cover scale fills the shorter side of the viewport", () => {
  expect(coverScale(landscape, 100)).toBeCloseTo(0.5);
  expect(coverScale(portrait, 100)).toBeCloseTo(0.5);
  expect(coverScale({ width: 50, height: 50 }, 100)).toBe(2);
  expect(coverScale({ width: 0, height: 10 }, 100)).toBe(1);
});

test("the initial frame is centered and covers the viewport", () => {
  const frame = initialFrame(landscape, 100);
  expect(frame.x).toBeCloseTo(-50);
  expect(frame.y).toBeCloseTo(0);
  expect(zoomFactor(frame, landscape, 100)).toBeCloseTo(1);
  expect(covers(frame, landscape, 100)).toBe(true);
  sourceInside(frame, landscape, 100);
  const rect = sourceRect(frame, 100);
  expect(rect.x).toBeCloseTo(100);
  expect(rect.y).toBeCloseTo(0);
  expect(rect.size).toBeCloseTo(200);
});

test("pan stops at the image edge", () => {
  const start = initialFrame(landscape, 100);
  const pushed = panBy(start, 1000, -1000, landscape, 100);
  expect(pushed.x).toBeCloseTo(0);
  expect(pushed.y).toBeCloseTo(0);
  expect(covers(pushed, landscape, 100)).toBe(true);
  const other = panBy(start, -1000, 1000, landscape, 100);
  expect(other.x).toBeCloseTo(-100);
  expect(other.y).toBeCloseTo(0);
  sourceInside(other, landscape, 100);
});

test("zoom keeps the source point under the origin", () => {
  const start = initialFrame(landscape, 100);
  const originX = 50;
  const originY = 50;
  const beforeX = (originX - start.x) / start.scale;
  const beforeY = (originY - start.y) / start.scale;
  const zoomed = zoomAt(start, landscape, 100, start.scale * 2, originX, originY, 4);
  expect((originX - zoomed.x) / zoomed.scale).toBeCloseTo(beforeX);
  expect((originY - zoomed.y) / zoomed.scale).toBeCloseTo(beforeY);
  expect(zoomFactor(zoomed, landscape, 100)).toBeCloseTo(2);
  expect(covers(zoomed, landscape, 100)).toBe(true);
  sourceInside(zoomed, landscape, 100);
});

test("zoom stays between cover and maxZoom", () => {
  const start = initialFrame(portrait, 100);
  const smaller = zoomAt(start, portrait, 100, 0.01, 50, 50, 3);
  expect(zoomFactor(smaller, portrait, 100)).toBeCloseTo(1);
  const larger = zoomAt(start, portrait, 100, 99, 50, 50, 3);
  expect(zoomFactor(larger, portrait, 100)).toBeCloseTo(3);
  expect(covers(larger, portrait, 100)).toBe(true);
});

test("resizing the viewport keeps the centered source point", () => {
  const start = zoomAt(initialFrame(landscape, 100), landscape, 100, 1, 50, 50, 4);
  const sourceX = (50 - start.x) / start.scale;
  const sourceY = (50 - start.y) / start.scale;
  const next = resizeFrame(start, landscape, 100, 200, 4);
  expect((100 - next.x) / next.scale).toBeCloseTo(sourceX);
  expect((100 - next.y) / next.scale).toBeCloseTo(sourceY);
  expect(covers(next, landscape, 200)).toBe(true);
  expect(clampFrame({ x: 10, y: 10, scale: Number.NaN }, landscape, 100).scale).toBeCloseTo(0.5);
});

test("output size is a pixel count inside the export bounds", () => {
  expect(normalizeOutputSize(256.4)).toBe(256);
  expect(normalizeOutputSize(1)).toBe(16);
  expect(normalizeOutputSize(9000)).toBe(4096);
  expect(normalizeOutputSize(Number.NaN)).toBe(256);
});
