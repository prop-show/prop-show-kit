import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export type { CountryCode };

export interface PhoneValue {
  country: CountryCode;
  /** National number, formatted for the selected country. */
  national: string;
  /** E.164 when the library can form one, including an incomplete number. */
  e164: string;
  valid: boolean;
}

export interface PhoneCountry {
  iso: CountryCode;
  callingCode: string;
  name: string;
}

const countryCache = new Map<string, PhoneCountry[]>();

export function listPhoneCountries(locale?: string): PhoneCountry[] {
  const key = locale ?? "";
  const cached = countryCache.get(key);
  if (cached) return cached;

  const names = new Intl.DisplayNames(locale ? [locale] : undefined, { type: "region" });
  const countries = getCountries()
    .map((iso) => ({
      iso,
      callingCode: getCountryCallingCode(iso),
      name: names.of(iso) ?? iso,
    }))
    .sort((left, right) => left.name.localeCompare(right.name, locale));
  countryCache.set(key, countries);
  return countries;
}

export function flagEmoji(iso: string) {
  // ISO codes are ASCII. Iterate by code unit so the string is not spread.
  const upper = iso.toUpperCase();
  let flag = "";
  for (let index = 0; index < upper.length; index += 1) {
    flag += String.fromCodePoint(127397 + upper.charCodeAt(index));
  }
  return flag;
}

export function matchesPhoneCountry(country: PhoneCountry, query: string) {
  const normalized = query.trim().toLowerCase().replace(/^\+/, "");
  if (!normalized) return true;
  return (
    country.name.toLowerCase().includes(normalized) ||
    country.iso.toLowerCase().includes(normalized) ||
    country.callingCode.startsWith(normalized)
  );
}

export function digitsBefore(value: string, index: number) {
  return value.slice(0, Math.max(0, index)).replace(/\D/g, "").length;
}

export function caretAfterDigits(formatted: string, digitCount: number) {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index] ?? "")) {
      seen += 1;
      if (seen === digitCount) return index + 1;
    }
  }
  return formatted.length;
}

function emptyValue(country: CountryCode): PhoneValue {
  return { country, national: "", e164: "", valid: false };
}

function nationalDraft(raw: string, country: CountryCode): PhoneValue {
  const formatter = new AsYouType(country);
  const national = formatter.input(raw);
  const number = formatter.getNumber();
  return {
    // Keep the country the user picked. Shared calling codes would otherwise
    // move the selector (US/CA, GB/GG) while a national number is being typed.
    country,
    national,
    e164: number?.number ?? "",
    valid: number?.isValid() ?? false,
  };
}

export function applyPhoneInput(raw: string, country: CountryCode): PhoneValue {
  const trimmed = raw.trim();
  if (!trimmed) return emptyValue(country);

  const international = trimmed.startsWith("+")
    ? trimmed
    : trimmed.startsWith("00")
      ? `+${trimmed.slice(2)}`
      : "";

  if (international) {
    const parsed = parsePhoneNumberFromString(international);
    if (parsed?.country) {
      return {
        country: parsed.country,
        national: parsed.formatNational(),
        e164: parsed.number,
        valid: parsed.isValid(),
      };
    }
    if (parsed) {
      return {
        country,
        national: new AsYouType(country).input(parsed.nationalNumber),
        e164: parsed.number,
        valid: parsed.isValid(),
      };
    }
    const formatter = new AsYouType();
    formatter.input(international);
    const number = formatter.getNumber();
    if (number?.country) {
      return {
        country: number.country,
        national: number.formatNational(),
        e164: number.number,
        valid: number.isValid(),
      };
    }
  }

  return nationalDraft(raw, country);
}

export function changePhoneCountry(national: string, country: CountryCode): PhoneValue {
  return applyPhoneInput(national.replace(/\D/g, ""), country);
}

export function phoneFromE164(e164: string, fallback: CountryCode): PhoneValue {
  const trimmed = e164.trim();
  if (!trimmed) return emptyValue(fallback);
  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed) return emptyValue(fallback);
  if (!parsed.country) {
    return {
      country: fallback,
      national: new AsYouType(fallback).input(parsed.nationalNumber),
      e164: parsed.number,
      valid: parsed.isValid(),
    };
  }
  return {
    country: parsed.country,
    national: parsed.formatNational(),
    e164: parsed.number,
    valid: parsed.isValid(),
  };
}
