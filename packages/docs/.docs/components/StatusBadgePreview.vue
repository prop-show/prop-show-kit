<script setup lang="ts">
import { StatusBadge } from "../../../ui/registry/status-badge";
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-wrap justify-center gap-3">
      <StatusBadge color="green">Operational</StatusBadge>
      <StatusBadge color="orange" variant="secondary">Degraded</StatusBadge>
      <StatusBadge color="red" variant="destructive">Offline</StatusBadge>
      <StatusBadge color="blue" variant="outline">Deploying</StatusBadge>
    </div>
  </PreviewFrame>
</template>
