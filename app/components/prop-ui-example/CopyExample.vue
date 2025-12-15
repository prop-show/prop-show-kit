<script setup lang="ts">
import { Copy } from '@/components/prop-ui/copy'
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
            <Copy content="Hello World" />
            <span class="text-sm text-muted-foreground">Default</span>
        </div>
        <div class="flex items-center gap-4">
            <Copy content="Small Copy" size="sm" />
            <span class="text-sm text-muted-foreground">Small</span>
        </div>
        <div class="flex items-center gap-4">
            <Copy content="Custom Variant" variant="secondary" />
            <span class="text-sm text-muted-foreground">Secondary Variant</span>
        </div>
    </div>
</template>
