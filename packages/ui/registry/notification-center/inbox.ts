export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt: string | number | Date;
  /** Omitted or false means unread. */
  read?: boolean;
  href?: string;
}

export type NotificationFilter = "all" | "unread";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function notificationTimeValue(value: NotificationItem["createdAt"]): number | null {
  const time =
    value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

/** English relative label. Dates older than a week use a UTC `YYYY-MM-DD` day. */
export function formatNotificationTime(
  value: NotificationItem["createdAt"],
  now = Date.now(),
): string {
  const time = notificationTimeValue(value);
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

export function notificationDateTime(value: NotificationItem["createdAt"]): string | undefined {
  const time = notificationTimeValue(value);
  return time === null ? undefined : new Date(time).toISOString();
}

export function unreadCount(items: readonly NotificationItem[]): number {
  let count = 0;
  for (const item of items) if (!item.read) count += 1;
  return count;
}

export function visibleNotifications<T extends NotificationItem>(
  items: readonly T[],
  filter: NotificationFilter,
): readonly T[] {
  return filter === "unread" ? items.filter((item) => !item.read) : items;
}

export function markNotificationRead<T extends NotificationItem>(
  items: readonly T[],
  id: string,
): readonly T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0 || items[index]?.read) return items;
  const next = items.slice();
  next[index] = { ...items[index], read: true };
  return next;
}

export function markAllNotificationsRead<T extends NotificationItem>(
  items: readonly T[],
): readonly T[] {
  if (items.every((item) => item.read)) return items;
  return items.map((item) => (item.read ? item : { ...item, read: true }));
}

export function dismissNotification<T extends NotificationItem>(
  items: readonly T[],
  id: string,
): readonly T[] {
  const next = items.filter((item) => item.id !== id);
  return next.length === items.length ? items : next;
}
