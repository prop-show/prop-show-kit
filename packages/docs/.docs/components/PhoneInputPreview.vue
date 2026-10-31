<script setup lang="ts">
import { ref } from "vue";

import { PhoneInput } from "../../../ui/registry/phone-input";

const mobile = ref("");
const support = ref("+442079460958");
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-md gap-8">
      <div class="grid gap-2">
        <PhoneInput
          v-model="mobile"
          label="Mobile"
          default-country="US"
          placeholder="201 555 0123"
        />
        <p class="text-sm text-muted-foreground">
          {{ mobile || "The E.164 value appears as you type." }}
        </p>
      </div>
      <PhoneInput v-model="support" label="Support line" default-country="GB" />
      <PhoneInput label="Locked" default-country="US" model-value="+12015550123" disabled />
    </div>
  </PreviewFrame>
</template>
