<script setup lang="ts">
import { WorkspaceSettings } from "../../../ui/registry/workspace-settings";
</script>

<template>
  <ComponentPreview
    source="workspace-settings/WorkspaceSettings.vue"
    registry="workspace-settings"
    :height="660"
  >
    <WorkspaceSettings />
  </ComponentPreview>
</template>
