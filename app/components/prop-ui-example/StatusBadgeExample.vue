<script setup lang="ts">
import { StatusBadge } from '@/components/prop-ui/status-badge'
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex gap-2">
            <StatusBadge color="green">
                Online
            </StatusBadge>
            <StatusBadge color="red">
                Offline
            </StatusBadge>
            <StatusBadge color="blue">
                Busy
            </StatusBadge>
            <StatusBadge color="orange">
                Away
            </StatusBadge>
        </div>
        <div class="flex gap-2">
            <StatusBadge color="green" rounded="xs">
                Online
            </StatusBadge>
            <StatusBadge color="red" rounded="xs">
                Offline
            </StatusBadge>
        </div>
    </div>
</template>
