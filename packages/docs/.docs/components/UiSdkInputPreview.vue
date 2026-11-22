<script setup lang="ts">
import { shallowRef, useId } from "vue";
import { Button } from "../../../ui/registry/ui-sdk/ui-sdk-button";
import { Input } from "../../../ui/registry/ui-sdk/ui-sdk-input";

const emailId = useId();
const email = shallowRef("");
const submitted = shallowRef("");
</script>

<template>
  <PreviewFrame>
    <form class="w-full max-w-xs space-y-3" @submit.prevent="submitted = email">
      <div class="space-y-1.5">
        <label :for="emailId" class="block text-sm font-medium">Email address</label>
        <Input
          :id="emailId"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <Button type="submit" size="sm">Continue</Button>
      <p
        v-if="submitted && submitted === email"
        role="status"
        class="text-sm text-muted-foreground"
      >
        Email accepted.
      </p>
    </form>
  </PreviewFrame>
</template>
