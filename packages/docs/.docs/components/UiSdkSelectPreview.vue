<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../../ui/registry/ui-sdk/ui-sdk-select";
</script>

<template>
  <PreviewFrame class="min-h-80">
    <div class="flex w-full flex-wrap items-start justify-center gap-4 self-start">
      <Select default-value="viewer" virtual-focus>
        <SelectTrigger aria-label="Project access" class="w-44">
          <SelectValue placeholder="Choose access" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Project access</SelectGroupLabel>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="admin" disabled>Admin</SelectItem>
        </SelectContent>
      </Select>
      <Select default-value="daily">
        <SelectTrigger size="sm" aria-label="Frequency" class="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </PreviewFrame>
</template>
