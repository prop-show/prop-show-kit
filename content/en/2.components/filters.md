---
title: Filters
description: Build typed, composable field filters with text, select, multiselect, custom, and async option controls.
---

## Component Example

::component-panel{component="FilterExample"}
::

## Install using CLI

::installation-tabs{componentName="filters"}
::

## Component Source

::component-panel{component="Filter" :show-preview="false"}
::

## Usage

Use `v-model` as the source of truth for active filters and pass a field configuration through `fields`.

```vue
<script setup lang="ts">
import { CircleCheckIcon, MailIcon } from '@lucide/vue'
import { shallowRef } from 'vue'

import type { Filter, FilterFieldConfig } from '@/components/prop-ui/filters'

import { Filters } from '@/components/prop-ui/filters'

const filters = shallowRef<Filter<string>[]>([])

const fields: FilterFieldConfig<string>[] = [
  {
    key: 'status',
    label: 'Status',
    icon: CircleCheckIcon,
    type: 'multiselect',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    key: 'email',
    label: 'Email',
    icon: MailIcon,
    type: 'text',
    placeholder: 'name@example.com',
  },
]
</script>

<template>
  <Filters v-model="filters" :fields="fields" />
</template>
```

Each active filter has the following shape:

```ts
interface Filter<T = unknown> {
  id: string
  field: string
  operator: string
  values: T[]
}
```

## Props

::props-table
---

data:

- name: modelValue
  type: "Filter<T>[]"
  default: -
  required: true
  description: Active filters. Bind with v-model.
- name: fields
  type: "FilterFieldsConfig<T>"
  default: -
  required: true
  description: Flat or grouped field definitions available to the filter menu.
- name: variant
  type: "'solid' | 'default'"
  default: default
  required: false
  description: Spacing variant used by the filter container.
- name: size
  type: "'sm' | 'default' | 'lg'"
  default: default
  required: false
  description: Size of filter buttons, inputs, and remove controls.
- name: i18n
  type: FilterI18nOverrides
  default: -
  required: false
  description: Partial labels, operator names, placeholders, helpers, and validation messages.
- name: showSearchInput
  type: boolean
  default: true
  required: false
  description: Shows the field search input in the add-filter menu.
- name: allowMultiple
  type: boolean
  default: true
  required: false
  description: Allows more than one active filter for the same field.
- name: menuPopupClass
  type: HTMLAttributes['class']
  default: -
  required: false
  description: Additional classes for the add-filter menu content.
- name: enableShortcut
  type: boolean
  default: false
  required: false
  description: Enables the global keyboard shortcut that opens the add-filter menu.
- name: shortcutKey
  type: string
  default: f
  required: false
  description: Key used by the global add-filter shortcut.
- name: shortcutLabel
  type: string
  default: F
  required: false
  description: Shortcut text displayed in the field search input.
- name: class
  type: HTMLAttributes['class']
  default: -
  required: false
  description: Additional classes for the filter container.

---

::

## Emits

| Event               | Payload       | Description                           |
| :------------------ | :------------ | :------------------------------------ |
| `update:modelValue` | `Filter<T>[]` | Emitted whenever filters are changed. |

## Slots

| Name      | Slot props          | Description                                     |
| :-------- | :------------------ | :---------------------------------------------- |
| `trigger` | `{ open: boolean }` | Replaces the default add-filter trigger button. |

```vue
<Filters v-model="filters" :fields="fields">
    <template #trigger="{ open }">
        <Button variant="outline">
            {{ open ? 'Close filters' : 'Add filter' }}
        </Button>
    </template>
</Filters>
```

## Field Configuration

`FilterFieldConfig<T>` describes one field shown in the add-filter menu.

| Property              | Type                                                                  | Description                                                  |
| :-------------------- | :-------------------------------------------------------------------- | :----------------------------------------------------------- |
| `key`                 | `string`                                                              | Unique field key. Required for selectable fields.            |
| `label`               | `string`                                                              | Label shown in the menu and active filter chip.              |
| `type`                | `'text' \| 'select' \| 'multiselect' \| 'custom' \| 'separator'`      | Value control type. Defaults to `select`.                    |
| `icon`                | `Component`                                                           | Vue component shown beside the field label.                  |
| `options`             | `FilterOption<T>[]`                                                   | Static select or multiselect options.                        |
| `loadOptions`         | `(query: string) => FilterOption<T>[] \| Promise<FilterOption<T>[]>`  | Debounced async option loader.                               |
| `operators`           | `FilterOperator[]`                                                    | Replaces the default operators for this field.               |
| `defaultOperator`     | `string`                                                              | Operator used when the field is first added.                 |
| `searchable`          | `boolean`                                                             | Enables option search. Defaults to `true`.                   |
| `maxSelections`       | `number`                                                              | Maximum values accepted by a multiselect field.              |
| `placeholder`         | `string`                                                              | Text field placeholder.                                      |
| `prefix` / `suffix`   | `string \| Component`                                                 | Content rendered inside the text input group.                |
| `pattern`             | `string`                                                              | Regular expression used to validate text input on blur.      |
| `validation`          | `(value: unknown) => boolean \| { valid: boolean; message?: string }` | Custom text validation function.                             |
| `class`               | `HTMLAttributes['class']`                                             | Classes for the field value control.                         |
| `menuPopupClass`      | `HTMLAttributes['class']`                                             | Classes for the field option menu.                           |
| `value`               | `T[]`                                                                 | Optional controlled values for this field.                   |
| `onValueChange`       | `(values: T[]) => void`                                               | Controlled value update callback.                            |
| `customRenderer`      | `Component`                                                           | Custom component used instead of the built-in value control. |
| `customValueRenderer` | `Component`                                                           | Custom component used to summarize selected options.         |
| `renderOptionList`    | `(props: FilterOptionListRenderProps<T>) => VNodeChild`               | Custom option list renderer, for example a virtualized list. |
| `group` / `fields`    | `string / FilterFieldConfig<T>[]`                                     | Defines a grouped field configuration.                       |

