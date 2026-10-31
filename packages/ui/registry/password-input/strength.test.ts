import { expect, test } from "vite-plus/test";

import { assessPassword } from "./strength";

test("scores an empty password as unset and leaves every rule unmet", () => {
  const result = assessPassword("");
  expect(result.score).toBe(0);
  expect(result.label).toBe("");
  expect(result.checks.every((check) => !check.met)).toBe(true);
});

test("keeps a short mixed password weak until it reaches the minimum length", () => {
  const result = assessPassword("Aa1!");
  expect(result.score).toBe(1);
  expect(result.label).toBe("Weak");
  expect(result.checks.find((check) => check.id === "length")?.met).toBe(false);
});

test("raises the score as more character classes are added", () => {
  expect(assessPassword("abcdefgh").score).toBe(2);
  expect(assessPassword("Abcdefg1").score).toBe(3);
  expect(assessPassword("Abcdefg1!").score).toBe(4);
  expect(assessPassword("Abcdefg1!").label).toBe("Strong");
});

test("treats a long passphrase without a symbol as strong", () => {
  expect(assessPassword("CorrectHorse1").score).toBe(4);
});

test("caps obvious passwords at weak even when they meet the length rule", () => {
  expect(assessPassword("password").score).toBe(1);
  expect(assessPassword("Password123").score).toBe(1);
});

test("honors a custom minimum length and replacement labels", () => {
  const result = assessPassword("abcdef", {
    minLength: 6,
    labels: { length: "Six or more" },
    strengthLabels: { fair: "Okay" },
  });
  expect(result.score).toBe(2);
  expect(result.label).toBe("Okay");
  expect(result.checks.find((check) => check.id === "length")).toEqual({
    id: "length",
    label: "Six or more",
    met: true,
  });
});
