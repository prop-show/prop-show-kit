<script setup lang="ts">
import { Icon } from '@iconify/vue'

import LanguageToggle from '@/components/LanguageToggle.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const appConfig = useAppConfig()

const navigation = computed(() => [
    { name: t('common.documentation'), href: localePath('/docs') },
])
</script>

<template>
    <header
        class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <NuxtLink :to="localePath('/')" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Icon icon="radix-icons:component-2" class="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-lg font-bold leading-none">PropShow Kit</span>
                        <span class="text-xs text-muted-foreground">{{ $t('home.subtitle') }}</span>
                    </div>
                </NuxtLink>

                <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <NuxtLink
                        v-for="item in navigation"
                        :key="item.name"
                        :to="item.href"
                        class="transition-colors hover:text-foreground/80 text-foreground/60"
                        active-class="text-foreground"
                    >
                        {{ item.name }}
                    </NuxtLink>
                </nav>

                <div class="flex items-center space-x-2">
                    <LanguageToggle />
                    <ModeToggle />

                    <UiButton size="icon" variant="ghost" as-child class="hidden sm:inline-flex">
                        <NuxtLink :to="appConfig.socialMedia.github" target="_blank" rel="noopener" aria-label="GitHub">
                            <Icon icon="radix-icons:github-logo" class="w-5 h-5" />
                        </NuxtLink>
                    </UiButton>
                </div>
            </div>
        </div>
    </header>
</template>
