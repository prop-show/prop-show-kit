<script setup lang="ts">
import { shallowRef } from "vue";
import { AvatarCrop } from "../../../ui/registry/avatar-crop";
import { Button } from "../ui/button";

const shape = shallowRef<"circle" | "square">("circle");
const cropped = shallowRef<string | null>(null);
const output = shallowRef("");

const sample = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#1e3a5f"/>
  <rect width="36" height="500" fill="#e11d48"/>
  <rect x="764" width="36" height="500" fill="#2563eb"/>
  <rect width="800" height="36" fill="#16a34a"/>
  <rect y="464" width="800" height="36" fill="#eab308"/>
  <circle cx="400" cy="230" r="118" fill="#f4c7a1"/>
  <circle cx="358" cy="210" r="14" fill="#1e293b"/>
  <circle cx="442" cy="210" r="14" fill="#1e293b"/>
  <path d="M352 268 Q400 318 448 268" fill="none" stroke="#1e293b" stroke-width="10" stroke-linecap="round"/>
</svg>`)}`;

function onCrop(result: { width: number; height: number }) {
  output.value = `${result.width}×${result.height}`;
}
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-3xl gap-8 sm:grid-cols-[20rem_minmax(0,1fr)] sm:items-start">
      <AvatarCrop
        v-model="cropped"
        :src="sample"
        :shape="shape"
        label="Profile photo"
        @crop="onCrop"
      />
      <div class="grid content-start gap-4">
        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            :variant="shape === 'circle' ? 'default' : 'outline'"
            @click="shape = 'circle'"
          >
            Circle
          </Button>
          <Button
            type="button"
            size="sm"
            :variant="shape === 'square' ? 'default' : 'outline'"
            @click="shape = 'square'"
          >
            Square
          </Button>
        </div>
        <div class="flex items-center gap-4">
          <div
            v-if="cropped"
            role="img"
            aria-label="Cropped profile preview"
            class="size-24 bg-cover bg-center ring-1 ring-border"
            :style="{
              backgroundImage: `url(${cropped})`,
              borderRadius: shape === 'circle' ? '9999px' : '0.5rem',
            }"
          />
          <div
            v-else
            class="grid size-24 place-items-center bg-muted text-xs text-muted-foreground ring-1 ring-border"
            :style="{ borderRadius: shape === 'circle' ? '9999px' : '0.5rem' }"
          >
            Preview
          </div>
          <p class="text-sm text-muted-foreground">
            {{
              cropped
                ? `Applied ${shape} crop${output ? `, ${output}` : ""}.`
                : "Drag the sample, then apply a crop."
            }}
          </p>
        </div>
        <p class="text-sm text-muted-foreground">
          The sample picture is drawn for this preview. Replace it with a file from your device, or
          drop one on the crop window.
        </p>
      </div>
    </div>
  </PreviewFrame>
</template>
