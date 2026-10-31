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
import { useId, shallowRef } from "vue";
import { ArrowRightIcon, AtSignIcon } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    pending?: boolean;
  }>(),
  {
    title: "Subscribe to our newsletter",
    description: "Get the latest updates and insights delivered right to your inbox.",
    pending: false,
  },
);
const emit = defineEmits<{ subscribe: [email: string] }>();
const email = shallowRef("");
const emailId = useId();
const avatars = [
  "photo-1535713875002-d1d0cf377fde",
  "photo-1485206412256-701ccc5b93ca",
  "photo-1527980965255-d3b416303d12",
  "photo-1610216705422-caa3fcb6d158",
];
</script>

<template>
  <section
    class="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 border-x bg-secondary/80 px-2 py-8 md:px-4 dark:bg-secondary/40"
  >
    <span aria-hidden="true" class="pointer-events-none absolute inset-x-[-2rem] top-0 border-t" />
    <div class="space-y-1">
      <h2 class="text-center text-2xl font-semibold tracking-tight md:text-4xl">{{ title }}</h2>
      <p class="text-center text-sm text-balance text-muted-foreground md:text-base">
        {{ description }}
      </p>
    </div>
    <form
      class="flex flex-wrap items-center justify-center gap-2"
      :aria-busy="pending"
      @submit.prevent="!pending && emit('subscribe', email.trim())"
    >
      <label :for="emailId" class="sr-only">Email address</label>
      <InputGroup class="w-full max-w-[280px] bg-card">
        <InputGroupInput
          :id="emailId"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Enter your email"
          required
          :disabled="pending"
        />
        <InputGroupAddon><AtSignIcon aria-hidden="true" class="size-4" /></InputGroupAddon>
      </InputGroup>
      <Button type="submit" :disabled="pending">
        {{ pending ? "Subscribing…" : "Subscribe" }}
        <ArrowRightIcon aria-hidden="true" class="size-4" />
      </Button>
    </form>
    <slot name="status" />
    <div class="flex flex-wrap items-center justify-center gap-2">
      <p class="text-sm text-muted-foreground">
        Written by <span class="font-medium text-foreground">real humans</span> (we swear).
      </p>
      <div
        aria-hidden="true"
        class="flex -space-x-[0.45rem] *:rounded-full *:ring-2 *:ring-background"
      >
        <img
          v-for="avatar in avatars"
          :key="avatar"
          alt=""
          height="24"
          width="24"
          loading="lazy"
          :src="`https://images.unsplash.com/${avatar}?q=80&w=72`"
          class="size-6 object-cover"
        />
      </div>
    </div>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-[-2rem] bottom-0 border-t"
    />
  </section>
</template>
