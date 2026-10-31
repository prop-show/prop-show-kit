export interface CommentAuthor {
  name: string;
  /** Optional image URL. When omitted, the avatar shows initials from the name. */
  avatarUrl?: string;
}

export interface CommentItem {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt: string | number | Date;
  replies?: CommentItem[];
}

/** Deepest comment that can exist. A top-level comment is depth 1. */
export const DEFAULT_MAX_DEPTH = 3;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function normalizeMaxDepth(maxDepth: number): number {
  return Number.isInteger(maxDepth) && maxDepth >= 1 ? maxDepth : 1;
}

export function commentReplies(item: CommentItem): readonly CommentItem[] {
  return Array.isArray(item.replies) ? item.replies : [];
}

export function commentTimeValue(value: CommentItem["createdAt"]): number | null {
  const time =
    value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

/** English relative label. Dates older than a week use a UTC `YYYY-MM-DD` day. */
export function formatCommentTime(value: CommentItem["createdAt"], now = Date.now()): string {
  const time = commentTimeValue(value);
  if (time === null) return "";
  const delta = Math.max(0, now - time);
  if (delta < MINUTE) return "Just now";
  if (delta < HOUR) {
    const minutes = Math.floor(delta / MINUTE);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  if (delta < DAY) {
    const hours = Math.floor(delta / HOUR);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  const days = Math.floor(delta / DAY);
  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
  return new Date(time).toISOString().slice(0, 10);
}

export function commentDateTime(value: CommentItem["createdAt"]): string | undefined {
  const time = commentTimeValue(value);
  return time === null ? undefined : new Date(time).toISOString();
}

export function commentInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "?";
  const start = first.codePointAt(0);
  const end = parts.length > 1 ? parts[parts.length - 1]?.codePointAt(0) : undefined;
  const startChar = start === undefined ? "?" : String.fromCodePoint(start);
  const endChar = end === undefined ? "" : String.fromCodePoint(end);
  return `${startChar}${endChar}`.toUpperCase();
}

export function countComments(items: readonly CommentItem[]): number {
  let count = 0;
  for (const item of items) count += 1 + countComments(commentReplies(item));
  return count;
}

export function findComment(items: readonly CommentItem[], id: string): CommentItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    const nested = findComment(commentReplies(item), id);
    if (nested) return nested;
  }
  return undefined;
}

/** Depth of a comment. A top-level comment is 1. Missing ids return null. */
export function commentDepth(items: readonly CommentItem[], id: string, depth = 1): number | null {
  for (const item of items) {
    if (item.id === id) return depth;
    const nested = commentDepth(commentReplies(item), id, depth + 1);
    if (nested !== null) return nested;
  }
  return null;
}

/** True when a comment at `depth` can still receive a reply. */
export function canReply(depth: number, maxDepth: number): boolean {
  return depth >= 1 && depth < normalizeMaxDepth(maxDepth);
}

export function createComment(input: {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt?: CommentItem["createdAt"];
}): CommentItem | null {
  const id = input.id.trim();
  const body = input.body.trim();
  const name = input.author.name.trim();
  if (!id || !body || !name) return null;
  return {
    id,
    author: { ...input.author, name },
    body,
    createdAt: input.createdAt ?? new Date(),
    replies: [],
  };
}

function withReply<T extends CommentItem>(
  items: readonly T[],
  parentId: string,
  comment: T,
): readonly T[] {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item) continue;
    if (item.id === parentId) {
      const next = items.slice();
      next[index] = { ...item, replies: [...commentReplies(item), comment] };
      return next;
    }
    const replies = commentReplies(item);
    if (!replies.length) continue;
    const nested = withReply(replies, parentId, comment);
    if (nested === replies) continue;
    const next = items.slice();
    next[index] = { ...item, replies: nested.slice() };
    return next;
  }
  return items;
}

/**
 * Insert `comment` at the root, or under `parentId`.
 * Returns the same array when the id already exists, the parent is missing,
 * or the parent is already at `maxDepth`.
 */
export function addComment<T extends CommentItem>(
  items: readonly T[],
  comment: T,
  parentId: string | null,
  maxDepth: number,
): readonly T[] {
  if (!comment.id || findComment(items, comment.id)) return items;
  const entry = { ...comment, replies: [...commentReplies(comment)] } as T;
  if (parentId === null) return [...items, entry];
  const depth = commentDepth(items, parentId);
  if (depth === null || !canReply(depth, maxDepth)) return items;
  return withReply(items, parentId, entry);
}
