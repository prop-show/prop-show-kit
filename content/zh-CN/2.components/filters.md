---
title: Filters 筛选器
description: 使用文本、单选、多选、自定义和异步选项控件，构建类型安全且可组合的字段筛选器。
---

## 组件示例

::component-panel{component="FilterExample"}
::

## 使用 CLI 安装

::installation-tabs{componentName="filters"}
::

## 组件源码

::component-panel{component="Filter" :show-preview="false"}
::

## 使用方式

使用 `v-model` 作为当前筛选条件的唯一数据源，并通过 `fields` 传入字段配置。

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

每个激活的筛选条件都具有以下结构：

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
  description: 当前激活的筛选条件，通过 v-model 绑定
- name: fields
  type: "FilterFieldsConfig<T>"
  default: -
  required: true
  description: 筛选菜单中可用的扁平或分组字段定义
- name: variant
  type: "'solid' | 'default'"
  default: default
  required: false
  description: 筛选容器使用的间距变体
- name: size
  type: "'sm' | 'default' | 'lg'"
  default: default
  required: false
  description: 筛选按钮、输入框和移除控件的尺寸
- name: i18n
  type: FilterI18nOverrides
  default: -
  required: false
  description: 自定义部分标签、操作符名称、占位文本、辅助文本和校验信息
- name: showSearchInput
  type: boolean
  default: true
  required: false
  description: 是否在添加筛选条件的菜单中显示字段搜索框
- name: allowMultiple
  type: boolean
  default: true
  required: false
  description: 是否允许同一字段同时存在多个激活的筛选条件
- name: menuPopupClass
  type: HTMLAttributes['class']
  default: -
  required: false
  description: 添加筛选条件菜单内容的附加类名
- name: enableShortcut
  type: boolean
  default: false
  required: false
  description: 是否启用打开添加筛选条件菜单的全局键盘快捷键
- name: shortcutKey
  type: string
  default: f
  required: false
  description: 全局添加筛选条件快捷键使用的按键
- name: shortcutLabel
  type: string
  default: F
  required: false
  description: 显示在字段搜索框中的快捷键文本
- name: class
  type: HTMLAttributes['class']
  default: -
  required: false
  description: 筛选容器的附加类名

---

::

## 事件

| 事件                | 参数          | 说明                   |
| :------------------ | :------------ | :--------------------- |
| `update:modelValue` | `Filter<T>[]` | 筛选条件发生变化时触发 |

## 插槽

| 名称      | 插槽参数            | 说明                           |
| :-------- | :------------------ | :----------------------------- |
| `trigger` | `{ open: boolean }` | 替换默认的添加筛选条件触发按钮 |

```vue
<Filters v-model="filters" :fields="fields">
  <template #trigger="{ open }">
    <Button variant="outline">
      {{ open ? 'Close filters' : 'Add filter' }}
    </Button>
  </template>
</Filters>
```

## 字段配置

`FilterFieldConfig<T>` 描述添加筛选条件菜单中显示的一个字段。

