<script setup lang="ts">
import { onMounted, shallowRef } from "vue";

const mounted = shallowRef(false);
onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div
    class="registry-preview not-prose my-6 flex min-h-48 w-full items-center justify-center overflow-visible rounded-xl border border-border bg-background p-8"
  >
    <slot v-if="mounted" />
  </div>
</template>
