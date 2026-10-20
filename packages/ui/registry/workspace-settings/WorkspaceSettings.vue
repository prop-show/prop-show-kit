<script setup lang="ts">
import { computed, reactive, shallowRef, useId } from "vue";
import { BellIcon, Building2Icon, MailIcon } from "@lucide/vue";
import { Frame, FrameDescription, FrameHeader, FramePanel, FrameTitle } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const id = useId();
const form = reactive({
  name: "PropShow studio",
  email: "hello@example.com",
  deployments: true,
  digest: false,
});
const saved = shallowRef({ ...form });
const notice = shallowRef("");
const isDirty = computed(
  () =>
    form.name !== saved.value.name ||
    form.email !== saved.value.email ||
    form.deployments !== saved.value.deployments ||
    form.digest !== saved.value.digest,
);
function save() {
  saved.value = { ...form };
  notice.value = "Settings saved for this preview. Refreshing restores the sample values.";
}
function reset() {
  Object.assign(form, saved.value);
  notice.value = "";
}
</script>

<template>
  <section aria-label="Workspace settings" class="w-full max-w-3xl space-y-6">
    <header>
      <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Workspace</p>
      <h2 class="mt-2 text-2xl font-semibold tracking-tight">Make yourself at home.</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        The small details that make this space yours.
      </p>
    </header>
    <form class="space-y-4" @submit.prevent="save" @input="notice = ''">
      <Frame>
        <FrameHeader>
          <FrameTitle class="flex items-center gap-2"
            ><Building2Icon aria-hidden="true" class="size-4" />General</FrameTitle
          >
          <FrameDescription>How your workspace appears to your team.</FrameDescription>
        </FrameHeader>
        <FramePanel class="space-y-5">
          <div class="space-y-2">
            <label :for="`${id}-name`" class="text-sm font-medium">Workspace name</label>
            <Input
              :id="`${id}-name`"
              v-model="form.name"
              name="workspace"
              autocomplete="organization"
              required
              maxlength="80"
            />
          </div>
          <div class="space-y-2">
            <label :for="`${id}-email`" class="text-sm font-medium">Contact email</label>
            <Input
              :id="`${id}-email`"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              :aria-describedby="`${id}-email-hint`"
            />
            <p :id="`${id}-email-hint`" class="text-xs text-muted-foreground">
              Workspace notifications will use this address.
            </p>
          </div>
        </FramePanel>
      </Frame>
      <Frame>
        <FrameHeader>
          <FrameTitle class="flex items-center gap-2"
            ><BellIcon aria-hidden="true" class="size-4" />Notifications</FrameTitle
          >
          <FrameDescription>A useful signal, without the noise.</FrameDescription>
        </FrameHeader>
        <FramePanel class="divide-y divide-border py-0">
          <label class="flex cursor-pointer items-start gap-3 py-4" :for="`${id}-deployments`">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted"
              ><BellIcon aria-hidden="true" class="size-4"
            /></span>
            <span class="min-w-0 flex-1"
              ><span class="block text-sm font-medium">Deployment updates</span
              ><span class="mt-1 block text-xs leading-relaxed text-muted-foreground"
                >Know when a project is ready, or when a build needs your attention.</span
              ></span
            >
            <input
              :id="`${id}-deployments`"
              v-model="form.deployments"
              type="checkbox"
              class="mt-1 size-4 shrink-0 accent-primary"
            />
          </label>
          <label class="flex cursor-pointer items-start gap-3 py-4" :for="`${id}-digest`">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted"
              ><MailIcon aria-hidden="true" class="size-4"
            /></span>
            <span class="min-w-0 flex-1"
              ><span class="block text-sm font-medium">Weekly digest</span
              ><span class="mt-1 block text-xs leading-relaxed text-muted-foreground"
                >A weekly look at what your team shipped and what is coming next.</span
              ></span
            >
            <input
              :id="`${id}-digest`"
              v-model="form.digest"
              type="checkbox"
              class="mt-1 size-4 shrink-0 accent-primary"
            />
          </label>
        </FramePanel>
      </Frame>
      <footer class="flex flex-wrap items-center justify-between gap-3">
        <p role="status" class="min-w-0 flex-1 text-xs text-muted-foreground">
          {{ notice || (isDirty ? "You have unsaved changes." : "Everything is up to date.") }}
        </p>
        <div class="flex gap-2">
          <Button type="button" variant="ghost" :disabled="!isDirty" @click="reset">Discard</Button>
          <Button type="submit" :disabled="!isDirty">Save changes</Button>
        </div>
      </footer>
    </form>
  </section>
</template>
