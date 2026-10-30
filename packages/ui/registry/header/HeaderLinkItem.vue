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
import type { HeaderLink } from "./navigation";
defineProps<{ item: HeaderLink; compact?: boolean }>();
</script>
<template>
  <a
    :href="item.href"
    class="flex min-w-0 items-center gap-2 rounded-md p-2 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
  >
    <span
      v-if="item.icon"
      class="flex size-9 shrink-0 items-center justify-center rounded-md border bg-card shadow-sm"
      :class="{ 'outline outline-offset-2 outline-border/60': compact }"
      ><component :is="item.icon" class="size-4" aria-hidden="true"
    /></span>
    <span class="flex min-w-0 flex-col"
      ><span class="font-medium" :class="compact ? 'text-xs' : 'text-sm'">{{ item.label }}</span
      ><span
        v-if="item.description"
        class="text-muted-foreground"
        :class="compact ? 'line-clamp-1 text-[10px]' : 'text-xs'"
        >{{ item.description }}</span
      ></span
    >
  </a>
</template>
