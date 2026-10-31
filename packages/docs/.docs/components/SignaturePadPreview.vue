<script setup lang="ts">
import { shallowRef, watch } from "vue";
import { SignaturePad, type SignatureExport } from "../../../ui/registry/signature-pad";

const signature = shallowRef<string | null>(null);
const saved = shallowRef<SignatureExport | null>(null);

watch(signature, (value) => {
  if (!value) saved.value = null;
});

function onExport(result: SignatureExport) {
  saved.value = result;
}
</script>

<template>
  <PreviewFrame>
    <div class="grid w-full max-w-md gap-4">
      <SignaturePad v-model="signature" label="Agreement signature" @export="onExport" />
      <figure v-if="saved" class="grid gap-2">
        <img
          :src="saved.dataUrl"
          alt="Exported signature"
          class="h-24 w-full rounded-md border border-border bg-white object-contain"
        />
        <figcaption class="text-sm text-muted-foreground">
          Saved {{ saved.blob.size }} bytes · {{ saved.width }}×{{ saved.height }}
        </figcaption>
      </figure>
    </div>
  </PreviewFrame>
</template>