### Options

```ts
interface FilterOption<T = unknown> {
  value: T
  label: string
  icon?: Component
  metadata?: Record<string, unknown>
  class?: HTMLAttributes['class']
}
```

Pass icon components directly rather than string names:

```ts
import { CircleCheckIcon } from '@lucide/vue'

const option = {
  value: 'active',
  label: 'Active',
  icon: CircleCheckIcon,
}
```

### Operators

The built-in operator set depends on the field type.

| Field type    | Default operators                                                                  |
| :------------ | :--------------------------------------------------------------------------------- |
| `select`      | `is`, `is_not`, `empty`, `not_empty`                                               |
| `multiselect` | `is_any_of`, `is_not_any_of`, `includes_all`, `excludes_all`, `empty`, `not_empty` |
| `text`        | `contains`, `not_contains`, `starts_with`, `ends_with`, `is`, `empty`, `not_empty` |
| `custom`      | `is`, `after`, `between`, `empty`, `not_empty`                                     |

Operators can be replaced per field:

```ts
const field: FilterFieldConfig<string> = {
  key: 'status',
  label: 'Status',
  type: 'select',
  operators: [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
  ],
}
```

## Async Options

`loadOptions` is called with a debounced search query. Stale responses are ignored, and selected option labels are cached so they remain readable when they are absent from a later result page.

```ts
const fields: FilterFieldConfig<string>[] = [
  {
    key: 'assignee',
    label: 'Assignee',
    type: 'multiselect',
    loadOptions: async (query) => {
      return await $fetch('/api/users', {
        query: { search: query },
      })
    },
  },
]
```

Static `options` can be supplied together with `loadOptions` to seed labels for initial controlled values.

## Custom Value Control

Pass a Vue component through `customRenderer`. It receives `field`, `values`, `operator`, and an `onChange` callback. It can also emit `update:values`.

```vue
<!-- AmountFilter.vue -->
<script setup lang="ts">
defineProps<{
  values: number[]
  onChange: (values: number[]) => void
}>()

const emit = defineEmits<{
  'update:values': [values: number[]]
}>()
</script>

<template>
  <Input
    type="number"
    :model-value="values[0]"
    @update:model-value="emit('update:values', [Number($event)])"
  />
</template>
```

```ts
import AmountFilter from './AmountFilter.vue'

const field: FilterFieldConfig<number> = {
  key: 'amount',
  label: 'Amount',
  type: 'custom',
  customRenderer: AmountFilter,
}
```

## Internationalization

`i18n` accepts a deep partial configuration, so only the strings that differ need to be supplied.

```vue
<Filters
    v-model="filters"
    :fields="fields"
    :i18n="{
        addFilter: '筛选',
        searchFields: '搜索字段...',
        operators: {
            is: '是',
            isNot: '不是',
        },
        validation: {
            invalid: '输入格式无效',
        },
    }"
/>
```

The complete default configuration is exported as `DEFAULT_I18N`.

## Helpers

```ts
import { createFilter, createFilterGroup } from '@/components/prop-ui/filters'

const filter = createFilter('status', 'is_any_of', ['active', 'pending'])

const group = createFilterGroup(
  'people',
  'People',
  fields,
  [filter],
)
```

`createFilter` should be called in client interactions or client-only state initialization when using SSR, because it creates a unique random ID.

## Keyboard Interaction

- Press the configured shortcut outside an input or textarea to open the field menu.
- Use <kbd>Arrow Up</kbd> and <kbd>Arrow Down</kbd> to move through fields and options.
- Use <kbd>Arrow Right</kbd> to open a select field submenu and <kbd>Arrow Left</kbd> to return.
- Press <kbd>Enter</kbd> to add or toggle the highlighted item.
- Press <kbd>Escape</kbd> to close the current menu.

## `FiltersContent`

`FiltersContent` renders active filter chips without the add-filter menu. It uses the nearest `Filters` context when nested, and otherwise falls back to the default size and labels.

```vue
<FiltersContent v-model="filters" :fields="fields" />
```

## Thanks

- Inspired by [ReUI Filters](https://reui.io/docs/components/base/filters).
