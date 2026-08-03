<script setup lang="ts" generic="T = unknown">
import type { ComponentPublicInstance } from 'vue'

import { AlertCircleIcon, CheckIcon, XIcon } from '@lucide/vue'
import { computed, nextTick, onScopeDispose, shallowRef, useTemplateRef, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type { Filter, FilterFieldConfig } from './filter-core'

import {
  getOperatorsForField,
  resolveSelectedOptions,
  useFilterContext,
} from './filter-core'
import FilterOptionsMenu from './FilterOptionsMenu.vue'

const props = withDefaults(defineProps<{
  filter: Filter<T>
  field: FilterFieldConfig<T>
  autoFocus?: boolean
}>(), {
  autoFocus: false,
})

const emit = defineEmits<{
  update: [updates: Partial<Filter<T>>]
  remove: []
}>()

const context = useFilterContext()
const optionsOpen = shallowRef(false)
const isValid = shallowRef(true)
const validationMessage = shallowRef('')
const inputGroupRef = useTemplateRef<ComponentPublicInstance>('inputGroup')
let focusTimer: ReturnType<typeof setTimeout> | undefined

const effectiveValues = computed(() => props.field.value ?? props.filter.values)
const operators = computed(() =>
  getOperatorsForField(props.field, effectiveValues.value, context.value.i18n),
)
const operatorLabel = computed(() =>
  operators.value.find(operator => operator.value === props.filter.operator)?.label
  ?? context.value.i18n.helpers.formatOperator(props.filter.operator),
)
const selectedOptions = computed(() =>
  resolveSelectedOptions(props.field, effectiveValues.value),
)
const valueRendererOptions = computed(() =>
  props.field.loadOptions ? selectedOptions.value : (props.field.options ?? []),
)

function updateValues(values: T[]) {
  if (props.field.onValueChange)
    props.field.onValueChange(values)
  else
    emit('update', { values })
}

function updateOperator(operator: string) {
  emit('update', {
    operator,
    ...(operator === 'empty' || operator === 'not_empty' ? { values: [] as T[] } : {}),
  })
}

function validate(value: string) {
  const pattern = props.field.pattern
  if (!value || (!pattern && !props.field.validation)) {
    isValid.value = true
    validationMessage.value = ''
    return
  }

  const result = props.field.validation
    ? props.field.validation(value)
    : new RegExp(pattern!).test(value)
  const valid = typeof result === 'boolean' ? result : result.valid

  isValid.value = valid
  validationMessage.value = valid
    ? ''
    : typeof result === 'boolean'
      ? context.value.i18n.validation.invalid
      : result.message || context.value.i18n.validation.invalid
}

function handleTextInput(value: string | number) {
  updateValues([String(value)] as T[])
}

function handleInputKeydown(event: KeyboardEvent) {
  if (
    !isValid.value
    && !['Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
  ) {
    isValid.value = true
    validationMessage.value = ''
  }
}

function focusInput() {
  clearTimeout(focusTimer)
  focusTimer = setTimeout(() => {
    const root = inputGroupRef.value?.$el as HTMLElement | undefined
    root?.querySelector('input')?.focus()
  }, 300)
}

watch(
  () => props.autoFocus,
  async (autoFocus) => {
    if (!autoFocus)
      return
    await nextTick()
    focusInput()
  },
  { immediate: true },
)

onScopeDispose(() => clearTimeout(focusTimer))
</script>

<template>
  <ButtonGroup>
    <ButtonGroupText class="bg-background dark:bg-input/30">
      <component :is="field.icon" v-if="field.icon" />
      {{ field.label }}
    </ButtonGroupText>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          :size="context.size"
          class="text-muted-foreground hover:text-foreground"
        >
          {{ operatorLabel }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-fit min-w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem
            v-for="operator in operators"
            :key="operator.value"
            class="data-highlighted:bg-accent data-highlighted:text-accent-foreground flex items-center justify-between"
            @select="updateOperator(operator.value)"
          >
            <span>{{ operator.label }}</span>
            <CheckIcon
              :class="cn(
                'text-primary ms-auto',
                operator.value === filter.operator ? 'opacity-100' : 'opacity-0',
              )"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <template v-if="filter.operator !== 'empty' && filter.operator !== 'not_empty'">
      <ButtonGroupText
        v-if="field.customRenderer"
        class="hover:bg-accent aria-expanded:bg-accent bg-background dark:bg-input/30 text-start whitespace-nowrap outline-hidden"
      >
        <component
          :is="field.customRenderer"
          :field="field"
          :values="effectiveValues"
          :operator="filter.operator"
          :on-change="updateValues"
          @update:values="updateValues"
        />
      </ButtonGroupText>

      <InputGroup
        v-else-if="field.type === 'text'"
        ref="inputGroup"
        :class="cn(
          'w-36',
          context.size === 'sm' && 'h-7!',
          context.size === 'lg' && 'h-9!',
          field.class,
        )"
      >
        <InputGroupAddon v-if="field.prefix">
          <InputGroupText>
            <component :is="field.prefix" v-if="typeof field.prefix !== 'string'" />
            <template v-else>
              {{ field.prefix }}
            </template>
          </InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          type="text"
          :model-value="String(effectiveValues[0] ?? '')"
          :placeholder="field.placeholder"
          :pattern="field.pattern"
          :aria-invalid="!isValid"
          :aria-describedby="!isValid && validationMessage ? `${field.key || 'input'}-error` : undefined"
          :class="cn(
            context.size === 'sm' && 'h-7! text-xs',
            context.size === 'lg' && 'h-9!',
          )"
          @update:model-value="handleTextInput"
          @input="field.onInputChange?.($event)"
          @blur="validate(($event.target as HTMLInputElement).value)"
          @keydown="handleInputKeydown"
        />

        <InputGroupAddon v-if="!isValid && validationMessage" align="inline-end">
          <Tooltip>
            <TooltipTrigger as-child>
              <InputGroupButton size="icon-xs" :aria-label="validationMessage">
                <AlertCircleIcon class="text-destructive" />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent :id="`${field.key || 'input'}-error`">
              <p class="text-sm">
                {{ validationMessage }}
              </p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>

        <InputGroupAddon v-if="field.suffix" align="inline-end">
          <InputGroupText>
            <component :is="field.suffix" v-if="typeof field.suffix !== 'string'" />
            <template v-else>
              {{ field.suffix }}
            </template>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <DropdownMenu
        v-else
        v-model:open="optionsOpen"
      >
        <DropdownMenuTrigger as-child>
          <Button variant="outline" :size="context.size">
            <component
              :is="field.customValueRenderer"
              v-if="field.customValueRenderer"
              :values="effectiveValues"
              :options="valueRendererOptions"
            />
            <template v-else>
              <span v-if="selectedOptions.length > 0" class="flex items-center gap-0">
                <template
                  v-for="option in selectedOptions.slice(0, 3)"
                  :key="String(option.value)"
                >
                  <component
                    :is="option.icon"
                    v-if="option.icon"
                    class="-ms-1.5 first:ms-0"
                  />
                </template>
              </span>
              {{
                selectedOptions.length === 1
                  ? selectedOptions[0]?.label
                  : selectedOptions.length > 1
                    ? `${selectedOptions.length} ${context.i18n.selectedCount}`
                    : context.i18n.select
              }}
            </template>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          :class="cn('w-[200px] px-0', field.menuPopupClass, field.class)"
        >
          <FilterOptionsMenu
            :field="field"
            :values="filter.values"
            :active="optionsOpen"
            @update:values="updateValues"
            @back="optionsOpen = false"
            @close="optionsOpen = false"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </template>

    <Button
      variant="outline"
      :size="context.size === 'sm' ? 'icon-sm' : context.size === 'lg' ? 'icon-lg' : 'icon'"
      :aria-label="`Remove ${field.label || 'filter'}`"
      @click="emit('remove')"
    >
      <XIcon />
    </Button>
  </ButtonGroup>
</template>
