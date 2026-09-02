<script setup lang="ts">
import { Copy as CopyButton } from "../../../ui/registry/copy";
</script>

<template>
  <PreviewFrame>
    <div class="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
      <code class="text-sm text-foreground">pnpm add prop-show-kit</code>
      <CopyButton content="pnpm add prop-show-kit" size="sm" />
    </div>
  </PreviewFrame>
</template>
