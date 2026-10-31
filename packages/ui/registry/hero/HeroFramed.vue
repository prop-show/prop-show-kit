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
import { ArrowRight, PhoneCall, Plus } from "@lucide/vue";
import HeaderFramed from "@/components/header/HeaderFramed.vue";
import LogoCloudDecorated from "@/components/logo-cloud/LogoCloudDecorated.vue";
import { Button } from "@/components/ui/button";

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    announcement?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    announcementHref?: string;
    imageLight?: string;
    imageDark?: string;
    imageAlt?: string;
  }>(),
  {
    title: "Building Digital Experiences That Drive Growth",
    description:
      "We help brands scale faster through design,\ndevelopment and strategic execution.",
    announcement: "accepting new client projects",
    primaryLabel: "Get started",
    secondaryLabel: "Book a Call",
    announcementHref: "/",
    imageLight: "https://storage.efferd.com/screen/dashboard-light.webp",
    imageDark: "https://storage.efferd.com/screen/dashboard-dark.webp",
    imageAlt: "app screen",
  },
);

const emit = defineEmits<{ start: []; contact: [] }>();
</script>

<template>
  <div
    class="relative isolate flex w-full min-w-0 min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip"
  >
    <slot name="header"><HeaderFramed /></slot>
    <div
      class="relative mx-auto w-full max-w-4xl grow before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border"
    >
      <section>
        <div
          class="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28"
        >
          <div aria-hidden="true" class="absolute inset-0 -z-10 size-full overflow-hidden">
            <span
              class="absolute -inset-x-20 inset-y-0 z-0 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent,transparent)] blur-[50px]"
            ></span>
            <span
              class="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8"
            ></span>
            <span
              class="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8"
            ></span>
            <span
              class="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12"
            ></span>
            <span
              class="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12"
            ></span>
          </div>

          <a
            :href="announcementHref"
            class="group mx-auto flex w-fit animate-in items-center gap-3 rounded-sm border bg-card p-1 shadow transition-all delay-500 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in focus-visible:outline-2 focus-visible:outline-ring motion-reduce:animate-none motion-reduce:transition-none"
          >
            <span class="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
              <span class="font-mono text-xs">NOW</span>
            </span>
            <span class="text-xs">{{ announcement }}</span>
            <span aria-hidden="true" class="block h-5 border-l"></span>
            <span class="pr-1">
              <ArrowRight
                aria-hidden="true"
                class="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
              />
            </span>
          </a>

          <h1
            class="max-w-2xl animate-in text-center text-3xl text-balance text-foreground delay-100 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in md:text-5xl lg:text-6xl motion-reduce:animate-none"
          >
            {{ title }}
          </h1>
          <p
            class="animate-in text-center text-sm tracking-wider whitespace-pre-line text-muted-foreground delay-200 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in sm:text-lg motion-reduce:animate-none"
          >
            {{ description }}
          </p>
          <div
            class="flex w-fit animate-in flex-wrap items-center justify-center gap-3 pt-2 delay-300 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in motion-reduce:animate-none"
          >
            <slot name="actions">
              <Button type="button" variant="outline" @click="emit('contact')">
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

        <div class="relative">
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -top-2 -left-2 z-10 size-4"
          />
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -top-2 -right-2 z-10 size-4"
          />
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-2 -left-2 z-10 size-4"
          />
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -right-2 -bottom-2 z-10 size-4"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute -top-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
          ></span>
          <slot name="media">
            <div class="overflow-hidden *:pointer-events-none *:aspect-video *:select-none">
              <img
                width="1920"
                height="1080"
                :src="imageLight"
                :alt="imageAlt"
                class="hero-screen-light w-full"
              />
              <img
                width="1920"
                height="1080"
                :src="imageDark"
                :alt="imageAlt"
                class="hero-screen-dark w-full"
              />
            </div>
          </slot>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
          ></span>
        </div>
      </section>

      <section class="mb-12">
        <h2
          class="py-6 text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl"
        >
          Trusted by <span class="text-foreground">experts</span>
        </h2>
        <div class="relative *:border-0">
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -top-2 -left-2 z-10 size-4"
          />
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -top-2 -right-2 z-10 size-4"
          />
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-2 -left-2 z-10 size-4"
          />
          <Plus
            aria-hidden="true"
            class="pointer-events-none absolute -right-2 -bottom-2 z-10 size-4"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute -top-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
          ></span>
          <slot name="logos"><LogoCloudDecorated /></slot>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
          ></span>
        </div>
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
