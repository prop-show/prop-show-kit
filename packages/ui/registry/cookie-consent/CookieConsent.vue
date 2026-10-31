<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { CookieIcon, XIcon } from "@lucide/vue";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "reka-ui";
import { computed, nextTick, shallowRef, useId } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CookieCategory, CookieConsentState } from "./consent";
import {
  acceptAll,
  cookiePolicyHref,
  defaultCookieCategories,
  isConsentDecided,
  normalizeConsent,
  rejectOptional,
  savePreferences,
  uniqueCategories,
} from "./consent";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    categories?: readonly CookieCategory[];
    title?: string;
    description?: string;
    policyHref?: string;
    policyLabel?: string;
    acceptAllLabel?: string;
    rejectLabel?: string;
    preferencesLabel?: string;
    saveLabel?: string;
    settingsLabel?: string;
    necessaryLabel?: string;
    preferencesTitle?: string;
    preferencesDescription?: string;
    closeLabel?: string;
    acceptedMessage?: string;
    rejectedMessage?: string;
    savedMessage?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    categories: () => defaultCookieCategories.map((category) => ({ ...category })),
    title: "We use cookies",
    description:
      "Necessary cookies keep this site working. Analytics and marketing stay off until you allow them.",
    policyHref: "",
    policyLabel: "Cookie policy",
    acceptAllLabel: "Accept all",
    rejectLabel: "Reject optional",
    preferencesLabel: "Preferences",
    saveLabel: "Save preferences",
    settingsLabel: "Cookie settings",
    necessaryLabel: "Always on",
    preferencesTitle: "Cookie preferences",
    preferencesDescription:
      "Choose which categories this browser may store. Necessary cookies stay on.",
    closeLabel: "Close preferences",
    acceptedMessage: "All cookie categories accepted.",
    rejectedMessage: "Optional cookies rejected. Necessary cookies stay on.",
    savedMessage: "Cookie preferences saved.",
  },
);

const baseId = useId();
const model = defineModel<CookieConsentState>();
const local = shallowRef<CookieConsentState>();
const preferencesOpen = shallowRef(false);
const draft = shallowRef<Record<string, boolean>>({});
const announcement = shallowRef("");

const emit = defineEmits<{
  accept: [state: CookieConsentState];
  reject: [state: CookieConsentState];
  save: [state: CookieConsentState];
}>();

const listed = computed(() => uniqueCategories(props.categories));
const state = computed(() => normalizeConsent(listed.value, model.value ?? local.value));
const decided = computed(() => isConsentDecided(state.value));
const policyLink = computed(() => cookiePolicyHref(props.policyHref));
const showBanner = computed(() => !decided.value && !preferencesOpen.value);
const showSettings = computed(() => decided.value && !preferencesOpen.value);

function fieldId(id: string, part: "title" | "description") {
  return `${baseId}-${part}-${id.replace(/[^A-Za-z0-9_-]/g, "")}`;
}

function categoryOn(category: CookieCategory) {
  return category.required ? true : Boolean(draft.value[category.id]);
}

function openPreferences() {
  draft.value = { ...state.value.categories };
  announcement.value = "";
  preferencesOpen.value = true;
}

function toggleCategory(category: CookieCategory) {
  if (category.required) return;
  draft.value = { ...draft.value, [category.id]: !draft.value[category.id] };
}

async function announce(message: string) {
  announcement.value = "";
  await nextTick();
  announcement.value = message;
}

function commit(next: CookieConsentState, kind: "accept" | "reject" | "save") {
  const normalized = normalizeConsent(listed.value, next);
  local.value = normalized;
  model.value = normalized;
  preferencesOpen.value = false;
  void announce(
    kind === "accept"
      ? props.acceptedMessage
      : kind === "reject"
        ? props.rejectedMessage
        : props.savedMessage,
  );
  if (kind === "accept") emit("accept", normalized);
  else if (kind === "reject") emit("reject", normalized);
  else emit("save", normalized);
}

function onAccept() {
  commit(acceptAll(listed.value), "accept");
}

function onReject() {
  commit(rejectOptional(listed.value), "reject");
}

function onSave() {
  commit(savePreferences(listed.value, draft.value), "save");
}
</script>

