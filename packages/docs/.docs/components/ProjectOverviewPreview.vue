<script setup lang="ts">
import { ProjectOverview } from "../../../ui/registry/project-overview";
</script>

<template>
  <ComponentPreview
    source="project-overview/ProjectOverview.vue"
    registry="project-overview"
    :height="580"
  >
    <ProjectOverview />
  </ComponentPreview>
</template>
