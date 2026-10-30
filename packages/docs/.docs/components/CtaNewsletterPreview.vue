<script setup lang="ts">
import CtaNewsletter from "../../../ui/registry/cta/CtaNewsletter.vue";
import { shallowRef } from "vue";
const submitted = shallowRef(false);
</script>

<template>
  <ComponentPreview source="cta/CtaNewsletter.vue" registry="cta-newsletter" :height="500">
    <CtaNewsletter @subscribe="submitted = true">
      <template #status
        ><p v-if="submitted" role="status" class="text-center text-sm text-muted-foreground">
          Demo only — connect the subscribe event to your newsletter service.
        </p></template
      >
    </CtaNewsletter>
  </ComponentPreview>
</template>
