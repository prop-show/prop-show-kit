<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

withDefaults(
  defineProps<{
    quote?: string;
    name?: string;
    role?: string;
    image?: string;
    company?: string;
  }>(),
  {
    quote: '"Svelte Efferd is tooo good."',
    name: "Guillermo Rauch",
    role: "CEO, Vercel",
    image: "https://github.com/rauchg.png",
    company: "Vercel",
  },
);
</script>

<template>
  <figure class="mx-auto flex w-full max-w-lg flex-col items-center justify-center">
    <div class="mb-8 flex items-center gap-1">
      <slot name="company" :company="company">
        <svg
          v-if="company === 'Vercel'"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 256 222"
          aria-hidden="true"
          class="size-6"
        >
          <path d="m128 0 128 221.705H0z" fill="currentColor" />
        </svg>
        <span class="text-lg font-medium">{{ company }}</span>
      </slot>
    </div>

    <blockquote class="text-center text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl">
      <slot name="quote" :quote="quote">
        <template v-if="quote === '&quot;Svelte Efferd is tooo good.&quot;'"
          >&quot;<span class="font-medium">Svelte Efferd</span> is tooo good.&quot;</template
        >
        <template v-else>{{ quote }}</template>
      </slot>
    </blockquote>

    <div
      aria-hidden="true"
      class="mx-auto my-5 h-px w-full max-w-sm bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]"
    />

    <figcaption class="flex flex-col items-center gap-5">
      <div class="space-y-0.5 text-center">
        <cite class="text-xl font-medium text-foreground not-italic">{{ name }}</cite>
        <div class="text-lg text-muted-foreground">{{ role }}</div>
      </div>
      <Avatar class="size-12 rounded-full border object-cover">
        <AvatarImage :alt="`${name}'s profile picture`" :src="image" />
        <AvatarFallback>{{
          name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
        }}</AvatarFallback>
      </Avatar>
    </figcaption>
  </figure>
</template>
