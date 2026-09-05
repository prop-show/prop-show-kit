<script setup lang="ts">
import { useAppConfig } from "undocs/src/app/composables/useAppConfig.ts";
import PmX from "undocs/src/app/components/global/Pm-x.vue";
import { computed } from "vue";

const props = defineProps<{ url: string }>();

const { site } = useAppConfig();
const command = computed(
  () => `shadcn-vue@latest add ${new URL(props.url.replace(/^\/+/, ""), site.url).href}`,
);
</script>

<template>
  <PmX :command="command" />
</template>
