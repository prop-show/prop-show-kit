<script setup lang="ts">
import { Copy as CopyButton } from "../../../ui/registry/copy";
</script>

<template>
  <PreviewFrame>
    <div class="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
      <code class="text-sm text-foreground">pnpm add suit-help</code>
      <CopyButton content="pnpm add suit-help" size="sm" />
    </div>
  </PreviewFrame>
</template>
