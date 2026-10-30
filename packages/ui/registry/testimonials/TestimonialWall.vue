<script setup lang="ts">
import { useId } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const patternId = useId();
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    testimonials?: {
      quote: string;
      name: string;
      role: string;
      company?: string;
      image?: string;
    }[];
  }>(),
  {
    title: "Real Results, Real Voices",
    description:
      "Used by thousands of developers to build beautiful, accessible, and performant web applications.",
    testimonials: () => [
      {
        quote:
          "Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.",
        image: "https://github.com/shadcn.png",
        name: "Shadcn",
        role: "Founder",
        company: "Shadcn UI",
      },
      {
        quote:
          "Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.",
        image: "https://github.com/rauchg.png",
        name: "Guillermo Rauch",
        role: "CEO",
        company: "Vercel",
      },
      {
        quote:
          "I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
        image: "https://unavatar.io/x/elonmusk",
        name: "Elon Musk",
        role: "CEO",
        company: "X.com",
      },
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
      {
        quote:
          "We processed 100 petabytes of data to find the perfect UI library. The algorithm returned 'Efferd' with 99.9% confidence.",
        image: "https://unavatar.io/x/sundarpichai",
        name: "Sundar Pichai",
        role: "CEO",
        company: "Google",
      },
      {
        quote:
          "Our links might 404 sometimes, but thanks to Efferd, at least the 404 page looks absolutely stunning.",
        image: "https://github.com/steven-tey.png",
        name: "Steven Tey",
        role: "Founder",
        company: "Dub.co",
      },
      {
        quote:
          "It's so fast, I finished my UI sprint before my next meeting even started. Open source for the win.",
        image: "https://unavatar.io/x/peer_rich",
        name: "Peer Richelsen",
        role: "Co-Founder",
        company: "Cal.com",
      },
      {
        quote:
          "21st.dev brings in 100k users daily just to see Efferd. We got into YC solely because of this UI library. And yes, we're rich now.",
        image: "https://github.com/serafimcloud.png",
        name: "Serafim",
        role: "Founder",
        company: "21st Labs.",
      },
      {
        quote:
          "I posted a video on Efferd components and it got more views than my cat video. That's statistically impossible.",
        image: "https://github.com/TheOrcDev.png",
        name: "OrcDev",
        role: "Youtuber",
      },
    ],
  },
);
</script>
<template>
  <section class="mx-auto w-full max-w-5xl space-y-8 overflow-x-clip border-x py-6">
    <div class="flex flex-col gap-2 px-4 md:px-6">
      <h2 class="text-3xl font-semibold tracking-wide text-balance md:text-4xl xl:font-bold">
        {{ title }}
      </h2>
      <p class="text-sm text-muted-foreground md:text-base lg:text-lg">{{ description }}</p>
    </div>
    <div class="relative grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-[-2rem] top-0 border-t"
      />
      <div
        v-for="(testimonial, index) in testimonials"
        :key="index"
        class="relative grid grid-cols-[auto_1fr] gap-x-3 overflow-hidden bg-background p-4"
      >
        <svg
          aria-hidden="true"
          class="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full stroke-border mask-[radial-gradient(farthest-side_at_top,white,transparent)]"
        >
          <defs>
            <pattern
              :id="`${patternId}-${index}`"
              width="25"
              height="25"
              x="-12"
              y="4"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" :fill="`url(#${patternId}-${index})`" stroke="none" />
        </svg>
        <Avatar class="size-8 rounded-full"
          ><AvatarImage
            :alt="`${testimonial.name}'s profile picture`"
            :src="testimonial.image"
          /><AvatarFallback>{{ testimonial.name.charAt(0) }}</AvatarFallback></Avatar
        >
        <figure class="relative min-w-0">
          <figcaption class="-mt-0.5 -space-y-0.5">
            <cite class="text-sm not-italic md:text-base">{{ testimonial.name }}</cite
            ><span class="block text-[11px] font-light tracking-tight text-muted-foreground"
              >{{ testimonial.role
              }}<template v-if="testimonial.company">, {{ testimonial.company }}</template></span
            >
          </figcaption>
          <blockquote class="mt-3">
            <p class="text-sm tracking-wide text-foreground/80">
              <slot name="quote" :testimonial="testimonial">{{ testimonial.quote }}</slot>
            </p>
          </blockquote>
        </figure>
      </div>
      <div
        v-if="testimonials.length % 2 !== 0"
        aria-hidden="true"
        class="hidden bg-background sm:block lg:hidden"
      />
      <template v-if="testimonials.length % 3 !== 0"
        ><div
          v-for="index in 3 - (testimonials.length % 3)"
          :key="index"
          aria-hidden="true"
          class="hidden bg-background lg:block"
      /></template>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-[-2rem] bottom-0 border-t"
      />
    </div>
  </section>
</template>
