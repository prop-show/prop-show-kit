export type MetricTrend = "up" | "down" | "neutral";
export type MetricTone = "positive" | "negative" | "neutral";

export const metricToneClass: Record<MetricTone, string> = {
  positive: "text-green-600 dark:text-green-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral: "text-muted-foreground",
};

export function hasMetricDelta(
  delta: string | number | null | undefined,
): delta is string | number {
  if (typeof delta === "number") return Number.isFinite(delta);
  if (typeof delta !== "string") return false;
  return delta.trim() !== "";
}

export function formatMetricValue(value: string | number | null | undefined): string {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value !== "string") return "";
  return value;
}

export function formatMetricDelta(delta: string | number): string {
  if (typeof delta === "number") {
    if (!Number.isFinite(delta)) return "";
    if (delta > 0) return `+${delta}`;
    return String(delta);
  }
  return delta.trim();
}

function trendFromText(text: string): MetricTrend {
  const trimmed = text.trim();
  if (trimmed.startsWith("+")) return "up";
  if (trimmed.startsWith("-") || trimmed.startsWith("−") || trimmed.startsWith("–")) return "down";
  const numeric = Number(trimmed.replace(/,/g, "").replace(/%$/, ""));
  if (!Number.isFinite(numeric) || numeric === 0) return "neutral";
  return numeric > 0 ? "up" : "down";
}

export function resolveMetricTrend(
  delta: string | number | null | undefined,
  trend?: MetricTrend | null,
): MetricTrend | null {
  if (trend === "up" || trend === "down" || trend === "neutral") return trend;
  if (!hasMetricDelta(delta)) return null;
  if (typeof delta === "number") {
    if (delta > 0) return "up";
    if (delta < 0) return "down";
    return "neutral";
  }
  return trendFromText(delta);
}

export function resolveMetricTone(trend: MetricTrend, tone?: MetricTone | null): MetricTone {
  if (tone === "positive" || tone === "negative" || tone === "neutral") return tone;
  if (trend === "up") return "positive";
  if (trend === "down") return "negative";
  return "neutral";
}

export function metricDirectionLabel(trend: MetricTrend): string {
  if (trend === "up") return "Increased";
  if (trend === "down") return "Decreased";
  return "No change";
}

export function metricColumnClass(columns: number | undefined): string {
  if (columns === 1) return "grid-cols-1";
  if (columns === 2) return "sm:grid-cols-2";
  if (columns === 4) return "sm:grid-cols-2 xl:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}
