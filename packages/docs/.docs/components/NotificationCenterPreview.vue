<script setup lang="ts">
import { ref } from "vue";
import {
  NotificationCenter,
  type NotificationItem,
} from "../../../ui/registry/notification-center";

const minute = 60_000;
const now = Date.now();
const items = ref<NotificationItem[]>([
  {
    id: "deploy",
    title: "Deployment finished",
    body: "kit.prop.show is ready on main.",
    createdAt: now - 2 * minute,
  },
  {
    id: "invite",
    title: "Invite accepted",
    body: "Jamie Chen joined the workspace.",
    createdAt: now - 3 * 60 * minute,
  },
  {
    id: "billing",
    title: "Billing receipt",
    body: "The October invoice is ready to download.",
    createdAt: now - 2 * 24 * 60 * minute,
    read: true,
  },
  {
    id: "policy",
    title: "Security policy updated",
    body: "Review the new session timeout before Friday.",
    createdAt: now - 9 * 24 * 60 * minute,
    read: true,
  },
]);
</script>

<template>
  <PreviewFrame>
    <div class="mx-auto w-full max-w-md">
      <NotificationCenter v-model="items" />
    </div>
  </PreviewFrame>
</template>
