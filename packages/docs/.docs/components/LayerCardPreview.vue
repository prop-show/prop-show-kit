<script setup lang="ts">
import { ArrowRightIcon } from "@lucide/vue";
import { LayerCard, LayerCardPrimary, LayerCardSecondary } from "../../../ui/registry/layer-card";
import { Button } from "@/components/ui/button";
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full min-w-0 max-w-2xl gap-6 sm:grid-cols-2">
      <LayerCard>
        <LayerCardSecondary class="justify-between">
          <span>Next steps</span>
          <Button as-child variant="ghost" size="icon-sm">
            <a href="/guide/introduction" aria-label="Read the introduction">
              <ArrowRightIcon aria-hidden="true" />
            </a>
          </Button>
        </LayerCardSecondary>
        <LayerCardPrimary class="flex-1">
          <span class="font-medium">Get started with PropShow Kit</span>
          <p class="text-sm text-muted-foreground">
            Composable Vue components that live in your codebase.
          </p>
        </LayerCardPrimary>
      </LayerCard>
      <LayerCard>
        <LayerCardPrimary class="flex-1">
          <span class="font-medium">Built for your theme</span>
          <p class="text-sm text-muted-foreground">
            Surfaces and borders adapt to light and dark mode.
          </p>
        </LayerCardPrimary>
        <LayerCardSecondary class="text-sm"
          >Secondary content can sit below, too.</LayerCardSecondary
        >
      </LayerCard>
      <LayerCard class="p-4 sm:col-span-2">
        <span class="font-medium">A simple surface</span>
        <p class="mt-2 text-sm text-muted-foreground">
          Render content directly when you only need one layer.
        </p>
      </LayerCard>
    </div>
  </PreviewFrame>
</template>
