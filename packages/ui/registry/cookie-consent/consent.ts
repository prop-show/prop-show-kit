export interface CookieCategory {
  id: string;
  title: string;
  description: string;
  required?: boolean;
}

export type CookieConsentStatus = "unknown" | "accepted" | "rejected" | "custom";

export interface CookieConsentState {
  status: CookieConsentStatus;
  categories: Record<string, boolean>;
}

export const defaultCookieCategories = [
  {
    id: "necessary",
    title: "Necessary",
    description: "Security, load balancing, and storing this choice. Always on.",
    required: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Helps us see which pages are used. Off until you allow it.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Measures campaigns and similar offers. Off until you allow it.",
  },
] as const satisfies readonly CookieCategory[];

const statuses = new Set<CookieConsentStatus>(["unknown", "accepted", "rejected", "custom"]);

export function uniqueCategories(categories: readonly CookieCategory[]): CookieCategory[] {
  const seen = new Set<string>();
  const unique: CookieCategory[] = [];
  for (const category of categories) {
    if (!category.id || seen.has(category.id)) continue;
    seen.add(category.id);
    unique.push(category);
  }
  return unique;
}

function selectionFor(
  categories: readonly CookieCategory[],
  resolve: (category: CookieCategory) => boolean,
): Record<string, boolean> {
  const categoriesState: Record<string, boolean> = {};
  for (const category of uniqueCategories(categories)) {
    categoriesState[category.id] = category.required ? true : resolve(category);
  }
  return categoriesState;
}

export function unknownConsent(categories: readonly CookieCategory[]): CookieConsentState {
  return { status: "unknown", categories: selectionFor(categories, () => false) };
}

export function acceptAll(categories: readonly CookieCategory[]): CookieConsentState {
  return { status: "accepted", categories: selectionFor(categories, () => true) };
}

export function rejectOptional(categories: readonly CookieCategory[]): CookieConsentState {
  return { status: "rejected", categories: selectionFor(categories, () => false) };
}

export function savePreferences(
  categories: readonly CookieCategory[],
  selection: Readonly<Record<string, boolean>>,
): CookieConsentState {
  const listed = uniqueCategories(categories);
  const categoriesState = selectionFor(listed, (category) => Boolean(selection[category.id]));
  const optional = listed.filter((category) => !category.required);
  const enabledOptional = optional.filter((category) => categoriesState[category.id]).length;
  const status: CookieConsentStatus =
    optional.length > 0 && enabledOptional === optional.length
      ? "accepted"
      : enabledOptional === 0
        ? "rejected"
        : "custom";
  return { status, categories: categoriesState };
}

export function isConsentDecided(state: CookieConsentState | undefined): boolean {
  return !!state && state.status !== "unknown";
}

export function normalizeConsent(
  categories: readonly CookieCategory[],
  state: CookieConsentState | undefined,
): CookieConsentState {
  const listed = uniqueCategories(categories);
  if (!state || state.status === "unknown") return unknownConsent(listed);
  if (state.status === "accepted") return acceptAll(listed);
  if (state.status === "rejected") return rejectOptional(listed);
  return savePreferences(listed, state.categories);
}

/** Hash, same-site path, or http(s) URL. Anything else is dropped. */
export function cookiePolicyHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return undefined;
}

export function serializeConsent(state: CookieConsentState): string {
  return JSON.stringify({ status: state.status, categories: state.categories });
}

export function parseConsent(raw: string | null | undefined): CookieConsentState | undefined {
  if (!raw) return undefined;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as { status?: unknown; categories?: unknown };
  if (typeof record.status !== "string" || !statuses.has(record.status as CookieConsentStatus)) {
    return undefined;
  }
  const categories: Record<string, boolean> = {};
  if (
    record.categories &&
    typeof record.categories === "object" &&
    !Array.isArray(record.categories)
  ) {
    for (const [key, enabled] of Object.entries(record.categories)) {
      if (key && typeof enabled === "boolean") categories[key] = enabled;
    }
  }
  return { status: record.status as CookieConsentStatus, categories };
}
