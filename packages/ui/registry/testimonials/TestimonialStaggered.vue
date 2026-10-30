<script setup lang="ts">
import { PlusIcon, QuoteIcon } from "@lucide/vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          "We just acquired Efferd for 3 gazillion dollars. We're calling it iEfferd. It's our best product yet.",
        image: "https://unavatar.io/x/tim_cook",
        name: "Tim Cook",
        role: "CEO",
        company: "Apple",
      },
      {
        quote:
          "I'm considering shipping Efferd components with Prime delivery. 2-day shipping on beautiful UIs? Done.",
        image: "https://unavatar.io/x/JeffBezos",
        name: "Jeff Bezos",
        role: "Founder",
        company: "Amazon",
      },
      {
        quote:
          "We're rewriting OpenAI's entire frontend in Efferd. The AGI told us it's the only logical choice.",
        image: "https://unavatar.io/x/sama",
        name: "Sam Altman",
        role: "CEO",
        company: "OpenAI",
      },
    ],
  },
);
</script>

<template>
  <div class="mx-auto -mt-10 grid w-full max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
    <figure
      v-for="(testimonial, index) in testimonials"
      :key="index"
      class="relative flex flex-col justify-between gap-6 px-8 pt-8 pb-6 shadow-xs md:translate-y-[calc(3rem*var(--t-card-index))] dark:bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]"
      :style="{ '--t-card-index': index }"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -inset-y-4 -left-px w-px bg-border"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -inset-y-4 -right-px w-px bg-border"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -inset-x-4 -top-px h-px bg-border"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -right-4 -bottom-px -left-4 h-px bg-border"
      />
      <PlusIcon
        aria-hidden="true"
        class="pointer-events-none absolute z-10 -top-1.75 -left-1.75 size-3.5"
      />

      <blockquote class="flex gap-4">
        <QuoteIcon aria-hidden="true" class="size-6 shrink-0 stroke-1" />
        <p class="flex-1 text-base leading-relaxed font-normal text-muted-foreground">
          <slot name="quote" :testimonial="testimonial" :index="index">{{
            testimonial.quote
          }}</slot>
        </p>
      </blockquote>

      <figcaption class="flex items-center gap-3">
        <Avatar
          class="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background transition-shadow group-hover:ring-foreground/20"
        >
          <AvatarImage :alt="`${testimonial.name}'s profile picture`" :src="testimonial.image" />
          <AvatarFallback>{{ testimonial.name.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col">
          <cite class="text-sm font-medium text-foreground not-italic">{{ testimonial.name }}</cite>
          <p class="text-xs text-muted-foreground">
            {{ testimonial.role }}<template v-if="testimonial.company">, </template>
            <slot name="company" :testimonial="testimonial" :index="index">
              <span v-if="testimonial.company" class="text-foreground/80">{{
                testimonial.company
              }}</span>
            </slot>
          </p>
        </div>
      </figcaption>
    </figure>
  </div>
</template>
