<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { CookieConsent } from "../../../ui/registry/cookie-consent";
import type { CookieConsentState } from "../../../ui/registry/cookie-consent";
import componentCode from "../../../ui/registry/cookie-consent/CookieConsent.vue?raw";
import consentCode from "../../../ui/registry/cookie-consent/consent.ts?raw";
import indexCode from "../../../ui/registry/cookie-consent/index.ts?raw";

const consent = shallowRef<CookieConsentState>();
const summary = computed(() => {
  const state = consent.value;
  if (!state || state.status === "unknown")
    return "No choice yet. Accept all, reject optional cookies, or open preferences.";
  const enabled = Object.entries(state.categories)
    .filter(([, on]) => on)
    .map(([id]) => id);
  return `${state.status}: ${enabled.join(", ") || "none"}. Refreshing clears this preview.`;
});

const files = [
  { path: "cookie-consent/CookieConsent.vue", code: componentCode },
  { path: "cookie-consent/consent.ts", code: consentCode },
  { path: "cookie-consent/index.ts", code: indexCode },
];
</script>

<template>
  <ComponentPreview
    source="cookie-consent/CookieConsent.vue"
    registry="cookie-consent"
    :files="files"
    :height="560"
  >
    <div class="flex w-full flex-col gap-4 self-stretch px-2 pb-36 text-left">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sample page
        </p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight">A page behind the banner.</h2>
        <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          This preview keeps the choice in memory. The block does not write a browser cookie.
        </p>
      </div>
      <p role="status" class="text-sm text-foreground">{{ summary }}</p>
      <p id="cookie-policy" class="max-w-xl text-sm leading-relaxed text-muted-foreground">
        The policy link in the banner points at this sample note. Replace it with your own privacy
        URL after install.
      </p>
      <CookieConsent v-model="consent" policy-href="#cookie-policy" />
    </div>
  </ComponentPreview>
</template>
