<script setup lang="ts">
import LogoCloudWrap from "../../../ui/registry/logo-cloud/LogoCloudWrap.vue";
</script>
<template>
  <ComponentPreview
    source="logo-cloud/LogoCloudWrap.vue"
    registry="logo-cloud-wrap"
    :height="320"
    auto-height
  >
    <div class="w-full">
      <h2 class="mb-5 text-center text-lg text-muted-foreground">
        Already used by <span class="font-medium text-primary">Best in the Game</span>
      </h2>
      <LogoCloudWrap />
    </div>
  </ComponentPreview>
</template>
