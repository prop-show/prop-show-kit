<script setup lang="ts">
import { useId } from "vue";

defineProps<{ logo: string }>();
const gridId = useId();
</script>

<template>
  <svg
    data-slot="not-found-illustration"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 720 280"
    fill="none"
    class="block w-full"
  >
    <defs>
      <pattern :id="gridId" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M28 0H0V28" stroke="#F0DB4F" stroke-opacity="0.08" />
      </pattern>
    </defs>

    <rect x="0.5" y="0.5" width="719" height="279" rx="16" fill="#0A0A0A" stroke="#292929" />
    <rect x="1" y="1" width="718" height="278" rx="16" :fill="`url(#${gridId})`" />

    <g fill="#F0DB4F" shape-rendering="crispEdges">
      <path d="M88 54h22v66h44V54h22v66h22v22h-22v66h-22v-66H88V54Z" />
      <path d="M522 54h22v66h44V54h22v66h22v22h-22v66h-22v-66h-66V54Z" />
    </g>

    <rect
      x="252"
      y="32"
      width="216"
      height="216"
      rx="2"
      fill="black"
      stroke="#F0DB4F"
      stroke-opacity="0.24"
    />
    <image :href="logo" x="260" y="40" width="200" height="200" />
    <path
      d="M252 48V32h16m184 0h16v16M252 232v16h16m184 0h16v-16"
      stroke="#F0DB4F"
      stroke-width="2"
    />

    <path d="M476 38h18V20" stroke="#F0DB4F" stroke-opacity="0.4" stroke-dasharray="3 4" />
    <rect x="487" y="6" width="14" height="14" fill="#F0DB4F" />
    <rect x="55" y="220" width="7" height="7" fill="#F0DB4F" fill-opacity="0.35" />
    <rect x="643" y="43" width="7" height="7" fill="#F0DB4F" fill-opacity="0.35" />
    <path d="M34 36h12m-6-6v12m634 196h12m-6-6v12" stroke="#F0DB4F" stroke-opacity="0.3" />
  </svg>
</template>