<template>
  <p class="sr-only" role="status">{{ announcement }}</p>

  <section
    v-if="showBanner"
    v-bind="$attrs"
    data-slot="cookie-consent"
    role="region"
    aria-label="Cookie consent"
    :class="
      cn(
        'fixed inset-x-0 bottom-0 z-40 border-t bg-background px-4 py-4 text-foreground shadow-lg',
        props.class,
      )
    "
  >
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-end">
      <div class="min-w-0 flex-1">
        <p class="flex items-center gap-2 text-sm font-semibold">
          <CookieIcon aria-hidden="true" class="size-4 shrink-0" />
          {{ title }}
        </p>
        <p class="mt-1 text-sm leading-relaxed text-muted-foreground">
          {{ description }}
          <a
            v-if="policyLink"
            :href="policyLink"
            class="font-medium text-foreground underline underline-offset-4"
            >{{ policyLabel }}</a
          >
        </p>
      </div>
      <div class="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
        <Button type="button" variant="outline" class="w-full sm:w-auto" @click="onReject">
          {{ rejectLabel }}
        </Button>
        <Button type="button" variant="outline" class="w-full sm:w-auto" @click="openPreferences">
          {{ preferencesLabel }}
        </Button>
        <Button type="button" class="w-full sm:w-auto" @click="onAccept">
          {{ acceptAllLabel }}
        </Button>
      </div>
    </div>
  </section>

  <div v-else-if="showSettings" class="fixed bottom-4 left-4 z-40">
    <Button type="button" variant="outline" size="sm" @click="openPreferences">
      <CookieIcon aria-hidden="true" />
      {{ settingsLabel }}
    </Button>
  </div>

  <DialogRoot v-model:open="preferencesOpen">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/40" />
      <DialogContent
        data-slot="cookie-consent-preferences"
        :class="
          cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[min(32rem,calc(100dvh-1rem))] w-full flex-col overflow-hidden rounded-t-2xl border bg-background text-foreground shadow-xl outline-none',
            'sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:rounded-2xl',
          )
        "
      >
        <header class="flex items-start gap-3 border-b px-5 py-4">
          <div class="min-w-0 flex-1">
            <DialogTitle class="text-base font-semibold leading-6">
              {{ preferencesTitle }}
            </DialogTitle>
            <DialogDescription class="mt-1 text-sm leading-6 text-muted-foreground">
              {{ preferencesDescription }}
            </DialogDescription>
          </div>
          <DialogClose as-child>
            <Button type="button" variant="ghost" size="icon-sm" :aria-label="closeLabel">
              <XIcon aria-hidden="true" class="size-4" />
            </Button>
          </DialogClose>
        </header>

        <ul class="min-h-0 flex-1 divide-y overflow-y-auto px-5">
          <li v-for="category in listed" :key="category.id" class="flex items-start gap-3 py-4">
            <div class="min-w-0 flex-1">
              <p :id="fieldId(category.id, 'title')" class="text-sm font-medium">
                {{ category.title }}
                <span
                  v-if="category.required"
                  class="ml-2 text-xs font-normal text-muted-foreground"
                >
                  {{ necessaryLabel }}
                </span>
              </p>
              <p
                :id="fieldId(category.id, 'description')"
                class="mt-1 text-xs leading-relaxed text-muted-foreground"
              >
                {{ category.description }}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="categoryOn(category)"
              :aria-disabled="category.required || undefined"
              :aria-labelledby="fieldId(category.id, 'title')"
              :aria-describedby="fieldId(category.id, 'description')"
              :class="
                cn(
                  'relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50',
                  categoryOn(category) ? 'bg-primary' : 'bg-input',
                  category.required && 'cursor-not-allowed opacity-70',
                )
              "
              @click="toggleCategory(category)"
            >
              <span
                :class="
                  cn(
                    'pointer-events-none absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow-sm transition-transform',
                    categoryOn(category) ? 'translate-x-4' : 'translate-x-0',
                  )
                "
              />
            </button>
          </li>
        </ul>

        <footer class="flex flex-col gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" @click="onReject">{{ rejectLabel }}</Button>
          <Button type="button" variant="outline" @click="onAccept">{{ acceptAllLabel }}</Button>
          <Button type="button" @click="onSave">{{ saveLabel }}</Button>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
