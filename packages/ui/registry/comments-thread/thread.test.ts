import { expect, test } from "vite-plus/test";
import {
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
import type { CommentItem } from "./thread";

const now = Date.UTC(2026, 9, 31, 12, 0, 0);
const ada = { name: "Ada Lovelace", avatarUrl: "https://example.com/ada.png" };

function comment(id: string, replies?: CommentItem[]): CommentItem {
  return { id, author: ada, body: id, createdAt: now, replies };
}

test("builds a comment and rejects a blank id, body, or author", () => {
  expect(createComment({ id: " ", author: ada, body: "Hello" })).toBeNull();
  expect(createComment({ id: "a", author: { name: "  " }, body: "Hello" })).toBeNull();
  expect(createComment({ id: "a", author: ada, body: " \n " })).toBeNull();
  expect(createComment({ id: " a ", author: { ...ada, name: " Ada " }, body: " Hello " })).toEqual({
    id: "a",
    author: { name: "Ada", avatarUrl: ada.avatarUrl },
    body: "Hello",
    createdAt: expect.any(Date),
    replies: [],
  });
});

test("derives initials from the first and last words", () => {
  expect(commentInitials("")).toBe("?");
  expect(commentInitials("   ")).toBe("?");
  expect(commentInitials("ada")).toBe("A");
  expect(commentInitials("  Ada   Lovelace  ")).toBe("AL");
  expect(commentInitials("Mary Anne Smith")).toBe("MS");
  expect(commentInitials("李雷")).toBe("李");
});

test("counts and finds comments through nested replies", () => {
  const items = [comment("a", [comment("a1", [comment("a1a")])]), comment("b")];
  expect(countComments(items)).toBe(4);
  expect(countComments([])).toBe(0);
  expect(findComment(items, "a1a")?.id).toBe("a1a");
  expect(findComment(items, "missing")).toBeUndefined();
  expect(commentDepth(items, "a")).toBe(1);
  expect(commentDepth(items, "a1a")).toBe(3);
  expect(commentDepth(items, "missing")).toBeNull();
  expect(commentDepth([comment("bare")], "bare")).toBe(1);
});

test("allows a reply only while the parent is above the depth limit", () => {
  expect(canReply(1, 3)).toBe(true);
  expect(canReply(2, 3)).toBe(true);
  expect(canReply(3, 3)).toBe(false);
  expect(canReply(1, 1)).toBe(false);
  expect(canReply(1, 0)).toBe(false);
  expect(canReply(1, 1.5)).toBe(false);
  expect(canReply(0, 3)).toBe(false);
});

test("appends a top-level comment without mutating the previous list", () => {
  const items = [comment("a")];
  const next = addComment(items, comment("b"), null, 3);
  expect(next).not.toBe(items);
  expect(items).toHaveLength(1);
  expect(next.map((item) => item.id)).toEqual(["a", "b"]);
  expect(next[0]).toBe(items[0]);
});

test("nests a reply under the parent and keeps sibling identity", () => {
  const sibling = comment("b");
  const items = [comment("a", [comment("a1")]), sibling];
  const next = addComment(items, comment("a2"), "a", 3);
  expect(next).not.toBe(items);
  expect(next[1]).toBe(sibling);
  expect(next[0]?.replies?.map((item) => item.id)).toEqual(["a1", "a2"]);
  expect(next[0]?.replies?.[0]).toBe(items[0]?.replies?.[0]);
  expect(items[0]?.replies).toHaveLength(1);
});

test("nests under a reply until max depth, then leaves the list untouched", () => {
  const items = [comment("a", [comment("a1")])];
  const nested = addComment(items, comment("a1a"), "a1", 3);
  expect(commentDepth(nested, "a1a")).toBe(3);
  expect(addComment(nested, comment("too-deep"), "a1a", 3)).toBe(nested);
  expect(addComment(items, comment("nope"), "a1", 2)).toBe(items);
  expect(addComment(items, comment("missing-parent"), "nope", 3)).toBe(items);
  expect(addComment(items, comment("a"), null, 3)).toBe(items);
});

test("formats relative times and falls back to a UTC day", () => {
  expect(formatCommentTime("not-a-date", now)).toBe("");
  expect(commentDateTime("not-a-date")).toBeUndefined();
  expect(formatCommentTime(now + 5_000, now)).toBe("Just now");
  expect(formatCommentTime(now - 59_000, now)).toBe("Just now");
  expect(formatCommentTime(now - 60_000, now)).toBe("1 minute ago");
  expect(formatCommentTime(now - 59 * 60_000, now)).toBe("59 minutes ago");
  expect(formatCommentTime(now - 60 * 60_000, now)).toBe("1 hour ago");
  expect(formatCommentTime(now - 23 * 60 * 60_000, now)).toBe("23 hours ago");
  expect(formatCommentTime(now - 24 * 60 * 60_000, now)).toBe("1 day ago");
  expect(formatCommentTime(now - 6 * 24 * 60 * 60_000, now)).toBe("6 days ago");
  expect(formatCommentTime(now - 7 * 24 * 60 * 60_000, now)).toBe("2026-10-24");
  expect(commentDateTime(new Date(now))).toBe("2026-10-31T12:00:00.000Z");
});
