<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const { locales, setLocale } = useI18n()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
                <Icon icon="radix-icons:globe" class="h-[1.2rem] w-[1.2rem]" />
                <span class="sr-only">Toggle language</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem v-for="l in locales" :key="l.code" @click="setLocale(l.code)">
                {{ l.name }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
