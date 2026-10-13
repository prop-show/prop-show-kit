<script setup lang="ts">
import { InlineCopyText } from "../../../ui/registry/inline-copy-text";
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-xl gap-6">
      <InlineCopyText :labels="{ copyAction: 'Copy database ID', copied: 'Database ID copied' }"
        >f86b3f10-32e9-4db7-ae95-84a1b2c3d4e5</InlineCopyText
      >

      <InlineCopyText
        value="f86b3f10-32e9-4db7-ae95-84a1b2c3d4e5"
        variant="body"
        :labels="{ copyAction: 'Copy database ID', copied: 'Database ID copied' }"
      >
        <span>Database ID: <strong>f86b3f10…</strong></span>
      </InlineCopyText>

      <div
        class="group flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-muted px-4 py-3"
      >
        <span class="min-w-0 truncate text-sm text-foreground">Production database</span>
        <InlineCopyText :labels="{ copyAction: 'Copy database ID', copied: 'Database ID copied' }"
          >f86b3f10-32e9-4db7-ae95-84a1b2c3d4e5</InlineCopyText
        >
      </div>
    </div>
  </PreviewFrame>
</template>
