<script setup lang="ts">
import LogoCloudBlur from "../../../ui/registry/logo-cloud/LogoCloudBlur.vue";
</script>
<template>
  <ComponentPreview
    source="logo-cloud/LogoCloudBlur.vue"
    registry="logo-cloud-blur"
    :height="360"
    auto-height
  >
    <div class="w-full">
      <h2 class="mb-5 text-center">
        <span class="block text-2xl font-medium text-muted-foreground">Already used by</span>
        <span class="text-2xl font-black tracking-tight text-primary md:text-3xl"
          >Best in the Game</span
        >
      </h2>
      <div class="relative mx-auto max-w-3xl">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -top-px left-1/2 h-px w-screen -translate-x-1/2 bg-border"
        />
        <LogoCloudBlur class="border-y-0" />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border"
        />
      </div>
    </div>
  </ComponentPreview>
</template>
