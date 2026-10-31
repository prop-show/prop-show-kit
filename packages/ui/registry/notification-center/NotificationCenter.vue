<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { BellIcon, CheckCheckIcon, XIcon } from "@lucide/vue";
import { computed, nextTick, useId, watch } from "vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { NotificationFilter, NotificationItem } from "./inbox";
import {
  dismissNotification,
  formatNotificationTime,
  markAllNotificationsRead,
  markNotificationRead,
  notificationDateTime,
  unreadCount,
  visibleNotifications,
} from "./inbox";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    title?: string;
    markAllLabel?: string;
    allLabel?: string;
    unreadLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    unreadEmptyTitle?: string;
    unreadEmptyDescription?: string;
    showAllLabel?: string;
    dismissLabel?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    title: "Notifications",
    markAllLabel: "Mark all read",
    allLabel: "All",
    unreadLabel: "Unread",
    emptyTitle: "You're all caught up",
    emptyDescription: "New notifications will show up here.",
    unreadEmptyTitle: "No unread notifications",
    unreadEmptyDescription: "Everything in this inbox has been read.",
    showAllLabel: "Show all",
    dismissLabel: "Dismiss",
  },
);

const items = defineModel<NotificationItem[]>({ default: () => [] });
const filter = defineModel<NotificationFilter>("filter", { default: "all" });

const emit = defineEmits<{
  open: [item: NotificationItem];
  markRead: [id: string];
  markAllRead: [];
  dismiss: [id: string];
}>();

const baseId = useId();
const titleId = `${baseId}-title`;
const panelId = `${baseId}-panel`;
const filters = ["all", "unread"] as const;
const tabs = new Map<NotificationFilter, HTMLButtonElement>();

const source = computed(() => items.value ?? []);
const unread = computed(() => unreadCount(source.value));
const visible = computed(() => visibleNotifications(source.value, filter.value));
const emptyCopy = computed(() =>
  filter.value === "unread" && source.value.length > 0
    ? { title: props.unreadEmptyTitle, description: props.unreadEmptyDescription }
    : { title: props.emptyTitle, description: props.emptyDescription },
);

function commit(next: readonly NotificationItem[]) {
  if (next !== source.value) items.value = next.slice();
}

function setTab(name: NotificationFilter, element: unknown) {
  if (element instanceof HTMLButtonElement) tabs.set(name, element);
  else if (element === null) tabs.delete(name);
}

function selectFilter(next: NotificationFilter, moveFocus = false) {
  filter.value = next;
  if (moveFocus) void nextTick(() => tabs.get(next)?.focus());
}

function onFilterKeydown(event: KeyboardEvent) {
  const current = filters.indexOf(filter.value);
  const start = current < 0 ? 0 : current;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    selectFilter(filters[(start + 1) % filters.length] ?? "all", true);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    selectFilter(filters[(start - 1 + filters.length) % filters.length] ?? "all", true);
  } else if (event.key === "Home") {
    event.preventDefault();
    selectFilter("all", true);
  } else if (event.key === "End") {
    event.preventDefault();
    selectFilter("unread", true);
  }
}

function openItem(item: NotificationItem) {
  const next = markNotificationRead(source.value, item.id);
  const updated = next.find((entry) => entry.id === item.id) ?? item;
  commit(next);
  if (!item.read) emit("markRead", item.id);
  emit("open", updated);
}

function markAll() {
  const next = markAllNotificationsRead(source.value);
  if (next === source.value) return;
  commit(next);
  emit("markAllRead");
}

function remove(id: string) {
  const next = dismissNotification(source.value, id);
  if (next === source.value) return;
  commit(next);
  emit("dismiss", id);
}

function tabId(name: NotificationFilter) {
  return `${baseId}-tab-${name}`;
}

function labelFor(name: NotificationFilter) {
  return name === "unread" ? props.unreadLabel : props.allLabel;
}

watch(filter, (value) => {
  if (value !== "all" && value !== "unread") filter.value = "all";
});
</script>

