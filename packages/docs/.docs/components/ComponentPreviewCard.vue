<script setup lang="ts">
import { computed } from "vue";
import { useColorMode } from "undocs/src/app/composables/useColorMode.ts";
import Icon from "undocs/src/app/components/global/Icon.vue";

const props = defineProps<{
  /** Illustration file name, which matches the registry item name. */
  name: string;
  title: string;
  description?: string;
  icon?: string;
  to: string;
}>();

const illustrations = import.meta.glob<string>("../../../../artifacts/illustrations/svg/*.svg", {
  eager: true,
  import: "default",
  query: "?raw",
});

const colorMode = useColorMode();
const thumbnail = computed(() => {
  const raw = illustrations[`../../../../artifacts/illustrations/svg/${props.name}.svg`];
  if (!raw) throw new Error(`Unknown illustration: ${props.name}`);
  // Follow the site's colour mode, not just the OS preference the SVG defaults to.
  return raw.replace('data-theme="auto"', `data-theme="${colorMode.value}"`);
});
</script>

<template>
  <!--
    Container queries, not viewport breakpoints: this card also renders inside the
    search palette's narrow preview pane, where a `sm:` viewport breakpoint would
    still pick the wide layout and squeeze the text into a 60px column. The
    wrapper is the container because an element cannot query its own size.
  -->
  <div class="@container not-prose">
    <a
      data-slot="component-preview-card"
      :href="to"
      class="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground no-underline! transition-colors hover:border-brand/50 hover:bg-accent/40 @[20rem]:flex-row @[20rem]:items-center @[20rem]:gap-3 @[26rem]:gap-4"
    >
      <span
        aria-hidden="true"
        class="w-full shrink-0 overflow-hidden rounded-md border border-border [&>svg]:block [&>svg]:h-auto [&>svg]:w-full @[20rem]:w-auto @[20rem]:[&>svg]:h-[96px] @[20rem]:[&>svg]:w-[128px] @[26rem]:[&>svg]:h-[120px] @[26rem]:[&>svg]:w-[160px]"
        v-html="thumbnail"
      />
      <span class="flex min-w-0 flex-col gap-1.5">
        <span class="flex items-center gap-2.5">
          <span
            v-if="icon"
            class="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand transition-colors group-hover:bg-brand/15"
          >
            <Icon :name="icon" class="size-5" />
          </span>
          <span class="text-base font-semibold text-foreground leading-tight">{{ title }}</span>
        </span>
        <span v-if="description" class="text-sm text-muted-foreground text-pretty leading-relaxed">
          {{ description }}
        </span>
      </span>
    </a>
  </div>
</template>
