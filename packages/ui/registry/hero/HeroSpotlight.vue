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
import { ArrowRight, PhoneCall, Rocket } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import HeaderSimple from "@/components/header/HeaderSimple.vue";
import LogoCloudMarquee from "@/components/logo-cloud/LogoCloudMarquee.vue";
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    announcement?: string;
    announcementHref?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  }>(),
  {
    title: "Building Teams Help\nYou Scale and Lead",
    description: "Conecting you with world-class talent\nto scale, innovate and lead",
    announcement: "shipped new features!",
    announcementHref: "/",
    primaryLabel: "Get started",
    secondaryLabel: "Book a Call",
  },
);
const emit = defineEmits<{ start: []; contact: [] }>();
</script>
<template>
  <div class="relative isolate flex w-full min-w-0 flex-col text-foreground">
    <slot name="header"><HeaderSimple /></slot>
    <div class="grow">
      <section class="relative -top-14 mx-auto w-full max-w-5xl px-4">
        <div
          aria-hidden="true"
          class="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
        >
          <div
            class="absolute inset-0 top-0 isolate -z-20 bg-[radial-gradient(35%_80%_at_49%_0%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)] contain-strict"
          ></div>
        </div>

        <div
          aria-hidden="true"
          class="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
        >
          <div
            class="absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
          ></div>
          <div
            class="absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
          ></div>
        </div>

        <div class="relative flex flex-col items-center justify-center gap-5 pt-46 pb-10">
          <div aria-hidden="true" class="absolute inset-0 top-14 -z-10 size-full overflow-hidden">
            <div
              class="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-4"
            ></div>
            <div
              class="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-4"
            ></div>
            <div
              class="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12"
            ></div>
            <div
              class="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12"
            ></div>
          </div>

          <a
            class="group mx-auto flex w-fit flex-wrap items-center gap-3 rounded-full border bg-card px-3 py-1 shadow motion-safe:transition-all duration-500 ease-out"
            :href="announcementHref"
          >
            <Rocket aria-hidden="true" class="size-3 text-muted-foreground" />
            <span class="text-xs">{{ announcement }}</span>
            <span class="block h-5 border-l"></span>
            <ArrowRight
              aria-hidden="true"
              class="size-3 motion-reduce:transition-none duration-150 ease-out group-hover:translate-x-1"
            />
          </a>

          <h1
            class="text-center max-w-xl whitespace-pre-line text-4xl tracking-tight text-balance duration-500 ease-out [text-shadow:0_0_50px_color-mix(in_oklab,var(--foreground)_20%,transparent)] md:text-5xl lg:text-6xl"
          >
            {{ title }}
          </h1>

          <p
            class="mx-auto max-w-md whitespace-pre-line text-center text-base tracking-wider text-foreground/80 duration-500 ease-out sm:text-lg md:text-xl"
          >
            {{ description }}
          </p>

          <div
            class="flex flex-row flex-wrap items-center justify-center gap-3 pt-2 duration-500 ease-out"
          >
            <slot name="actions">
              <Button
                type="button"
                class="rounded-full"
                @click="emit('contact')"
                size="lg"
                variant="secondary"
              >
                <PhoneCall aria-hidden="true" class="size-4" />
                {{ secondaryLabel }}
              </Button>
              <Button type="button" class="rounded-full" @click="emit('start')" size="lg">
                {{ primaryLabel }}
                <ArrowRight aria-hidden="true" class="size-4" />
              </Button>
            </slot>
          </div>
        </div>
      </section>
      <section class="relative space-y-4 border-t pt-6 pb-10">
        <h2 class="text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
          Trusted by <span class="text-foreground">experts</span>
        </h2>
        <div class="relative z-10 mx-auto max-w-4xl">
          <slot name="logos"><LogoCloudMarquee /></slot>
        </div>
      </section>
    </div>
  </div>
</template>
