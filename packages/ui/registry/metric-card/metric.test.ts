import { expect, test } from "vite-plus/test";

import {
  formatMetricDelta,
  formatMetricValue,
  hasMetricDelta,
  metricColumnClass,
  metricDirectionLabel,
  resolveMetricTone,
  resolveMetricTrend,
} from "./metric";

test("treats only finite numbers and non-blank strings as a delta", () => {
  expect(hasMetricDelta(undefined)).toBe(false);
  expect(hasMetricDelta(null)).toBe(false);
  expect(hasMetricDelta("")).toBe(false);
  expect(hasMetricDelta("  ")).toBe(false);
  expect(hasMetricDelta(Number.NaN)).toBe(false);
  expect(hasMetricDelta(Number.POSITIVE_INFINITY)).toBe(false);
  expect(hasMetricDelta(0)).toBe(true);
  expect(hasMetricDelta(-2)).toBe(true);
  expect(hasMetricDelta("+18.6%")).toBe(true);
});

test("prints a leading plus for a positive numeric delta and leaves strings trimmed", () => {
  expect(formatMetricDelta(18.6)).toBe("+18.6");
  expect(formatMetricDelta(0)).toBe("0");
  expect(formatMetricDelta(-3)).toBe("-3");
  expect(formatMetricDelta(Number.NaN)).toBe("");
  expect(formatMetricDelta("  +18.6%  ")).toBe("+18.6%");
  expect(formatMetricValue(12)).toBe("12");
  expect(formatMetricValue("128.4k")).toBe("128.4k");
  expect(formatMetricValue(Number.NaN)).toBe("");
  expect(formatMetricValue(null)).toBe("");
});

test("infers a trend from the delta sign and lets an explicit trend win", () => {
  expect(resolveMetricTrend(undefined, undefined)).toBeNull();
  expect(resolveMetricTrend("   ", undefined)).toBeNull();
  expect(resolveMetricTrend("+18.6%", undefined)).toBe("up");
  expect(resolveMetricTrend("  +2 ", undefined)).toBe("up");
  expect(resolveMetricTrend("-0.08%", undefined)).toBe("down");
  expect(resolveMetricTrend("−3", undefined)).toBe("down");
  expect(resolveMetricTrend("–1", undefined)).toBe("down");
  expect(resolveMetricTrend(4, undefined)).toBe("up");
  expect(resolveMetricTrend(-1, undefined)).toBe("down");
  expect(resolveMetricTrend(0, undefined)).toBe("neutral");
  expect(resolveMetricTrend("0", undefined)).toBe("neutral");
  expect(resolveMetricTrend("18.6%", undefined)).toBe("up");
  expect(resolveMetricTrend("1,284", undefined)).toBe("up");
  expect(resolveMetricTrend("flat", undefined)).toBe("neutral");
  expect(resolveMetricTrend("-3", "up")).toBe("up");
  expect(resolveMetricTrend(undefined, "down")).toBe("down");
});

test("maps an upward delta to a positive tone unless the caller overrides it", () => {
  expect(resolveMetricTone("up", undefined)).toBe("positive");
  expect(resolveMetricTone("down", undefined)).toBe("negative");
  expect(resolveMetricTone("neutral", undefined)).toBe("neutral");
  expect(resolveMetricTone("down", "positive")).toBe("positive");
  expect(resolveMetricTone("up", "negative")).toBe("negative");
  expect(metricDirectionLabel("up")).toBe("Increased");
  expect(metricDirectionLabel("down")).toBe("Decreased");
  expect(metricDirectionLabel("neutral")).toBe("No change");
});

test("uses a three-column layout unless the column count is 1, 2, or 4", () => {
  expect(metricColumnClass(1)).toBe("grid-cols-1");
  expect(metricColumnClass(2)).toBe("sm:grid-cols-2");
  expect(metricColumnClass(3)).toBe("sm:grid-cols-2 lg:grid-cols-3");
  expect(metricColumnClass(4)).toBe("sm:grid-cols-2 xl:grid-cols-4");
  expect(metricColumnClass(undefined)).toBe("sm:grid-cols-2 lg:grid-cols-3");
  expect(metricColumnClass(0)).toBe("sm:grid-cols-2 lg:grid-cols-3");
  expect(metricColumnClass(5)).toBe("sm:grid-cols-2 lg:grid-cols-3");
});
