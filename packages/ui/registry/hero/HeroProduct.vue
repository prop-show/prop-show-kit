<!--
MIT License

Copyright (c) 2026 SikandarJODD

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<script setup lang="ts">
import { ArrowRight, PhoneCall } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import HeaderMega from "@/components/header/HeaderMega.vue";
import LogoCloudWrap from "@/components/logo-cloud/LogoCloudWrap.vue";
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    announcement?: string;
    announcementHref?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    imageLight?: string;
    imageDark?: string;
    imageAlt?: string;
  }>(),
  {
    title: "Building Digital Experiences That Drive Growth",
    description: "We help brands scale faster through design, development and strategic execution.",
    announcement: "accepting new client projects",
    announcementHref: "/",
    primaryLabel: "Get started",
    secondaryLabel: "Book a Call",
    imageLight: "https://storage.efferd.com/screen/dashboard-light.webp",
    imageDark: "https://storage.efferd.com/screen/dashboard-dark.webp",
    imageAlt: "Product dashboard",
  },
);
const emit = defineEmits<{ start: []; contact: [] }>();
</script>
<template>
  <div class="relative isolate flex w-full min-w-0 flex-col text-foreground">
    <slot name="header"><HeaderMega /></slot>
    <div class="grow">
      <section class="relative mx-auto w-full max-w-5xl overflow-hidden pt-16">
        <div aria-hidden="true" class="absolute inset-0 size-full overflow-hidden">
          <div
            class="absolute inset-0 isolate -z-10 bg-[radial-gradient(20%_80%_at_20%_0%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent)]"
          ></div>
        </div>

        <div class="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
          <a
            class="group flex w-fit flex-wrap items-center gap-3 rounded-sm border bg-card p-1 shadow-xs motion-safe:transition-all duration-500 ease-out"
            :href="announcementHref"
          >
            <div class="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
              <p class="font-mono text-xs">NOW</p>
            </div>

            <span class="text-xs">{{ announcement }}</span>
            <span class="block h-5 border-l"></span>

            <div class="pr-1">
              <ArrowRight
                aria-hidden="true"
                class="size-3 -translate-x-0.5 motion-reduce:transition-none duration-150 ease-out group-hover:translate-x-0.5"
              />
            </div>
          </a>

          <h1
            class="text-4xl leading-tight font-medium text-balance text-foreground duration-500 ease-out md:text-5xl"
          >
            {{ title }}
          </h1>

          <p
            class="text-sm tracking-wider text-muted-foreground duration-500 ease-out sm:text-lg md:text-xl"
          >
            {{ description }}
          </p>

          <div
            class="flex w-fit flex-wrap items-center justify-center gap-3 pt-2 duration-500 ease-out"
          >
            <slot name="actions">
              <Button type="button" @click="emit('contact')" variant="outline">
                <PhoneCall aria-hidden="true" class="size-4" />
                {{ secondaryLabel }}
              </Button>
              <Button type="button" @click="emit('start')">
                {{ primaryLabel }}
                <ArrowRight aria-hidden="true" class="size-4" />
              </Button>
            </slot>
          </div>
        </div>

        <slot name="media">
          <div class="relative">
            <div
              class="absolute -inset-x-20 inset-y-0 -translate-y-1/3 scale-120 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent,transparent)] blur-[50px]"
            ></div>
            <div
              class="relative mt-8 -mr-56 overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_60%,transparent_100%)] px-2 duration-1000 ease-out sm:mt-12 sm:mr-0 md:mt-20"
            >
              <div
                class="relative mx-auto max-w-5xl overflow-hidden rounded-lg border bg-background p-2 shadow-xl ring-1 inset-shadow-2xs ring-card inset-shadow-foreground/10 dark:inset-shadow-xs dark:inset-shadow-foreground/20"
              >
                <img
                  :alt="imageAlt"
                  class="hero-screen-light z-2 aspect-video rounded-lg border"
                  height="1080"
                  :src="imageLight"
                  width="1920"
                />
                <img
                  :alt="imageAlt"
                  class="hero-screen-dark aspect-video rounded-lg bg-background"
                  height="1080"
                  :src="imageDark"
                  width="1920"
                />
              </div>
            </div>
          </div>
        </slot>
      </section>
      <section class="mx-auto h-full max-w-3xl space-y-4 px-4 py-10 md:px-8">
        <h2 class="text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
          Trusted by <span class="text-foreground">experts</span>
        </h2>
        <slot name="logos"><LogoCloudWrap /></slot>
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero-screen-dark {
  display: none;
}
:global(.dark .hero-screen-light) {
  display: none;
}
:global(.dark .hero-screen-dark) {
  display: block;
}
</style>
