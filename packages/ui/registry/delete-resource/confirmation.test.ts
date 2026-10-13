import { expect, test } from "vite-plus/test";
import { matchesResourceName } from "./confirmation";

test("requires the exact, nonempty resource name by default", () => {
  expect(matchesResourceName("", "")).toBe(false);
  expect(matchesResourceName("", "example.com")).toBe(false);
  expect(matchesResourceName("example", "example.com")).toBe(false);
  expect(matchesResourceName(" example.com ", "example.com")).toBe(false);
  expect(matchesResourceName("Example.com", "example.com")).toBe(false);
  expect(matchesResourceName("example.com", "example.com")).toBe(true);
});

test("ignores case only when explicitly requested, preserving spaces", () => {
  expect(matchesResourceName("EXAMPLE.com", "example.com", false)).toBe(true);
  expect(matchesResourceName(" example.com", "example.com", false)).toBe(false);
  expect(matchesResourceName("", "", false)).toBe(false);
});
