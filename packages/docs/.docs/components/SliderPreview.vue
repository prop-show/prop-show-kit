<script setup lang="ts">
import { ref } from "vue";
import { Slider } from "../../../ui/registry/slider";

defineProps<{ examples?: boolean }>();
const brightness = ref([50]);
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-2xl gap-10" :class="examples ? 'sm:grid-cols-2' : 'max-w-xs'">
      <Slider
        label="Price range"
        :default-value="[25, 75]"
        :get-aria-label="(index) => (index === 0 ? 'Minimum price' : 'Maximum price')"
      />
      <template v-if="examples">
        <Slider label="Volume" :default-value="[40]" />
        <Slider label="Match count" :default-value="[2]" :max="5" />
        <Slider
          label="Sampling rate"
          :default-value="[0.25]"
          :max="1"
          :step="0.05"
          :format="{ style: 'percent' }"
        />
        <Slider label="Small" size="sm" :default-value="[30]" />
        <Slider label="Base" :default-value="[30]" />
        <div class="space-y-3">
          <Slider v-model="brightness" label="Brightness" />
          <p class="text-sm text-muted-foreground">Brightness: {{ brightness[0] }}%</p>
        </div>
        <Slider label="Locked" :default-value="[70]" disabled />
      </template>
    </div>
  </PreviewFrame>
</template>
