<script setup lang="ts">
import { shallowRef, useId } from "vue";
import { Switch } from "../../../ui/registry/ui-sdk/ui-sdk-switch";

const checked = shallowRef(true);
const id = useId();
</script>

<template>
  <PreviewFrame>
    <div class="flex w-full max-w-xs items-center justify-between gap-4">
      <label :for="id" class="cursor-pointer text-sm font-medium">Desktop alerts</label>
      <Switch :id="id" v-model="checked" name="desktop-alerts" />
    </div>
  </PreviewFrame>
</template>
