<script setup lang="ts">
import { MaximizeIcon, MonitorIcon, RotateCcwIcon, SmartphoneIcon, TabletIcon } from "@lucide/vue";
import { TabsList, TabsTrigger } from "reka-ui";
import { Button } from "@/components/ui/button";

defineProps<{
  width?: number;
  fullscreenSupported: boolean;
}>();
const emit = defineEmits<{
  selectWidth: [width: number];
  reset: [];
  toggleFullscreen: [];
}>();
const devices = [
  { label: "PC", width: 1440, icon: MonitorIcon },
  { label: "iPad", width: 768, icon: TabletIcon },
  { label: "Phone", width: 390, icon: SmartphoneIcon },
];
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 border-b border-border p-2">
    <TabsList aria-label="Component example" class="flex gap-1">
      <TabsTrigger
        v-for="value in ['preview', 'code']"
        :key="value"
        :value="value"
        class="rounded-md px-3 py-1.5 text-sm capitalize text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-muted data-[state=active]:text-foreground"
        >{{ value }}</TabsTrigger
      >
    </TabsList>
    <div class="ml-auto flex items-center gap-1">
      <Button
        v-for="device in devices"
        :key="device.label"
        type="button"
        variant="ghost"
        size="icon-sm"
        :aria-label="`${device.label} (${device.width}px)`"
        :title="`${device.label} (${device.width}px)`"
        :aria-pressed="width === device.width"
        :class="{ 'bg-muted': width === device.width }"
        @click="emit('selectWidth', device.width)"
      >
        <component :is="device.icon" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Reset preview"
        title="Reset preview"
        @click="emit('reset')"
        ><RotateCcwIcon aria-hidden="true"
      /></Button>
      <Button
        v-if="fullscreenSupported"
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Enter fullscreen"
        title="Enter fullscreen"
        @click="emit('toggleFullscreen')"
        ><MaximizeIcon aria-hidden="true"
      /></Button>
    </div>
  </div>
</template>
