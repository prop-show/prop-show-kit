<script setup lang="ts">
import { computed, useId } from "vue";
import { ReplyIcon } from "@lucide/vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CommentComposer from "./CommentComposer.vue";
import {
  canReply,
  commentDateTime,
  commentInitials,
  commentReplies,
  formatCommentTime,
} from "./thread";
import type { CommentItem } from "./thread";

defineOptions({ name: "CommentBranch" });

const props = defineProps<{
  comment: CommentItem;
  depth: number;
  maxDepth: number;
  replyingTo: string | null;
  replyLabel: string;
  cancelLabel: string;
  replySubmitLabel: string;
  replyPlaceholder: string;
  replyToLabel: string;
}>();

const emit = defineEmits<{
  reply: [id: string];
  cancel: [];
  submit: [id: string, body: string];
}>();

const nameId = useId();
const composerId = useId();
const replies = computed(() => commentReplies(props.comment));
const open = computed(() => props.replyingTo === props.comment.id);
const allowReply = computed(() => canReply(props.depth, props.maxDepth));
const replyName = computed(() =>
  props.replyToLabel.replaceAll("{name}", props.comment.author.name),
);
const when = computed(() => formatCommentTime(props.comment.createdAt));
const datetime = computed(() => commentDateTime(props.comment.createdAt));

function forwardSubmit(id: string, body: string) {
  emit("submit", id, body);
}
</script>

<template>
  <li data-slot="comments-thread-comment" :data-comment-id="comment.id" :data-depth="depth">
    <div class="flex gap-3">
      <Avatar class="mt-0.5 size-8" aria-hidden="true">
        <AvatarImage v-if="comment.author.avatarUrl" :src="comment.author.avatarUrl" alt="" />
        <AvatarFallback>{{ commentInitials(comment.author.name) }}</AvatarFallback>
      </Avatar>
      <div class="min-w-0 flex-1">
        <article :aria-labelledby="nameId">
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span :id="nameId" class="text-sm font-medium">{{ comment.author.name }}</span>
            <time v-if="datetime" :datetime="datetime" class="text-xs text-muted-foreground">{{
              when
            }}</time>
          </div>
          <div class="mt-1 text-sm">
            <slot name="comment" :comment="comment">
              <p class="whitespace-pre-wrap">{{ comment.body }}</p>
            </slot>
          </div>
          <div v-if="allowReply" class="mt-1">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              :aria-expanded="open"
              :aria-controls="open ? composerId : undefined"
              @click="emit('reply', comment.id)"
            >
              <ReplyIcon aria-hidden="true" />
              {{ replyLabel }}
              <span class="sr-only"> to {{ comment.author.name }}</span>
            </Button>
          </div>
          <CommentComposer
            v-if="open"
            :form-id="composerId"
            class="mt-2"
            :label="replyName"
            :placeholder="replyPlaceholder"
            :submit-label="replySubmitLabel"
            :cancel-label="cancelLabel"
            show-cancel
            autofocus
            @submit="emit('submit', comment.id, $event)"
            @cancel="emit('cancel')"
          />
        </article>
        <ul
          v-if="replies.length"
          data-slot="comments-thread-replies"
          role="list"
          class="m-0 mt-3 list-none space-y-3 border-l pl-3"
        >
          <CommentBranch
            v-for="reply in replies"
            :key="reply.id"
            :comment="reply"
            :depth="depth + 1"
            :max-depth="maxDepth"
            :replying-to="replyingTo"
            :reply-label="replyLabel"
            :cancel-label="cancelLabel"
            :reply-submit-label="replySubmitLabel"
            :reply-placeholder="replyPlaceholder"
            :reply-to-label="replyToLabel"
            @reply="emit('reply', $event)"
            @cancel="emit('cancel')"
            @submit="forwardSubmit"
          >
            <template v-if="$slots.comment" #comment="slotProps">
              <slot name="comment" v-bind="slotProps" />
            </template>
          </CommentBranch>
        </ul>
      </div>
    </div>
  </li>
</template>
