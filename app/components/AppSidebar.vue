<script setup lang="ts">
import { version } from '~~/package.json'

import type { SidebarProps } from '@/components/ui/sidebar'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar'

const props = defineProps<SidebarProps>()
const { t } = useI18n()
const localePath = useLocalePath()

const navMain = computed(() => [
    {
        title: t('nav.getting_started'),
        url: '#',
        items: [
            { title: t('nav.introduction'), url: localePath('/docs/introduction') },
            { title: t('nav.installation'), url: localePath('/docs/installation') },
            { title: t('nav.quick_start'), url: localePath('/docs/quick-start') },
        ],
    },

    {
        title: t('nav.components'),
        url: '#',
        items: [
            { title: 'Copy', url: localePath('/docs/components/copy') },
            { title: 'Inline Tip', url: localePath('/docs/components/inline-tip') },
            { title: 'Status Badge', url: localePath('/docs/components/status-badge') },
        ],
    },
])

type Menu = (typeof navMain.value)[number] | (typeof navMain.value)[number]['items'][number]

const route = useRoute()
function isActive(menu: Menu): boolean {
    const pathname = route.path
    return pathname === menu.url
}
</script>

<template>
    <Sidebar v-bind="props">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <NuxtLink :to="localePath('/')">
                            <Icon name="prop:logo" size="48" />
                            <div class="flex flex-col gap-0.5 leading-none">
                                <span class="font-medium">Documentation</span>
                                <span class="">v{{ version }}</span>
                            </div>
                        </NuxtLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem v-for="item in navMain" :key="item.title">
                        <SidebarMenuButton as-child>
                            <NuxtLink :to="item.url" class="font-medium">
                                {{ item.title }}
                            </NuxtLink>
                        </SidebarMenuButton>
                        <SidebarMenuSub v-if="item.items.length">
                            <SidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
                                <SidebarMenuSubButton as-child :is-active="isActive(childItem)">
                                    <NuxtLink :to="childItem.url">
                                        {{ childItem.title }}
                                    </NuxtLink>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
    </Sidebar>
</template>
