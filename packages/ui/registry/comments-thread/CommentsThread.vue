<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { MessageSquareIcon } from "@lucide/vue";
import { computed, nextTick, shallowRef, useId } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import CommentBranch from "./CommentBranch.vue";
import CommentComposer from "./CommentComposer.vue";
import {
  addComment,
  commentInitials,
  countComments,
  createComment,
  DEFAULT_MAX_DEPTH,
} from "./thread";
import type { CommentAuthor, CommentItem } from "./thread";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    author: CommentAuthor;
    title?: string;
    replyLabel?: string;
    cancelLabel?: string;
    commentLabel?: string;
    replySubmitLabel?: string;
    placeholder?: string;
    replyPlaceholder?: string;
    replyToLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    maxDepth?: number;
    createId?: () => string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    title: "Comments",
    replyLabel: "Reply",
    cancelLabel: "Cancel",
    commentLabel: "Comment",
    replySubmitLabel: "Reply",
    placeholder: "Write a comment",
    replyPlaceholder: "Write a reply",
    replyToLabel: "Reply to {name}",
    emptyTitle: "No comments yet",
    emptyDescription: "Start the thread with the first comment.",
    maxDepth: DEFAULT_MAX_DEPTH,
    createId: () => {
      const crypto = globalThis.crypto;
      if (crypto?.randomUUID) return crypto.randomUUID();
      return `comment-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    },
  },
);

const items = defineModel<CommentItem[]>({ default: () => [] });
const draft = defineModel<string>("draft", { default: "" });

const emit = defineEmits<{
  submit: [comment: CommentItem, parentId: string | null];
}>();

const titleId = useId();
const replyingTo = shallowRef<string | null>(null);
const status = shallowRef("");
const source = computed(() => (Array.isArray(items.value) ? items.value : []));
const count = computed(() => countComments(source.value));
const countLabel = computed(() => (count.value === 1 ? "1 comment" : `${count.value} comments`));

function post(parentId: string | null, body: string) {
  const comment = createComment({
    id: props.createId(),
    author: props.author,
    body,
    createdAt: new Date(),
  });
  if (!comment) return false;
  const next = addComment(source.value, comment, parentId, props.maxDepth);
  if (next === source.value) return false;
  items.value = next.slice();
  status.value = "";
  const message = parentId ? "Reply posted." : "Comment posted.";
  void nextTick(() => {
    status.value = message;
  });
  emit("submit", comment, parentId);
  return true;
}

function postRoot(body: string) {
  if (post(null, body)) draft.value = "";
}

function postReply(id: string, body: string) {
  if (post(id, body)) replyingTo.value = null;
}

function requestReply(id: string) {
  replyingTo.value = replyingTo.value === id ? null : id;
}
</script>

<template>
  <section
    v-bind="$attrs"
    data-slot="comments-thread"
    :aria-labelledby="titleId"
    :class="
      cn(
        'flex w-full min-w-0 flex-col gap-4 rounded-xl border bg-background p-4 text-foreground shadow-sm',
        props.class,
      )
    "
  >
    <header data-slot="comments-thread-header" class="flex items-baseline gap-2">
      <h2 :id="titleId" class="text-sm font-semibold">{{ title }}</h2>
      <span v-if="count > 0" class="text-sm text-muted-foreground" aria-hidden="true">{{
        count
      }}</span>
      <span class="sr-only">{{ countLabel }}</span>
    </header>

    <ul
      v-if="source.length"
      data-slot="comments-thread-list"
      role="list"
      class="m-0 flex list-none flex-col gap-4 p-0"
    >
      <CommentBranch
        v-for="comment in source"
        :key="comment.id"
        :comment="comment"
        :depth="1"
        :max-depth="maxDepth"
        :replying-to="replyingTo"
        :reply-label="replyLabel"
        :cancel-label="cancelLabel"
        :reply-submit-label="replySubmitLabel"
        :reply-placeholder="replyPlaceholder"
        :reply-to-label="replyToLabel"
        @reply="requestReply"
        @cancel="replyingTo = null"
        @submit="postReply"
      >
        <template v-if="$slots.comment" #comment="slotProps">
          <slot name="comment" v-bind="slotProps" />
        </template>
      </CommentBranch>
    </ul>
    <div
      v-else
      data-slot="comments-thread-empty"
      class="flex flex-col items-center gap-2 px-6 py-8 text-center"
    >
      <slot name="empty">
        <MessageSquareIcon class="size-8 text-muted-foreground" aria-hidden="true" />
        <p class="text-sm font-medium">{{ emptyTitle }}</p>
        <p class="max-w-xs text-sm text-muted-foreground">{{ emptyDescription }}</p>
      </slot>
    </div>

    <div class="flex gap-3 border-t pt-4">
      <Avatar class="mt-0.5 size-8" aria-hidden="true">
        <AvatarImage v-if="author.avatarUrl" :src="author.avatarUrl" alt="" />
        <AvatarFallback>{{ commentInitials(author.name) }}</AvatarFallback>
      </Avatar>
      <CommentComposer
        v-model="draft"
        class="min-w-0 flex-1"
        :label="placeholder"
        :placeholder="placeholder"
        :submit-label="commentLabel"
        :disabled="!author.name.trim()"
        @submit="postRoot"
      />
    </div>
    <p class="sr-only" aria-live="polite">{{ status }}</p>
  </section>
</template>
