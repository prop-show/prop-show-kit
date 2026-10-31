export { default as CommentsThread } from "./CommentsThread.vue";
export type { CommentAuthor, CommentItem } from "./thread";
export {
  addComment,
  canReply,
  commentDateTime,
  commentDepth,
  commentInitials,
  countComments,
  createComment,
  findComment,
  formatCommentTime,
} from "./thread";
