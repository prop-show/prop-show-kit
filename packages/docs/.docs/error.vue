<script setup lang="ts">
import { computed, provide } from "vue";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@lucide/vue";
import { useHead, useSeoMeta } from "@unhead/vue";
import type { AppError } from "undocs/src/app/composables/createError.ts";
import { useAsyncData } from "undocs/src/app/composables/useAsyncData.ts";
import { useAppConfig } from "undocs/src/app/composables/useAppConfig.ts";
import { queryNavigation } from "undocs/src/app/composables/useContent.ts";
import { LANDING_KEY, resolveLanding } from "undocs/src/app/composables/useLanding.ts";
import { docsNavTree } from "undocs/src/app/utils/nav.ts";
import AppHeader from "undocs/src/app/components/app/AppHeader.vue";
import AppFooter from "undocs/src/app/components/app/AppFooter.vue";
import AppProvider from "undocs/src/app/components/ui/AppProvider.vue";
import ClientOnly from "undocs/src/app/components/app/ClientOnly.ts";
import DocsSearch from "undocs/src/app/components/docs/DocsSearch.vue";
import Container from "undocs/src/app/components/Container.vue";
import Main from "undocs/src/app/components/layout/Main.vue";
import { Button } from "@/components/ui/button";
import NotFoundIllustration from "./components/NotFoundIllustration.vue";

const props = defineProps<{ error: AppError }>();
const appConfig = useAppConfig();
const statusCode = computed(() => props.error?.statusCode || 404);
const isNotFound = computed(() => statusCode.value === 404);
const title = computed(() =>
  isNotFound.value ? "This piece is missing." : "Something went wrong.",
);
const description = computed(() =>
  isNotFound.value
    ? "We couldn't find this page. Pick a starting point and keep building."
    : props.error?.message ||
      props.error?.statusMessage ||
      "Please try again or return to the home page.",
);
const logo = appConfig.docs.logo || "/icon.svg";

useSeoMeta({
  title: () => (isNotFound.value ? "Page not found" : "An error occurred"),
  description: () => description.value,
  robots: "noindex, follow",
});
useHead({
  htmlAttrs: { lang: appConfig.docs.lang || "en" },
  link: [
    {
      rel: "icon",
      href: logo,
      type:
        logo.endsWith(".svg") || logo.startsWith("data:image/svg+xml")
          ? "image/svg+xml"
          : undefined,
    },
    { rel: "icon", href: "/favicon.ico", sizes: "any" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  ],
});

const { data: navigation } = await useAsyncData("navigation", () => queryNavigation());
const landing = computed(() => resolveLanding(appConfig.docs, navigation.value));
const docsNavigation = computed(() => docsNavTree(navigation.value, landing.value));
provide("navigation", docsNavigation);
provide(LANDING_KEY, landing);
</script>

<template>
  <AppProvider>
    <div class="flex min-h-dvh flex-col">
      <AppHeader />
      <Main>
        <Container>
          <section
            aria-labelledby="error-title"
            class="registry-preview mx-auto flex max-w-3xl flex-col items-center px-0 py-12 text-center text-foreground sm:py-16 lg:py-20"
          >
            <p
              class="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              <span aria-hidden="true" class="size-1.5 bg-[#F0DB4F]" />
              {{ statusCode }} · {{ isNotFound ? "Page not found" : "An error occurred" }}
            </p>

            <NotFoundIllustration v-if="isNotFound" :logo="logo" />
            <p
              v-else
              aria-hidden="true"
              class="font-mono text-8xl font-semibold text-muted-foreground"
            >
              {{ statusCode }}
            </p>

            <h1
              id="error-title"
              class="mt-8 text-3xl font-semibold tracking-tight sm:mt-10 sm:text-4xl lg:text-5xl"
            >
              {{ title }}
            </h1>
            <p class="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              {{ description }}
            </p>

            <div class="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Button
                as-child
                size="lg"
                class="bg-[#F0DB4F] text-black hover:bg-[#F7E578] focus-visible:ring-[#F0DB4F]/50"
              >
                <a href="/"><ArrowLeftIcon aria-hidden="true" class="size-4" />Back to home</a>
              </Button>
              <Button as-child size="lg" variant="outline">
                <a href="/components"
                  >Browse components<ArrowUpRightIcon aria-hidden="true" class="size-4"
                /></a>
              </Button>
            </div>

            <p class="mt-8 font-mono text-xs text-muted-foreground">
              Copy what's missing. Own every line.
            </p>
          </section>
        </Container>
      </Main>
      <AppFooter />
      <ClientOnly>
        <DocsSearch :navigation="docsNavigation" shortcut="meta_k" />
      </ClientOnly>
    </div>
  </AppProvider>
</template>
