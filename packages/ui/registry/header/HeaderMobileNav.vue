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
import { onMounted, ref, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { Menu, X } from "@lucide/vue";
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "reka-ui";
import { Button } from "@/components/ui/button";
import HeaderLinkItem from "./HeaderLinkItem.vue";
import { navLinks, productLinks, companyLinks, companyLinks2 } from "./navigation";
const open = ref(false);
const menuTrigger = useTemplateRef<InstanceType<typeof Button>>("menuTrigger");
onMounted(() => {
  const view = menuTrigger.value?.$el.ownerDocument.defaultView as Window | undefined;
  if (!view) return;
  const desktop = view.matchMedia("(min-width: 768px)");
  useEventListener(desktop, "change", () => {
    if (desktop.matches) open.value = false;
  });
});
withDefaults(
  defineProps<{
    mega?: boolean;
    compact?: boolean;
    home?: boolean;
    signInLabel?: string;
    signUpLabel?: string;
    signInHref?: string;
    signUpHref?: string;
  }>(),
  {
    signInLabel: "Sign In",
    signUpLabel: "Get Started",
    signInHref: "/login",
    signUpHref: "/signup",
  },
);
</script>
<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child
      ><Button
        ref="menuTrigger"
        size="icon"
        variant="outline"
        class="md:hidden"
        aria-label="Open navigation menu"
        ><Menu class="size-4" /></Button
    ></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/40 md:hidden" />
      <DialogContent
        @keydown.esc.stop.prevent="open = false"
        class="fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto border-b bg-background p-4 text-foreground shadow-lg md:hidden"
        @click="
          (event) => {
            if ((event.target as HTMLElement).closest('a')) open = false;
          }
        "
      >
        <div class="mb-5 flex items-center justify-between">
          <DialogTitle class="text-sm font-medium">Navigation</DialogTitle
          ><DialogClose as-child
            ><Button size="icon" variant="ghost" aria-label="Close navigation menu"
              ><X class="size-4" /></Button
          ></DialogClose>
        </div>
        <DialogDescription class="sr-only"
          >Browse the site and access your account.</DialogDescription
        >
        <nav aria-label="Mobile navigation" class="grid gap-2">
          <template v-if="mega">
            <p class="text-sm font-medium">Product</p>
            <HeaderLinkItem
              v-for="item in compact ? productLinks.slice(0, 4) : productLinks"
              :key="item.label"
              :item="item"
              :compact="compact"
            />
            <p class="mt-4 text-sm font-medium">Company</p>
            <HeaderLinkItem
              v-for="item in [
                ...companyLinks,
                ...(compact ? companyLinks2.slice(0, 3) : companyLinks2),
              ]"
              :key="item.label"
              :item="item"
              :compact="compact"
            />
            <Button as-child variant="ghost" class="justify-start"><a href="/docs">Docs</a></Button>
          </template>
          <template v-else
            ><Button v-if="home" as-child variant="ghost" class="justify-start"
              ><a href="/">Home</a></Button
            ><Button
              v-for="item in navLinks"
              :key="item.label"
              as-child
              variant="ghost"
              class="justify-start"
              ><a :href="item.href">{{ item.label }}</a></Button
            ></template
          >
        </nav>
        <div class="mt-8 grid gap-2">
          <Button as-child variant="outline"
            ><a :href="signInHref">{{ signInLabel }}</a></Button
          ><Button as-child
            ><a :href="signUpHref">{{ signUpLabel }}</a></Button
          >
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
