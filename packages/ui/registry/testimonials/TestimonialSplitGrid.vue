<script setup lang="ts">
import { QuoteIcon } from "@lucide/vue";
withDefaults(
  defineProps<{
    testimonials?: {
      quote: string;
      name: string;
      role: string;
      company?: string;
      image?: string;
    }[];
  }>(),
  {
    testimonials: () => [
      {
        quote:
          "Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.",
        name: "Shadcn",
        role: "Founder",
        company: "Shadcn UI",
      },
      {
        quote:
          "Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.",
        name: "Guillermo Rauch",
        role: "CEO",
        company: "Vercel",
      },
      {
        quote:
          "I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
        name: "Elon Musk",
        role: "CEO",
        company: "X.com",
      },
    ],
  },
);
</script>
<template>
  <section class="relative mx-auto w-full max-w-4xl border-x">
    <span aria-hidden="true" class="pointer-events-none absolute inset-x-[-2rem] top-0 border-t" />
    <div class="grid md:grid-cols-[2fr_1fr]">
      <div class="divide-y">
        <figure
          v-for="(testimonial, index) in testimonials.slice(0, 2)"
          :key="index"
          class="p-6 md:p-8"
        >
          <QuoteIcon aria-hidden="true" class="mb-4 size-12 stroke-1 text-muted-foreground" />
          <blockquote class="mb-6 text-base font-normal text-foreground md:text-lg">
            <slot name="quote" :testimonial="testimonial">&quot;{{ testimonial.quote }}&quot;</slot>
          </blockquote>
          <figcaption class="flex flex-col gap-0.5">
            <cite class="text-lg font-medium text-foreground not-italic">{{
              testimonial.name
            }}</cite>
            <p class="text-sm text-muted-foreground">
              {{ testimonial.role
              }}<template v-if="testimonial.company">, {{ testimonial.company }}</template>
            </p>
          </figcaption>
        </figure>
      </div>
      <div class="flex flex-col justify-center divide-y border-t md:border-t-0 md:border-l">
        <figure
          v-for="(testimonial, index) in testimonials.slice(2)"
          :key="index"
          class="p-6 md:p-8"
        >
          <QuoteIcon aria-hidden="true" class="mb-4 size-12 stroke-1 text-muted-foreground" />
          <blockquote class="mb-6 text-base font-normal text-foreground md:text-lg">
            <slot name="quote" :testimonial="testimonial">&quot;{{ testimonial.quote }}&quot;</slot>
          </blockquote>
          <figcaption class="flex flex-col gap-0.5">
            <cite class="text-lg font-medium text-foreground not-italic">{{
              testimonial.name
            }}</cite>
            <p class="text-sm text-muted-foreground">
              {{ testimonial.role
              }}<template v-if="testimonial.company">, {{ testimonial.company }}</template>
            </p>
          </figcaption>
        </figure>
      </div>
    </div>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-[-2rem] bottom-0 border-t"
    />
  </section>
</template>
