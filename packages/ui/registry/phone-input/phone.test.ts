import { expect, test } from "vite-plus/test";

import {
  applyPhoneInput,
  caretAfterDigits,
  changePhoneCountry,
  digitsBefore,
  flagEmoji,
  listPhoneCountries,
  matchesPhoneCountry,
  phoneFromE164,
} from "./phone";

test("formats a US national number and keeps the selected country", () => {
  const value = applyPhoneInput("2015550123", "US");
  expect(value).toMatchObject({
    country: "US",
    national: "(201) 555-0123",
    e164: "+12015550123",
    valid: true,
  });
});

test("keeps a GB selection when the library would guess another +44 region", () => {
  const value = applyPhoneInput("7911123456", "GB");
  expect(value.country).toBe("GB");
  expect(value.e164).toBe("+447911123456");
  expect(value.valid).toBe(true);
});

test("switches country when the field contains an international number", () => {
  expect(applyPhoneInput("+442079460958", "US")).toMatchObject({
    country: "GB",
    e164: "+442079460958",
    valid: true,
  });
  expect(applyPhoneInput("00442079460958", "US").country).toBe("GB");
});

test("clears an empty field and marks a partial number invalid", () => {
  expect(applyPhoneInput("   ", "US")).toEqual({
    country: "US",
    national: "",
    e164: "",
    valid: false,
  });
  expect(applyPhoneInput("415", "US").valid).toBe(false);
  expect(applyPhoneInput("415", "US").national).toBe("(415)");
});

test("reinterprets the typed digits when the country changes", () => {
  const value = changePhoneCountry("(201) 555-0123", "GB");
  expect(value.country).toBe("GB");
  expect(value.e164.startsWith("+44")).toBe(true);
});

test("restores a national number from an E.164 value", () => {
  expect(phoneFromE164("+12015550123", "GB")).toMatchObject({
    country: "US",
    national: "(201) 555-0123",
    e164: "+12015550123",
    valid: true,
  });
  expect(phoneFromE164("+1415", "US")).toMatchObject({
    country: "US",
    national: "(415)",
    e164: "+1415",
    valid: false,
  });
  expect(phoneFromE164("", "FR").country).toBe("FR");
});

test("counts digits for the caret and skips formatting characters", () => {
  expect(digitsBefore("(201) 555-0123", 5)).toBe(3);
  expect(caretAfterDigits("(201) 555-0123", 0)).toBe(0);
  expect(caretAfterDigits("(201) 555-0123", 3)).toBe(4);
  expect(caretAfterDigits("(201) 555-0123", 6)).toBe(9);
  expect(caretAfterDigits("(201) 555-0123", 20)).toBe("(201) 555-0123".length);
});

test("lists countries with calling codes and matches a search query", () => {
  const countries = listPhoneCountries("en");
  const unitedStates = countries.find((country) => country.iso === "US");
  expect(unitedStates).toMatchObject({ callingCode: "1", name: "United States" });
  expect(countries.map((country) => country.name)).toEqual(
    countries.map((country) => country.name).sort((left, right) => left.localeCompare(right, "en")),
  );
  if (!unitedStates) throw new Error("expected a United States entry");
  expect(matchesPhoneCountry(unitedStates, "united")).toBe(true);
  expect(matchesPhoneCountry(unitedStates, "+1")).toBe(true);
  expect(matchesPhoneCountry(unitedStates, "us")).toBe(true);
  expect(matchesPhoneCountry(unitedStates, "zz")).toBe(false);
  expect(flagEmoji("US")).toBe("🇺🇸");
});
