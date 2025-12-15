<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()
const appConfig = useAppConfig()

const links = computed(() => [
    {
        title: t('footer.resources.title'),
        items: [
            { name: t('footer.resources.components'), href: localePath('/docs/components/status-badge') },
            { name: t('footer.resources.documentation'), href: localePath('/docs') },
        ],
    },
    {
        title: t('footer.community.title'),
        items: [
            { name: t('footer.community.github'), href: appConfig.socialMedia.github },
            // { name: t('footer.community.discord'), href: '#' },
            // { name: t('footer.community.twitter'), href: '#' },
        ],
    },
    // {
    //     title: t('footer.about.title'),
    //     items: [
    //         { name: t('footer.about.blog'), href: '#' },
    //         { name: t('footer.about.changelog'), href: '#' },
    //         { name: t('footer.about.contribution'), href: '#' },
    //     ],
    // },
])
</script>

<template>
    <footer class="border-t bg-muted/30">
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <!-- Brand -->
                <div class="col-span-2 md:col-span-1">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Icon icon="radix-icons:component-2" class="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span class="text-lg font-bold">PropShow Kit</span>
                    </div>
                    <p class="text-sm text-muted-foreground whitespace-pre-line">
                        {{ $t('footer.description') }}
                    </p>
                </div>

                <!-- Links -->
                <div v-for="group in links" :key="group.title">
                    <h3 class="font-semibold mb-3">
                        {{ group.title }}
                    </h3>
                    <ul class="space-y-2">
                        <li v-for="item in group.items" :key="item.name">
                            <NuxtLink
                                :to="item.href.startsWith('http') ? undefined : item.href"
                                :href="item.href.startsWith('http') ? item.href : undefined"
                                :target="item.href.startsWith('http') ? '_blank' : undefined"
                                :rel="item.href.startsWith('http') ? 'noopener' : undefined"
                                class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ item.name }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom -->
            <div class="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm text-muted-foreground">
                    © {{ currentYear }} PropShow Kit. {{ $t('footer.copyright') }}
                </p>
                <div class="flex items-center gap-4">
                    <NuxtLink
                        :to="appConfig.socialMedia.github"
                        target="_blank"
                        rel="noopener"
                        class="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Icon icon="radix-icons:github-logo" class="w-5 h-5" />
                    </NuxtLink>
                    <!-- <a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
                        <Icon icon="radix-icons:twitter-logo" class="w-5 h-5" />
                    </a> -->
                </div>
            </div>
        </div>
    </footer>
</template>
