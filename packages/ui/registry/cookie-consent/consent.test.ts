import { expect, test } from "vite-plus/test";
import {
  acceptAll,
  cookiePolicyHref,
  isConsentDecided,
  normalizeConsent,
  parseConsent,
  rejectOptional,
  savePreferences,
  serializeConsent,
  unknownConsent,
} from "./consent";

const categories = [
  { id: "necessary", title: "Necessary", description: "Required", required: true },
  { id: "analytics", title: "Analytics", description: "Optional" },
  { id: "marketing", title: "Marketing", description: "Optional" },
];

test("starts undecided with only required categories on", () => {
  expect(unknownConsent(categories)).toEqual({
    status: "unknown",
    categories: { necessary: true, analytics: false, marketing: false },
  });
  expect(isConsentDecided(unknownConsent(categories))).toBe(false);
  expect(isConsentDecided(undefined)).toBe(false);
});

test("accepts every category and rejects optional ones", () => {
  expect(acceptAll(categories)).toEqual({
    status: "accepted",
    categories: { necessary: true, analytics: true, marketing: true },
  });
  expect(rejectOptional(categories)).toEqual({
    status: "rejected",
    categories: { necessary: true, analytics: false, marketing: false },
  });
  expect(isConsentDecided(rejectOptional(categories))).toBe(true);
});

test("saves a custom selection and forces required categories on", () => {
  expect(
    savePreferences(categories, {
      necessary: false,
      analytics: true,
      marketing: false,
      extra: true,
    }),
  ).toEqual({
    status: "custom",
    categories: { necessary: true, analytics: true, marketing: false },
  });
});

test("labels an all-on save as accepted and an only-required save as rejected", () => {
  expect(savePreferences(categories, { analytics: true, marketing: true }).status).toBe("accepted");
  expect(savePreferences(categories, {}).status).toBe("rejected");
  expect(
    savePreferences(
      [{ id: "necessary", title: "Necessary", description: "Required", required: true }],
      {},
    ).status,
  ).toBe("rejected");
});

test("drops blank and duplicate category ids", () => {
  const duplicated = [
    categories[0]!,
    { id: "", title: "Blank", description: "Skip" },
    categories[1]!,
    { ...categories[1]!, title: "Again" },
  ];
  expect(acceptAll(duplicated).categories).toEqual({ necessary: true, analytics: true });
});

test("normalizes a stored choice against the current categories", () => {
  expect(normalizeConsent(categories, undefined).status).toBe("unknown");
  expect(normalizeConsent(categories, { status: "accepted", categories: {} }).categories).toEqual({
    necessary: true,
    analytics: true,
    marketing: true,
  });
  expect(
    normalizeConsent(categories, { status: "rejected", categories: { marketing: true } }).categories
      .marketing,
  ).toBe(false);
  expect(
    normalizeConsent(categories, { status: "custom", categories: { analytics: true } }).categories,
  ).toEqual({ necessary: true, analytics: true, marketing: false });
  expect(
    normalizeConsent(categories, {
      status: "custom",
      categories: { analytics: true, marketing: true },
    }).status,
  ).toBe("accepted");
});

test("round-trips consent JSON and rejects malformed storage", () => {
  const state = savePreferences(categories, { analytics: true });
  expect(parseConsent(serializeConsent(state))).toEqual(state);
  expect(parseConsent(null)).toBeUndefined();
  expect(parseConsent("")).toBeUndefined();
  expect(parseConsent("{")).toBeUndefined();
  expect(parseConsent("[]")).toBeUndefined();
  expect(parseConsent(JSON.stringify({ status: "nope" }))).toBeUndefined();
  expect(
    parseConsent(JSON.stringify({ status: "custom", categories: { analytics: "yes" } })),
  ).toEqual({
    status: "custom",
    categories: {},
  });
});

test("allows a hash, a site path, or an http(s) policy URL", () => {
  expect(cookiePolicyHref("#cookie-policy")).toBe("#cookie-policy");
  expect(cookiePolicyHref(" /privacy ")).toBe("/privacy");
  expect(cookiePolicyHref("https://example.com/privacy")).toBe("https://example.com/privacy");
  expect(cookiePolicyHref("http://example.com/privacy")).toBe("http://example.com/privacy");
  expect(cookiePolicyHref("//example.com")).toBeUndefined();
  expect(cookiePolicyHref("javascript:alert(1)")).toBeUndefined();
  expect(cookiePolicyHref("policy.html")).toBeUndefined();
  expect(cookiePolicyHref("")).toBeUndefined();
  expect(cookiePolicyHref(undefined)).toBeUndefined();
});
