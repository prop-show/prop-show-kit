<script lang="ts" setup>
import AppSidebar from '@/components/AppSidebar.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
    <main>
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div class="flex items-center gap-2 pr-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" class="mr-2 h-4" />
                    </div>
                    <div class="flex-1" />
                    <LanguageToggle />
                    <ModeToggle />
                </header>

                <div class="flex flex-1 flex-col gap-4 p-4 lg:p-8">
                    <slot />
                </div>

                <TheFooter class="bg-background" />
            </SidebarInset>
        </SidebarProvider>
    </main>
</template>
