<script setup lang="ts">
import { ref } from "vue";

import { PasswordInput } from "../../../ui/registry/password-input";

const created = ref("");
const current = ref("");
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-md gap-8">
      <PasswordInput v-model="created" label="New password" autocomplete="new-password" />
      <PasswordInput
        v-model="current"
        label="Current password"
        autocomplete="current-password"
        placeholder="Enter your current password"
        :show-strength="false"
        :show-requirements="false"
      />
    </div>
  </PreviewFrame>
</template>
