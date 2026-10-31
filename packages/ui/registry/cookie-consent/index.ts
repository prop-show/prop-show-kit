export { default as CookieConsent } from "./CookieConsent.vue";
export type { CookieCategory, CookieConsentState, CookieConsentStatus } from "./consent";
export {
  acceptAll,
  cookiePolicyHref,
  defaultCookieCategories,
  isConsentDecided,
  normalizeConsent,
  parseConsent,
  rejectOptional,
  savePreferences,
  serializeConsent,
  unknownConsent,
} from "./consent";
