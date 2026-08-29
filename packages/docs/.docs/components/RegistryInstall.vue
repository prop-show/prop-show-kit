<script setup lang="ts">
import { useAppConfig } from "#imports";
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
