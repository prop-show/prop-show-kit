<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/registry/ui-sdk/ui-sdk-tabs";
</script>

<template>
  <PreviewFrame>
    <Tabs default-value="overview" class="flex w-full max-w-xs flex-col gap-2">
      <TabsList aria-label="Project">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        class="rounded-md border p-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
      >
        <h3 class="font-medium">Production</h3>
        <p class="text-muted-foreground">The latest deployment is ready.</p>
      </TabsContent>
      <TabsContent
        value="activity"
        class="rounded-md border p-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
      >
        <h3 class="font-medium">Deployment complete</h3>
        <p class="text-muted-foreground">The main branch was deployed.</p>
      </TabsContent>
    </Tabs>
  </PreviewFrame>
</template>
