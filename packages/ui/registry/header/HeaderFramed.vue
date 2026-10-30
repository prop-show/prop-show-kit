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
import { Button } from "@/components/ui/button";
import HeaderLogo from "./HeaderLogo.vue";
import HeaderMobileNav from "./HeaderMobileNav.vue";
import { useHeaderScroll } from "./useHeaderScroll";
import { navLinks } from "./navigation";
withDefaults(
  defineProps<{
    homeHref?: string;
    homeLabel?: string;
    signInHref?: string;
    signUpHref?: string;
  }>(),
  { homeHref: "/", homeLabel: "Home", signInHref: "/login", signUpHref: "/signup" },
);
const { scrolled } = useHeaderScroll(10);
</script>
<template>
  <header
    ref="header"
    class="sticky top-0 z-50 mx-auto w-full max-w-4xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out text-foreground motion-reduce:transition-none"
    :class="
      scrolled
        ? 'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow'
        : ''
    "
  >
    <nav
      aria-label="Site navigation"
      class="flex h-14 w-full items-center justify-between gap-2 px-4 md:h-12"
    >
      <a
        :href="homeHref"
        :aria-label="homeLabel"
        class="shrink-0 rounded-md p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        ><slot name="logo"><HeaderLogo /></slot
      ></a>
      <div class="hidden items-center gap-1 md:flex">
        <Button v-for="item in navLinks" :key="item.label" as-child size="sm" variant="ghost"
          ><a :href="item.href">{{ item.label }}</a></Button
        >
      </div>
      <div class="hidden md:flex shrink-0 items-center gap-2">
        <Button as-child size="sm" variant="outline"><a :href="signInHref">Sign In</a></Button
        ><Button as-child size="sm"><a :href="signUpHref">Get Started</a></Button>
      </div>
      <HeaderMobileNav :sign-in-href="signInHref" :sign-up-href="signUpHref" />
    </nav>
  </header>
</template>
