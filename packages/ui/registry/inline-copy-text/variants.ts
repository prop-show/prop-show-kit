/** Text style classes for the variants `InlineCopyText` supports. */
export const inlineCopyTextVariants = {
  variant: {
    body: "text-foreground",
    secondary: "text-muted-foreground",
    success: "text-green-600 dark:text-green-400",
    error: "text-destructive",
    mono: "font-mono",
    "mono-secondary": "font-mono text-muted-foreground",
  },
  size: {
    xs: "text-xs/[inherit]",
    sm: "text-sm/[inherit]",
    base: "text-base/[inherit]",
    lg: "text-lg/[inherit]",
  },
} as const;

/** Heading variants are not supported by `InlineCopyText`. */
export type InlineCopyTextVariant = keyof typeof inlineCopyTextVariants.variant;
export type InlineCopyTextSize = keyof typeof inlineCopyTextVariants.size;

/**
 * Phrasing elements accepted by the `as` prop. The control renders the text
 * inside a `<button>`, so block/flow elements are invalid HTML here.
 */
export type InlineCopyTextElement =
  | "span"
  | "label"
  | "code"
  | "em"
  | "strong"
  | "small"
  | "abbr"
  | "time";

export interface InlineCopyTextLabels {
  /** Accessible name before the text is copied. @default "Copy to clipboard" */
  copyAction?: string;
  /** Accessible name and live-region message after copying. @default "Copied" */
  copied?: string;
  /** Accessible name and live-region message when the Clipboard API is unavailable. @default "Copy not supported" */
  unsupported?: string;
}

export const INLINE_COPY_TEXT_VARIANT_DEFAULT: InlineCopyTextVariant = "mono-secondary";
export const INLINE_COPY_TEXT_SIZE_DEFAULT: InlineCopyTextSize = "base";

export function isMonospaceVariant(variant: InlineCopyTextVariant) {
  return variant === "mono" || variant === "mono-secondary";
}

/**
 * Mirrors Kumo `Text`: body variants honour every size, monospace variants only
 * accept `lg` and otherwise fall back to `sm`.
 */
export function resolveInlineCopyTextSize(
  variant: InlineCopyTextVariant,
  size: InlineCopyTextSize | undefined,
) {
  if (isMonospaceVariant(variant)) {
    return size === "lg" ? inlineCopyTextVariants.size.base : inlineCopyTextVariants.size.sm;
  }
  return inlineCopyTextVariants.size[size ?? INLINE_COPY_TEXT_SIZE_DEFAULT];
}

/** Mirrors Kumo `resolveCopyValue`. */
export function resolveInlineCopyTextValue(
  value: string | undefined,
  slotText: string | undefined,
) {
  if (value !== undefined) return value;
  if (slotText !== undefined) return slotText;
  throw new Error("InlineCopyText requires a `value` prop when the default slot is not a string.");
}
