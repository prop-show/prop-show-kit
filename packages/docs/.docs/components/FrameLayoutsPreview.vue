<script setup lang="ts">
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "../../../ui/registry/frame";
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full min-w-0 gap-5 md:grid-cols-2">
      <Frame>
        <FrameHeader
          ><FrameTitle>Separated panels</FrameTitle
          ><FrameDescription>Workspace services</FrameDescription></FrameHeader
        >
        <FramePanel
          ><FrameTitle>API</FrameTitle><FrameDescription>Operational</FrameDescription></FramePanel
        >
        <FramePanel
          ><FrameTitle>Database</FrameTitle
          ><FrameDescription>Operational</FrameDescription></FramePanel
        >
        <FrameFooter>Updated just now</FrameFooter>
      </Frame>
      <Frame stacked dense>
        <FrameHeader
          ><FrameTitle>Stacked and dense</FrameTitle
          ><FrameDescription>Recent activity</FrameDescription></FrameHeader
        >
        <FramePanel
          ><FrameTitle>Deployment complete</FrameTitle
          ><FrameDescription>Version 2.4.1 is live</FrameDescription></FramePanel
        >
        <FramePanel
          ><FrameTitle>Backup complete</FrameTitle
          ><FrameDescription>All records saved</FrameDescription></FramePanel
        >
        <FrameFooter>2 events</FrameFooter>
      </Frame>
    </div>
  </PreviewFrame>
</template>
