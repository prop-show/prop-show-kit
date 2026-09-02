<script setup lang="ts">
import { InlineTip } from "../../../ui/registry/inline-tip";
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-2xl gap-3">
      <InlineTip label="Note">
        Use this for helpful context that belongs next to the content.
      </InlineTip>
      <InlineTip label="Warning" variant="warning">
        Review this value before continuing.
      </InlineTip>
      <InlineTip label="Success" variant="success"> The configuration is valid. </InlineTip>
      <InlineTip label="Error" variant="error"> The request could not be completed. </InlineTip>
    </div>
  </PreviewFrame>
</template>
