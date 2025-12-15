<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface PropDef {
    name: string
    type: string
    default?: string
    required?: boolean
    description?: string
}

interface Props {
    data?: PropDef[]
}

withDefaults(defineProps<Props>(), {
    data: () => [],
})
</script>

<template>
    <div class="my-6 border rounded-lg overflow-hidden  w-[calc(100vw-3rem)] md:w-full ">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-37.5">
                        Prop
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead class="w-25">
                        Default
                    </TableHead>
                    <TableHead class="w-25">
                        Required
                    </TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="prop in data" :key="prop.name">
                    <TableCell class="font-medium">
                        {{ prop.name }}
                    </TableCell>
                    <TableCell class="font-mono text-xs text-muted-foreground break-all">
                        {{ prop.type }}
                    </TableCell>
                    <TableCell class="font-mono text-xs">
                        {{ prop.default || '-' }}
                    </TableCell>
                    <TableCell>{{ prop.required ? 'Yes' : 'No' }}</TableCell>
                    <TableCell>{{ prop.description || '-' }}</TableCell>
                </TableRow>
                <TableRow v-if="!data || data.length === 0">
                    <TableCell colspan="5" class="text-center text-muted-foreground">
                        No props data provided.
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>
