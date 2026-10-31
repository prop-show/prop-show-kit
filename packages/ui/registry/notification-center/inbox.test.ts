import { expect, test } from "vite-plus/test";
import {
  dismissNotification,
  formatNotificationTime,
  markAllNotificationsRead,
  markNotificationRead,
  notificationDateTime,
  unreadCount,
  visibleNotifications,
} from "./inbox";

const now = Date.UTC(2026, 9, 31, 12, 0, 0);

test("counts omitted read flags as unread", () => {
  expect(unreadCount([])).toBe(0);
  expect(
    unreadCount([
      { id: "a", title: "A", createdAt: now },
      { id: "b", title: "B", createdAt: now, read: false },
      { id: "c", title: "C", createdAt: now, read: true },
    ]),
  ).toBe(2);
});

test("filters to unread without copying the full list", () => {
  const items = [
    { id: "a", title: "A", createdAt: now, note: "keep" },
    { id: "b", title: "B", createdAt: now, read: true },
  ];
  expect(visibleNotifications(items, "all")).toBe(items);
  expect(visibleNotifications(items, "unread")).toEqual([items[0]]);
});

test("marks one item read and leaves an already-read list untouched", () => {
  const items = [
    { id: "a", title: "A", createdAt: now, note: "keep" },
    { id: "b", title: "B", createdAt: now, read: true },
  ];
  const next = markNotificationRead(items, "a");
  expect(next).not.toBe(items);
  expect(next[0]).toMatchObject({ id: "a", read: true, note: "keep" });
  expect(next[1]).toBe(items[1]);
  expect(markNotificationRead(next, "a")).toBe(next);
  expect(markNotificationRead(items, "missing")).toBe(items);
});

test("marks every unread item and dismisses by id", () => {
  const items = [
    { id: "a", title: "A", createdAt: now },
    { id: "b", title: "B", createdAt: now, read: true },
  ];
  const read = markAllNotificationsRead(items);
  expect(read.every((item) => item.read)).toBe(true);
  expect(read[1]).toBe(items[1]);
  expect(markAllNotificationsRead(read)).toBe(read);
  expect(dismissNotification(items, "missing")).toBe(items);
  expect(dismissNotification(items, "a")).toEqual([items[1]]);
});

test("formats relative times and falls back to a UTC day", () => {
  expect(formatNotificationTime("not-a-date", now)).toBe("");
  expect(notificationDateTime("not-a-date")).toBeUndefined();
  expect(formatNotificationTime(now + 5_000, now)).toBe("Just now");
  expect(formatNotificationTime(now - 59_000, now)).toBe("Just now");
  expect(formatNotificationTime(now - 60_000, now)).toBe("1 minute ago");
  expect(formatNotificationTime(now - 59 * 60_000, now)).toBe("59 minutes ago");
  expect(formatNotificationTime(now - 60 * 60_000, now)).toBe("1 hour ago");
  expect(formatNotificationTime(now - 23 * 60 * 60_000, now)).toBe("23 hours ago");
  expect(formatNotificationTime(now - 24 * 60 * 60_000, now)).toBe("1 day ago");
  expect(formatNotificationTime(now - 6 * 24 * 60 * 60_000, now)).toBe("6 days ago");
  expect(formatNotificationTime(now - 7 * 24 * 60 * 60_000, now)).toBe("2026-10-24");
  expect(notificationDateTime(new Date(now))).toBe("2026-10-31T12:00:00.000Z");
});
