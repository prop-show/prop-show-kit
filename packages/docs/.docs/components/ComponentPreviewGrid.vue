<script setup lang="ts">
 /**
 * Grid for component-preview-card.
 *
 * undocs' `::card-group` picks its columns at a VIEWPORT breakpoint (`sm:`), which
 * is wrong here: the same cards also render inside the search palette's narrow
 * preview pane, where the viewport is wide but the pane is ~560px. Container
 * queries make the layout follow the space the cards actually get.
 *
 * Two columns from 36rem of card space (cards then stack image-over-text at
 * ~17rem each), three from 64rem (wide enough for the image-beside-text card).
 * The ~560px search pane stays single-column.
 */
</script>

<template>
  <div class="@container not-prose my-6">
    <div class="grid grid-cols-1 gap-4 @[36rem]:grid-cols-2 @[64rem]:grid-cols-3">
      <slot />
    </div>
  </div>
</template>
