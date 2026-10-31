<script setup lang="ts">
import { ref } from "vue";
import { CommentsThread, type CommentItem } from "../../../ui/registry/comments-thread";

const minute = 60_000;
const now = Date.now();
const comments = ref<CommentItem[]>([
  {
    id: "layout",
    author: { name: "Ada Lovelace" },
    body: "The preview frame should stay inside the page width on a phone.",
    createdAt: now - 2 * 60 * minute,
    replies: [
      {
        id: "layout-reply",
        author: { name: "Grace Hopper" },
        body: "I can reproduce it when the sidebar is open.",
        createdAt: now - 90 * minute,
      },
    ],
  },
  {
    id: "tokens",
    author: { name: "Alan Turing" },
    body: "Can we keep the comment actions on the semantic tokens?",
    createdAt: now - 5 * minute,
  },
]);
</script>

<template>
  <PreviewFrame>
    <div class="mx-auto w-full max-w-xl">
      <CommentsThread v-model="comments" :author="{ name: 'You' }" />
    </div>
  </PreviewFrame>
</template>
