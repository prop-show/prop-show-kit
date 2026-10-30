<script setup lang="ts">
import HeaderSimple from "../../../ui/registry/header/HeaderSimple.vue";
</script>
<template>
  <ComponentPreview source="header/HeaderSimple.vue" registry="header-simple" :height="440">
    <div class="w-full self-start">
      <HeaderSimple />
      <div
        class="mx-auto flex min-h-180 max-w-5xl flex-col items-center gap-4 px-4 pt-20 text-center"
      >
        <h2 class="text-2xl font-semibold tracking-tight">Your next idea starts here.</h2>
        <p class="max-w-sm text-sm text-muted-foreground">
          Explore the navigation or scroll this preview to see the header adapt.
        </p>
      </div>
    </div>
  </ComponentPreview>
</template>
