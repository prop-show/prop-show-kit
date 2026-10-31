<script setup lang="ts">
import { SparklesIcon } from "@lucide/vue";
import AppLink from "undocs/src/app/components/app/AppLink.ts";
import { PricingPlan } from "../../../ui/registry/pricing-plan";
import HeroSpotlight from "../../../ui/registry/hero/HeroSpotlight.vue";
import { ProjectOverview } from "../../../ui/registry/project-overview";
import PreviewViewport from "./PreviewViewport.vue";
</script>

<template>
  <section class="not-prose my-8" aria-labelledby="landing-previews-title">
    <div class="mb-4 max-w-2xl">
      <h2 id="landing-previews-title" class="text-xl font-semibold tracking-tight text-foreground">
        Three entries, running
      </h2>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        A component, a marketing block, and a workspace screen. These are the live registry entries,
        scaled down.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <AppLink
        to="/components/pricing-plan"
        class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground no-underline! transition-colors hover:border-brand/50"
      >
        <div class="preview-frame relative h-64 overflow-hidden bg-muted/40" aria-hidden="true">
          <div inert class="preview-stage absolute top-0 left-0 origin-top-left">
            <PreviewViewport bare :height="620">
              <div class="flex w-full justify-center bg-background p-8">
                <div class="w-full max-w-sm">
                  <PricingPlan
                    :as="{ root: 'article', title: 'h3' }"
                    title="Pro"
                    description="For teams shipping their next product."
                    badge="Popular"
                    price="$29"
                    discount="$19"
                    billing-cycle="per member / month"
                    billing-period="Billed annually"
                    :features="[
                      'Unlimited projects',
                      { title: 'Priority support', icon: SparklesIcon },
                    ]"
                    :button="{ label: 'Choose Pro' }"
                    terms="Sample copy from the Pricing Plan docs."
                  />
                </div>
              </div>
            </PreviewViewport>
          </div>
        </div>
        <span class="flex flex-col gap-1 p-4">
          <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Component
          </span>
          <span class="text-base font-semibold text-foreground">Pricing Plan</span>
          <span class="text-sm leading-6 text-muted-foreground">
            A pricing card shadcn-vue does not ship.
          </span>
        </span>
      </AppLink>

      <AppLink
        to="/blocks/hero/hero-spotlight"
        class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground no-underline! transition-colors hover:border-brand/50"
      >
        <div class="preview-frame relative h-64 overflow-hidden bg-muted/40" aria-hidden="true">
          <div inert class="preview-stage absolute top-0 left-0 origin-top-left">
            <PreviewViewport bare :height="720">
              <HeroSpotlight
                title="Ship the screen, then make it yours"
                description="Navigation, a headline, and a trust band — copied in as source you edit."
                announcement="Blocks"
                announcement-href="/blocks"
                primary-label="Get started"
                secondary-label="View blocks"
              />
            </PreviewViewport>
          </div>
        </div>
        <span class="flex flex-col gap-1 p-4">
          <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Block · Hero
          </span>
          <span class="text-base font-semibold text-foreground">Spotlight Hero</span>
          <span class="text-sm leading-6 text-muted-foreground">
            A ready marketing screen, including its header.
          </span>
        </span>
      </AppLink>

      <AppLink
        to="/blocks/workspace"
        class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground no-underline! transition-colors hover:border-brand/50"
      >
        <div class="preview-frame relative h-64 overflow-hidden bg-muted/40" aria-hidden="true">
          <div inert class="preview-stage absolute top-0 left-0 origin-top-left">
            <PreviewViewport bare :height="680">
              <div class="bg-background p-6">
                <ProjectOverview />
              </div>
            </PreviewViewport>
          </div>
        </div>
        <span class="flex flex-col gap-1 p-4">
          <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Block · Workspace
          </span>
          <span class="text-base font-semibold text-foreground">工作台</span>
          <span class="text-sm leading-6 text-muted-foreground">
            Project overview, one of the workspace screens.
          </span>
        </span>
      </AppLink>
    </div>
  </section>
</template>

<style scoped>
.preview-stage {
  width: calc(100% / 0.45);
  transform: scale(0.45);
}
</style>
