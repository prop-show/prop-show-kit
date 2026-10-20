<script setup lang="ts">
import { computed, ref, shallowRef, useId } from "vue";
import { SearchIcon, UsersIcon } from "@lucide/vue";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/frame";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import InviteMemberDialog from "./InviteMemberDialog.vue";

const searchId = useId();
const query = shallowRef("");
const notice = shallowRef("");
const members = ref([
  { name: "Alex Morgan", email: "alex@example.com", role: "Owner", status: "Active" },
  { name: "Jamie Chen", email: "jamie@example.com", role: "Member", status: "Active" },
  { name: "Sam Rivera", email: "sam@example.com", role: "Member", status: "Active" },
  { name: "Taylor Kim", email: "taylor@example.com", role: "Member", status: "Invited" },
]);
const emails = computed(() => members.value.map((member) => member.email));
const visibleMembers = computed(() => {
  const term = query.value.trim().toLowerCase();
  return members.value.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(term),
  );
});
function inviteMember(name: string, email: string) {
  members.value.push({ name, email, role: "Member", status: "Invited" });
  query.value = "";
  notice.value = `${name} was added to this preview. No invitation email was sent.`;
}
</script>

<template>
  <section aria-label="Team members" class="w-full max-w-4xl space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Workspace</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight">Your people, together.</h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Manage the team behind your next great idea.
        </p>
      </div>
      <InviteMemberDialog :emails="emails" @invite="inviteMember" />
    </header>

    <Frame>
      <FrameHeader class="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <FrameTitle class="flex items-center gap-2">
            <UsersIcon aria-hidden="true" class="size-4" />Team members
          </FrameTitle>
          <FrameDescription>{{ members.length }} people in this workspace</FrameDescription>
        </div>
        <div class="relative w-full sm:max-w-64">
          <label :for="searchId" class="sr-only">Search members</label>
          <SearchIcon
            aria-hidden="true"
            class="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground"
          />
          <Input
            :id="searchId"
            v-model="query"
            type="search"
            placeholder="Search members…"
            class="pl-9"
          />
        </div>
      </FrameHeader>
      <FramePanel class="py-0">
        <ul v-if="visibleMembers.length" aria-label="Members" class="divide-y divide-border">
          <li
            v-for="member in visibleMembers"
            :key="member.email"
            class="grid items-center gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-6"
          >
            <div class="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
                >{{ member.name.slice(0, 1) }}</span
              >
              <div class="min-w-0">
                <p class="text-sm font-medium">{{ member.name }}</p>
                <p class="break-all text-xs text-muted-foreground">{{ member.email }}</p>
              </div>
            </div>
            <span class="text-xs text-muted-foreground">{{ member.role }}</span>
            <StatusBadge
              variant="outline"
              :color="member.status === 'Active' ? 'green' : 'blue'"
              class="w-fit"
              >{{ member.status }}</StatusBadge
            >
          </li>
        </ul>
        <p v-else role="status" class="py-12 text-center text-sm text-muted-foreground">
          No members match “{{ query }}”.
        </p>
      </FramePanel>
      <FrameFooter aria-live="polite"
        >Showing {{ visibleMembers.length }} of {{ members.length }} members</FrameFooter
      >
    </Frame>
    <p v-if="notice" role="status" class="text-sm text-muted-foreground">{{ notice }}</p>
  </section>
</template>
