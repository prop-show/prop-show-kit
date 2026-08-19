<script setup lang="ts" generic="T = unknown">
import type { ComponentPublicInstance, FunctionalComponent, VNodeChild } from 'vue'

import { computed, h, nextTick, shallowRef, useId, useTemplateRef, watch } from 'vue'

import { DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import type { FilterFieldConfig, FilterOption } from './filter-core'

import {
  DEFAULT_I18N,
  matchesFilterOption,
  toggleFilterValue,
  useFieldOptions,
  useFilterContext,
} from './filter-core'

const props = withDefaults(defineProps<{
  field: FilterFieldConfig<T>
  values: T[]
  active?: boolean
  multiple?: boolean
  controlled?: boolean
}>(), {
  active: true,
  multiple: undefined,
  controlled: true,
})

const emit = defineEmits<{
  'update:values': [values: T[]]
  'close': []
  'back': []
  'active': []
}>()

const RenderNode: FunctionalComponent<{ content?: VNodeChild }> = renderProps => renderProps.content
const context = useFilterContext()
const searchInput = shallowRef('')
const highlightedIndex = shallowRef(-1)
const inputRef = useTemplateRef<ComponentPublicInstance>('input')
const listboxRef = useTemplateRef<HTMLElement>('listbox')
const baseId = useId()

const effectiveValues = computed(() =>
  props.controlled && props.field.value !== undefined
    ? props.field.value
    : props.values,
)
const isMultiSelect = computed(() =>
  props.multiple ?? (props.field.type === 'multiselect' || effectiveValues.value.length > 1),
)

const {
  isAsync,
  options: resolvedOptions,
  loading,
  error,
  resolveSelected,
} = useFieldOptions(
  computed(() => props.field),
  searchInput,
  computed(() => props.active),
)

const selectedOptions = computed(() => {
  const selected = isAsync.value
    ? resolveSelected(effectiveValues.value)
    : (props.field.options ?? []).filter(option => effectiveValues.value.includes(option.value))

  if (!searchInput.value.trim())
    return selected
  if (!isAsync.value)
    return selected.filter(option => matchesFilterOption(option, searchInput.value))

  const resultValues = new Set(resolvedOptions.value.map(option => option.value))
  return selected.filter(option => resultValues.has(option.value))
})

const unselectedOptions = computed(() => {
  const options = isAsync.value ? resolvedOptions.value : (props.field.options ?? [])
  const query = searchInput.value.toLowerCase()

  return options.filter((option) => {
    if (effectiveValues.value.includes(option.value))
      return false
    return isAsync.value || matchesFilterOption(option, query)
  })
})

const allOptions = computed(() => [...selectedOptions.value, ...unselectedOptions.value])

function focusActiveControl() {
  nextTick(() => {
    if (props.field.searchable === false)
      listboxRef.value?.focus()
    else
      (inputRef.value?.$el as HTMLInputElement | undefined)?.focus()
  })
}

function commitValues(values: T[]) {
  if (props.controlled && props.field.onValueChange)
    props.field.onValueChange(values)
  else
    emit('update:values', values)
}

function toggleOption(option: FilterOption<T>) {
  const isSelected = effectiveValues.value.includes(option.value)
  const values = toggleFilterValue(effectiveValues.value, option.value, isMultiSelect.value)

  if (
    !isSelected
    && isMultiSelect.value
    && props.field.maxSelections
    && values.length > props.field.maxSelections
  ) {
    return
  }

  commitValues(values)
  if (!isMultiSelect.value)
    emit('close')
}

function preventMultiSelectClose(event: Event) {
  if (isMultiSelect.value)
    event.preventDefault()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (allOptions.value.length > 0) {
      highlightedIndex.value
        = highlightedIndex.value < allOptions.value.length - 1
          ? highlightedIndex.value + 1
          : 0
    }
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (allOptions.value.length > 0) {
      highlightedIndex.value
        = highlightedIndex.value > 0
          ? highlightedIndex.value - 1
          : allOptions.value.length - 1
    }
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('back')
  }
  else if (event.key === 'Enter' && highlightedIndex.value >= 0) {
    event.preventDefault()
    const option = allOptions.value[highlightedIndex.value]
    if (option)
      toggleOption(option)
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
  event.stopPropagation()
}

function renderOption(option: FilterOption<T>, index: number): VNodeChild {
  const selected = effectiveValues.value.includes(option.value)
  return h(
    DropdownMenuCheckboxItem,
    {
      'id': `${baseId}-item-${index}`,
      'key': String(option.value),
      'role': 'option',
      'modelValue': selected,
      'aria-selected': highlightedIndex.value === index,
      'data-highlighted': highlightedIndex.value === index ? '' : undefined,
      'class': cn(
        'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        option.class,
      ),
      'onMouseenter': () => highlightedIndex.value = index,
      'onSelect': preventMultiSelectClose,
      'onUpdate:modelValue': () => toggleOption(option),
    },
    {
      default: () => [
        option.icon ? h(option.icon) : null,
        h('span', { class: 'truncate' }, option.label),
      ],
    },
  )
}

const customOptionList = computed(() => props.field.renderOptionList?.({
  options: allOptions.value,
  highlightedIndex: highlightedIndex.value,
  renderOption,
}))

watch(
  () => props.active,
  (active) => {
    if (active)
      focusActiveControl()
  },
  { immediate: true },
)

watch(searchInput, () => {
  highlightedIndex.value = allOptions.value.length > 0 ? 0 : -1
})

watch(
  () => [props.active, allOptions.value.length] as const,
  ([active, length]) => {
    if (active && length > 0 && highlightedIndex.value < 0)
      highlightedIndex.value = 0
  },
  { immediate: true },
)

watch(highlightedIndex, (index) => {
  if (import.meta.client && index >= 0 && props.active)
    document.getElementById(`${baseId}-item-${index}`)?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <div class="flex flex-col" @mouseenter="emit('active')">
    <template v-if="field.searchable !== false">
      <Input
        ref="input"
        v-model="searchInput"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="true"
        aria-haspopup="listbox"
        :aria-controls="`${baseId}-listbox`"
        :aria-activedescendant="highlightedIndex >= 0 ? `${baseId}-item-${highlightedIndex}` : undefined"
        :placeholder="context.i18n.placeholders.searchField(field.label || '')"
        :class="cn(
          'h-8 rounded-none border-0 bg-transparent! px-2 text-sm shadow-none',
          'focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0',
          active && 'placeholder:text-foreground',
        )"
        @focus="emit('active')"
        @mouseenter.stop="emit('active')"
        @click.stop
        @blur="active && focusActiveControl()"
        @keydown="handleKeydown"
      />
      <DropdownMenuSeparator />
    </template>

    <div class="relative flex max-h-full">
      <div
        :id="`${baseId}-listbox`"
        ref="listbox"
        role="listbox"
        :tabindex="field.searchable === false ? 0 : -1"
        class="flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain outline-hidden"
        @keydown="handleKeydown"
      >
        <div
          v-if="isAsync && loading && allOptions.length === 0"
          class="text-muted-foreground py-2 text-center text-sm"
        >
          {{ context.i18n.loadingOptions ?? DEFAULT_I18N.loadingOptions }}
        </div>
        <div
          v-else-if="isAsync && error"
          class="text-muted-foreground py-2 text-center text-sm"
        >
          {{ context.i18n.errorLoadingOptions ?? DEFAULT_I18N.errorLoadingOptions }}
        </div>
        <div
          v-else-if="allOptions.length === 0"
          class="text-muted-foreground py-2 text-center text-sm"
        >
          {{ context.i18n.noResultsFound }}
        </div>
        <RenderNode v-else-if="customOptionList" :content="customOptionList" />
        <ScrollArea
          v-else
          class="size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain"
        >
          <DropdownMenuGroup v-if="selectedOptions.length > 0" class="px-1">
            <DropdownMenuCheckboxItem
              v-for="(option, index) in selectedOptions"
              :id="`${baseId}-item-${index}`"
              :key="String(option.value)"
              role="option"
              :model-value="true"
              :aria-selected="highlightedIndex === index"
              :data-highlighted="highlightedIndex === index ? '' : undefined"
              :class="cn(
                'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
                option.class,
              )"
              @mouseenter="highlightedIndex = index"
              @select="preventMultiSelectClose"
              @update:model-value="toggleOption(option)"
            >
              <component :is="option.icon" v-if="option.icon" />
              <span class="truncate">{{ option.label }}</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator
            v-if="selectedOptions.length > 0 && unselectedOptions.length > 0"
            class="mx-0"
          />

          <DropdownMenuGroup v-if="unselectedOptions.length > 0" class="px-1">
            <DropdownMenuCheckboxItem
              v-for="(option, index) in unselectedOptions"
              :id="`${baseId}-item-${index + selectedOptions.length}`"
              :key="String(option.value)"
              role="option"
              :model-value="false"
              :aria-selected="highlightedIndex === index + selectedOptions.length"
              :data-highlighted="highlightedIndex === index + selectedOptions.length ? '' : undefined"
              :class="cn(
                'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
                option.class,
              )"
              @mouseenter="highlightedIndex = index + selectedOptions.length"
              @select="preventMultiSelectClose"
              @update:model-value="toggleOption(option)"
            >
              <component :is="option.icon" v-if="option.icon" />
              <span class="truncate">{{ option.label }}</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>
