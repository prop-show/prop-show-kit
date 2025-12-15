<script setup lang="ts">
import { InlineTip } from '@/components/prop-ui/inline-tip'
</script>

<template>
    <div class="flex flex-col gap-4 w-full">
        <InlineTip label="Info">
            This is an info tip.
        </InlineTip>
        <InlineTip label="Warning" variant="warning">
            This is a warning tip.
        </InlineTip>
        <InlineTip label="Success" variant="success">
            This is a success tip.
        </InlineTip>
        <InlineTip label="Error" variant="error">
            This is an error tip.
        </InlineTip>
    </div>
</template>
