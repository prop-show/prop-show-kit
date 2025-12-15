<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const localePath = useLocalePath()
const appConfig = useAppConfig()

const features = computed(() => [
    {
        icon: 'radix-icons:component-1',
        title: t('home.features.rich_components.title'),
        description: t('home.features.rich_components.description'),
    },
    {
        icon: 'radix-icons:code',
        title: t('home.features.source_visible.title'),
        description: t('home.features.source_visible.description'),
    },
    {
        icon: 'radix-icons:layout',
        title: t('home.features.responsive.title'),
        description: t('home.features.responsive.description'),
    },
    {
        icon: 'radix-icons:accessibility',
        title: t('home.features.accessibility.title'),
        description: t('home.features.accessibility.description'),
    },
    {
        icon: 'radix-icons:moon',
        title: t('home.features.theme_toggle.title'),
        description: t('home.features.theme_toggle.description'),
    },
    {
        icon: 'radix-icons:rocket',
        title: t('home.features.typescript.title'),
        description: t('home.features.typescript.description'),
    },
])
</script>

<template>
    <main class="min-h-screen">
        <!-- Hero Section -->
        <section class="container mx-auto px-4 py-20 md:py-32">
            <div class="max-w-4xl mx-auto text-center space-y-8">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                    <Icon icon="radix-icons:lightning-bolt" class="w-4 h-4" />
                    <span>{{ $t('home.hero_badge') }}</span>
                </div>

                <h1 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                    {{ $t('home.hero_title') }}
                </h1>

                <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
                    {{ $t('home.hero_description') }}
                </p>

                <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <UiButton size="lg" as-child>
                        <NuxtLink :to="localePath('/docs/introduction')">
                            <Icon icon="radix-icons:rocket" class="mr-2 w-5 h-5" />
                            {{ $t('home.get_started') }}
                        </NuxtLink>
                    </UiButton>

                    <UiButton size="lg" variant="outline" as-child>
                        <NuxtLink :to="appConfig.socialMedia.github" target="_blank" rel="noopener">
                            <Icon icon="radix-icons:github-logo" class="mr-2 w-5 h-5" />
                            {{ $t('home.view_source') }}
                        </NuxtLink>
                    </UiButton>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="container mx-auto px-4 py-20 bg-muted/30">
            <div class="max-w-6xl mx-auto">
                <div class="text-center space-y-4 mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold">
                        {{ $t('home.why_title') }}
                    </h2>
                    <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {{ $t('home.why_description') }}
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <UiCard v-for="feature in features" :key="feature.title" class="p-6 hover:shadow-lg transition-shadow">
                        <div class="space-y-4">
                            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon :icon="feature.icon" class="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold mb-2">
                                    {{ feature.title }}
                                </h3>
                                <p class="text-muted-foreground">
                                    {{ feature.description }}
                                </p>
                            </div>
                        </div>
                    </UiCard>
                </div>
            </div>
        </section>

        <!-- Quick Start Section -->
        <section class="container mx-auto px-4 py-20">
            <div class="max-w-4xl mx-auto">
                <div class="text-center space-y-4 mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold">
                        {{ $t('home.quick_start.title') }}
                    </h2>
                    <p class="text-lg text-muted-foreground">
                        {{ $t('home.quick_start.description') }}
                    </p>
                </div>

                <div class="space-y-8">
                    <div class="flex gap-4">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg"
                        >
                            1
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="text-xl font-semibold">
                                {{ $t('home.quick_start.steps.1.title') }}
                            </h3>
                            <p class="text-muted-foreground">
                                {{ $t('home.quick_start.steps.1.description') }}
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg"
                        >
                            2
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="text-xl font-semibold">
                                {{ $t('home.quick_start.steps.2.title') }}
                            </h3>
                            <p class="text-muted-foreground">
                                {{ $t('home.quick_start.steps.2.description') }}
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg"
                        >
                            3
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="text-xl font-semibold">
                                {{ $t('home.quick_start.steps.3.title') }}
                            </h3>
                            <p class="text-muted-foreground">
                                {{ $t('home.quick_start.steps.3.description') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