| 属性                  | 类型                                                                  | 说明                                     |
| :-------------------- | :-------------------------------------------------------------------- | :--------------------------------------- |
| `key`                 | `string`                                                              | 唯一字段键，可选择字段必须提供           |
| `label`               | `string`                                                              | 显示在菜单和激活筛选标签中的名称         |
| `type`                | `'text' \| 'select' \| 'multiselect' \| 'custom' \| 'separator'`      | 值控件类型，默认为 `select`              |
| `icon`                | `Component`                                                           | 显示在字段名称旁的 Vue 组件              |
| `options`             | `FilterOption<T>[]`                                                   | 单选或多选字段的静态选项                 |
| `loadOptions`         | `(query: string) => FilterOption<T>[] \| Promise<FilterOption<T>[]>`  | 带防抖的异步选项加载函数                 |
| `operators`           | `FilterOperator[]`                                                    | 替换当前字段的默认操作符                 |
| `defaultOperator`     | `string`                                                              | 字段首次添加时使用的操作符               |
| `searchable`          | `boolean`                                                             | 是否允许搜索选项，默认为 `true`          |
| `maxSelections`       | `number`                                                              | 多选字段允许选择的最大值数量             |
| `placeholder`         | `string`                                                              | 文本字段的占位文本                       |
| `prefix` / `suffix`   | `string \| Component`                                                 | 渲染在文本输入组合内部的前缀或后缀内容   |
| `pattern`             | `string`                                                              | 文本输入失去焦点时用于校验的正则表达式   |
| `validation`          | `(value: unknown) => boolean \| { valid: boolean; message?: string }` | 自定义文本校验函数                       |
| `class`               | `HTMLAttributes['class']`                                             | 字段值控件的附加类名                     |
| `menuPopupClass`      | `HTMLAttributes['class']`                                             | 字段选项菜单的附加类名                   |
| `value`               | `T[]`                                                                 | 当前字段可选的受控值                     |
| `onValueChange`       | `(values: T[]) => void`                                               | 受控值更新回调                           |
| `customRenderer`      | `Component`                                                           | 替代内置值控件的自定义组件               |
| `customValueRenderer` | `Component`                                                           | 用于汇总展示已选选项的自定义组件         |
| `renderOptionList`    | `(props: FilterOptionListRenderProps<T>) => VNodeChild`               | 自定义选项列表渲染函数，例如用于虚拟列表 |
| `group` / `fields`    | `string / FilterFieldConfig<T>[]`                                     | 定义分组字段配置                         |

### 选项

```ts
interface FilterOption<T = unknown> {
  value: T
  label: string
  icon?: Component
  metadata?: Record<string, unknown>
  class?: HTMLAttributes['class']
}
```

请直接传入图标组件，不要传入字符串名称：

```ts
import { CircleCheckIcon } from '@lucide/vue'

const option = {
  value: 'active',
  label: 'Active',
  icon: CircleCheckIcon,
}
```

### 操作符

内置操作符集合取决于字段类型。

| 字段类型      | 默认操作符                                                                         |
| :------------ | :--------------------------------------------------------------------------------- |
| `select`      | `is`, `is_not`, `empty`, `not_empty`                                               |
| `multiselect` | `is_any_of`, `is_not_any_of`, `includes_all`, `excludes_all`, `empty`, `not_empty` |
| `text`        | `contains`, `not_contains`, `starts_with`, `ends_with`, `is`, `empty`, `not_empty` |
| `custom`      | `is`, `after`, `between`, `empty`, `not_empty`                                     |

可以为每个字段替换操作符：

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

## 异步选项

组件会使用经过防抖处理的搜索关键词调用 `loadOptions`。过期响应会被忽略，已选选项的名称会被缓存，因此即使后续结果页不再包含这些选项，它们仍能正常显示。

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

可以同时提供静态 `options` 和 `loadOptions`，为受控初始值预先提供显示名称。

## 自定义值控件

通过 `customRenderer` 传入 Vue 组件。该组件会接收 `field`、`values`、`operator` 和 `onChange` 回调，也可以触发 `update:values` 事件。

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

## 国际化

`i18n` 接受深层的部分配置，因此只需提供需要修改的文本。

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

完整的默认配置通过 `DEFAULT_I18N` 导出。

## 辅助函数

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

在 SSR 环境中，`createFilter` 会创建随机的唯一 ID，因此应在客户端交互或仅客户端状态初始化时调用。

## 键盘操作

- 当焦点不在输入框或文本域中时，按下配置的快捷键可打开字段菜单。
- 使用 <kbd>Arrow Up</kbd> 和 <kbd>Arrow Down</kbd> 在字段与选项之间移动。
- 使用 <kbd>Arrow Right</kbd> 打开单选字段的子菜单，按 <kbd>Arrow Left</kbd> 返回。
- 按 <kbd>Enter</kbd> 添加或切换高亮选项。
- 按 <kbd>Escape</kbd> 关闭当前菜单。

## `FiltersContent`

`FiltersContent` 只渲染当前激活的筛选标签，不包含添加筛选条件的菜单。嵌套使用时，它会读取最近的 `Filters` 上下文；独立使用时则回退到默认尺寸和文本。

```vue
<FiltersContent v-model="filters" :fields="fields" />
```

## 致谢

- 灵感来自 [ReUI Filters](https://reui.io/docs/components/base/filters)。
