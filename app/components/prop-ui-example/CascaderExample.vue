<script setup lang="ts">
import type { CascaderOption, CascaderValue } from '@/components/prop-ui/cascader'

import { Cascader } from '@/components/prop-ui/cascader'

const options: CascaderOption[] = [
  {
    value: 'usa',
    label: 'USA',
    children: [
      {
        value: 'new_york',
        label: 'New York',
        children: [{ value: 'statue_of_liberty', label: 'Statue of Liberty' }],
      },
      {
        value: 'san_francisco',
        label: 'San Francisco',
        children: [{ value: 'golden_gate', label: 'Golden Gate Bridge' }],
      },
    ],
  },
  {
    value: 'france',
    label: 'France',
    disabled: true,
    children: [
      {
        value: 'paris',
        label: 'Paris',
        children: [{ value: 'eiffel_tower', label: 'Eiffel Tower' }],
      },
    ],
  },
]

const selectedValue = shallowRef<CascaderValue[]>(['usa', 'san_francisco', 'golden_gate'])
</script>

<template>
  <div class="flex flex-col gap-4">
    <Cascader v-model="selectedValue" :options="options" placeholder="Select Location" />

    <div>Selected Values:</div>
    <pre>{{ selectedValue }}</pre>
  </div>
</template>
