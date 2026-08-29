<script setup lang="ts">
import ContentSearch from "@nuxt/ui/components/content/ContentSearch.vue";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <ContentSearch v-bind="$attrs" title="Search" description="Search the suit-help documentation." />
</template>
