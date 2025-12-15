<script lang="ts" setup></script>

<template>
    <div
        class="min-h-screen flex flex-col bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10"
    >
        <TheHeader class="bg-background shadow-xs sticky top-0" />

        <main class="container shadow-xl mx-auto bg-background flex-1 p-4 my-4 rounded-2xl">
            <slot />
        </main>

        <TheFooter class="bg-background" />
    </div>
</template>