<template>
  <section
    v-bind="$attrs"
    data-slot="notification-center"
    :aria-labelledby="titleId"
    :class="
      cn(
        'flex w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-background text-foreground shadow-sm',
        props.class,
      )
    "
  >
    <header
      data-slot="notification-center-header"
      class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-4 py-3"
    >
      <div class="flex items-center gap-2">
        <h2 :id="titleId" class="text-sm font-semibold">{{ title }}</h2>
        <span
          v-if="unread > 0"
          aria-hidden="true"
          class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground"
          >{{ unread }}</span
        >
        <span class="sr-only" aria-live="polite">{{ unread }} unread</span>
      </div>
      <Button type="button" variant="ghost" size="sm" :disabled="unread === 0" @click="markAll">
        <CheckCheckIcon aria-hidden="true" />
        {{ markAllLabel }}
      </Button>
    </header>

    <div class="flex gap-1 border-b px-3 py-2" role="tablist" :aria-label="title">
      <button
        v-for="name in filters"
        :id="tabId(name)"
        :key="name"
        :ref="(element) => setTab(name, element)"
        type="button"
        role="tab"
        :aria-selected="filter === name"
        :aria-controls="panelId"
        :tabindex="filter === name ? 0 : -1"
        :class="
          cn(
            'rounded-md px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
            filter === name
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted/70',
          )
        "
        @click="selectFilter(name)"
        @keydown="onFilterKeydown"
      >
        {{ labelFor(name) }}
      </button>
    </div>

    <div
      :id="panelId"
      role="tabpanel"
      :aria-labelledby="tabId(filter)"
      :tabindex="visible.length || (filter === 'unread' && source.length) ? -1 : 0"
    >
      <ScrollArea class="h-80">
        <ul v-if="visible.length" data-slot="notification-center-list" class="flex flex-col">
          <li
            v-for="item in visible"
            :key="item.id"
            data-slot="notification-center-item"
            :data-read="item.read ? 'true' : 'false'"
            class="flex items-stretch border-b last:border-b-0"
          >
            <component
              :is="item.href ? 'a' : 'button'"
              :href="item.href"
              :type="item.href ? undefined : 'button'"
              class="flex min-w-0 flex-1 gap-3 px-4 py-3 text-left outline-none hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
              @click="openItem(item)"
            >
              <span
                class="mt-1.5 size-2 shrink-0 rounded-full"
                :class="item.read ? 'bg-transparent' : 'bg-primary'"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1">
                <span v-if="!item.read" class="sr-only">Unread. </span>
                <slot name="item" :item="item">
                  <span
                    class="block text-sm"
                    :class="item.read ? 'text-muted-foreground' : 'font-medium'"
                    >{{ item.title }}</span
                  >
                  <span v-if="item.body" class="mt-0.5 block text-sm text-muted-foreground">{{
                    item.body
                  }}</span>
                </slot>
                <time
                  v-if="notificationDateTime(item.createdAt)"
                  :datetime="notificationDateTime(item.createdAt)"
                  class="mt-1 block text-xs text-muted-foreground"
                  >{{ formatNotificationTime(item.createdAt) }}</time
                >
              </span>
            </component>
            <div class="flex items-start py-2 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                :aria-label="`${dismissLabel} ${item.title}`"
                @click="remove(item.id)"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          </li>
        </ul>
        <div
          v-else
          data-slot="notification-center-empty"
          class="flex flex-col items-center gap-2 px-6 py-12 text-center"
        >
          <slot name="empty" :filter="filter">
            <BellIcon class="size-8 text-muted-foreground" aria-hidden="true" />
            <p class="text-sm font-medium">{{ emptyCopy.title }}</p>
            <p class="max-w-xs text-sm text-muted-foreground">{{ emptyCopy.description }}</p>
            <Button
              v-if="filter === 'unread' && source.length"
              type="button"
              variant="outline"
              size="sm"
              class="mt-2"
              @click="selectFilter('all')"
            >
              {{ showAllLabel }}
            </Button>
          </slot>
        </div>
      </ScrollArea>
    </div>
  </section>
</template>
