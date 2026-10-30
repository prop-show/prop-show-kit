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
import { ChevronDown } from "@lucide/vue";
import {
  NavigationMenuRoot,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "reka-ui";
import HeaderLinkItem from "./HeaderLinkItem.vue";
import { productLinks, companyLinks, companyLinks2 } from "./navigation";
defineProps<{ compact?: boolean }>();
</script>
<template>
  <NavigationMenuRoot class="relative hidden md:block" aria-label="Main navigation">
    <NavigationMenuList class="flex list-none items-center gap-1">
      <NavigationMenuItem v-for="group in ['Product', 'Company']" :key="group">
        <NavigationMenuTrigger
          class="group flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring data-[state=open]:bg-accent"
          >{{ group
          }}<ChevronDown
            class="size-3 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
        /></NavigationMenuTrigger>
        <NavigationMenuContent
          class="absolute top-full left-0 z-50 mt-2 overflow-hidden rounded-lg border bg-muted p-1 text-popover-foreground shadow-lg dark:bg-background"
        >
          <div
            v-if="group === 'Product'"
            class="grid gap-2 rounded-lg border bg-popover p-2 shadow-sm"
            :class="compact ? 'w-64 grid-cols-1' : 'w-lg grid-cols-2'"
          >
            <NavigationMenuLink
              v-for="item in compact ? productLinks.slice(0, 4) : productLinks"
              :key="item.label"
              as-child
              ><HeaderLinkItem :item="item" :compact="compact"
            /></NavigationMenuLink>
          </div>
          <p v-if="group === 'Product'" class="p-2 text-sm text-muted-foreground">
            Interested?
            <NavigationMenuLink href="/" class="font-medium text-foreground hover:underline"
              >Schedule a demo</NavigationMenuLink
            >
          </p>
          <div v-else class="grid grid-cols-2 gap-2" :class="compact ? 'w-sm' : 'w-lg'">
            <div class="space-y-2 rounded-lg border bg-popover p-2 shadow-sm">
              <NavigationMenuLink v-for="item in companyLinks" :key="item.label" as-child
                ><HeaderLinkItem :item="item" :compact="compact"
              /></NavigationMenuLink>
            </div>
            <div class="space-y-2 p-2">
              <NavigationMenuLink
                v-for="item in compact ? companyLinks2.slice(0, 3) : companyLinks2"
                :key="item.label"
                as-child
                ><a
                  :href="item.href"
                  class="flex items-center gap-2 rounded-md p-1 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                  ><component :is="item.icon" class="size-4 shrink-0" aria-hidden="true" />{{
                    item.label
                  }}</a
                ></NavigationMenuLink
              >
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem
        ><NavigationMenuLink
          href="/docs"
          class="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >Docs</NavigationMenuLink
        ></NavigationMenuItem
      >
    </NavigationMenuList>
  </NavigationMenuRoot>
</template>
