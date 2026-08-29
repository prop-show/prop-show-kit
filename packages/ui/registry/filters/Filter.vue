<script setup lang="ts" generic="T = unknown">
import type { ComponentPublicInstance } from "vue";

import { PlusIcon } from "@lucide/vue";
import { useEventListener } from "@vueuse/core";
import { computed, nextTick, provide, shallowRef, useId, useTemplateRef, watch } from "vue";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { Filter, FilterFieldConfig, FiltersProps } from "./filter-core";

import {
  createFilter,
  fieldHasOptions,
  filterContextKey,
  filtersContainerVariants,
  flattenFields,
  getFieldsMap,
  mergeFilterI18n,
} from "./filter-core";
import FilterChip from "./FilterChip.vue";
import FilterOptionsMenu from "./FilterOptionsMenu.vue";

const props = withDefaults(defineProps<FiltersProps<T>>(), {
  variant: "default",
  size: "default",
  radius: "default",
  showSearchInput: true,
  allowMultiple: true,
  enableShortcut: false,
  shortcutKey: "f",
  shortcutLabel: "F",
});

defineSlots<{
  trigger: (props: { open: boolean }) => unknown;
}>();

const filters = defineModel<Filter<T>[]>({ required: true });
const addFilterOpen = shallowRef(false);
const menuSearchInput = shallowRef("");
const activeMenu = shallowRef("root");
const openSubMenu = shallowRef<string>();
const highlightedIndex = shallowRef(-1);
const lastAddedFilterId = shallowRef<string>();
const sessionFilterIds = shallowRef<Record<string, string>>({});
const rootInputRef = useTemplateRef<ComponentPublicInstance>("rootInput");
const rootId = useId();

const mergedI18n = computed(() => mergeFilterI18n(props.i18n));
const fieldsMap = computed(() => getFieldsMap(props.fields));
const selectableFields = computed(() =>
  flattenFields(props.fields).filter((field) => {
    if (!field.key || field.type === "separator") return false;
    return props.allowMultiple || !filters.value.some((filter) => filter.field === field.key);
  }),
);
const filteredFields = computed(() => {
  const query = menuSearchInput.value.toLowerCase();
  return selectableFields.value.filter(
    (field) => !query || field.label?.toLowerCase().includes(query),
  );
});
const contextValue = computed(() => ({
  variant: props.variant,
  size: props.size,
  radius: props.radius,
  i18n: mergedI18n.value,
  class: props.class,
  showSearchInput: props.showSearchInput,
  allowMultiple: props.allowMultiple,
}));

provide(filterContextKey, contextValue);

function focusRootInput() {
  nextTick(() => {
    (rootInputRef.value?.$el as HTMLInputElement | undefined)?.focus();
  });
}

function updateFilter(filterId: string, updates: Partial<Filter<T>>) {
  filters.value = filters.value.map((filter) => {
    if (filter.id !== filterId) return filter;
    const next = { ...filter, ...updates };
    if (updates.operator === "empty" || updates.operator === "not_empty") next.values = [] as T[];
    return next;
  });
}

function removeFilter(filterId: string) {
  filters.value = filters.value.filter((filter) => filter.id !== filterId);
}

function addFilter(fieldKey: string) {
  const field = fieldsMap.value[fieldKey];
  if (!field) return;

  const operator = field.defaultOperator ?? (field.type === "multiselect" ? "is_any_of" : "is");
  const values = (field.type === "text" ? [""] : []) as T[];
  const filter = createFilter(fieldKey, operator, values);

  filters.value = [...filters.value, filter];
  lastAddedFilterId.value = filter.id;
  addFilterOpen.value = false;
}

function getSessionFilter(fieldKey: string) {
  const filterId = sessionFilterIds.value[fieldKey];
  return filterId ? filters.value.find((filter) => filter.id === filterId) : undefined;
}

function getSessionValues(fieldKey: string): T[] {
  return getSessionFilter(fieldKey)?.values ?? [];
}

function updateSessionValues(field: FilterFieldConfig<T>, values: T[]) {
  const fieldKey = field.key;
  if (!fieldKey) return;

  const sessionFilter = getSessionFilter(fieldKey);
  if (field.type !== "multiselect") {
    const value = values[0];
    if (value === undefined) return;
    const filter = createFilter(fieldKey, field.defaultOperator ?? "is", [value]);
    filters.value = [...filters.value, filter];
    lastAddedFilterId.value = filter.id;
    addFilterOpen.value = false;
    return;
  }

  if (sessionFilter && values.length === 0) {
    filters.value = filters.value.filter((filter) => filter.id !== sessionFilter.id);
    const nextIds = { ...sessionFilterIds.value };
    delete nextIds[fieldKey];
    sessionFilterIds.value = nextIds;
  } else if (sessionFilter) {
    updateFilter(sessionFilter.id, { values });
  } else if (values.length > 0) {
    const filter = createFilter(fieldKey, field.defaultOperator ?? "is_any_of", values);
    filters.value = [...filters.value, filter];
    sessionFilterIds.value = {
      ...sessionFilterIds.value,
      [fieldKey]: filter.id,
    };
  }
}

function fieldHasSubmenu(field: FilterFieldConfig<T>) {
  return (field.type === "select" || field.type === "multiselect") && fieldHasOptions(field);
}

function openFieldSubmenu(field: FilterFieldConfig<T>) {
  if (!field.key) return;
  openSubMenu.value = field.key;
  activeMenu.value = field.key;
}

function closeFieldSubmenu() {
  openSubMenu.value = undefined;
  activeMenu.value = "root";
  focusRootInput();
}

function handleSubmenuOpenChange(field: FilterFieldConfig<T>, open: boolean) {
  if (open) openFieldSubmenu(field);
  else if (openSubMenu.value === field.key) closeFieldSubmenu();
}

function handleRootKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (filteredFields.value.length > 0) {
      highlightedIndex.value =
        highlightedIndex.value < filteredFields.value.length - 1 ? highlightedIndex.value + 1 : 0;
    }
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (filteredFields.value.length > 0) {
      highlightedIndex.value =
        highlightedIndex.value > 0 ? highlightedIndex.value - 1 : filteredFields.value.length - 1;
    }
  } else if (event.key === "ArrowRight" && highlightedIndex.value >= 0) {
    const field = filteredFields.value[highlightedIndex.value];
    if (field && fieldHasSubmenu(field)) {
      event.preventDefault();
      openFieldSubmenu(field);
    }
  } else if (event.key === "ArrowLeft" && openSubMenu.value) {
    event.preventDefault();
    closeFieldSubmenu();
  } else if (event.key === "Enter" && highlightedIndex.value >= 0) {
    event.preventDefault();
    const field = filteredFields.value[highlightedIndex.value];
    if (field?.key) {
      if (fieldHasSubmenu(field)) {
        if (openSubMenu.value === field.key) closeFieldSubmenu();
        else openFieldSubmenu(field);
      } else addFilter(field.key);
    }
  } else if (event.key === "Escape") {
    addFilterOpen.value = false;
  }
  event.stopPropagation();
}

useEventListener("keydown", (event: KeyboardEvent) => {
  if (
    props.enableShortcut &&
    event.key.toLowerCase() === props.shortcutKey.toLowerCase() &&
    !addFilterOpen.value &&
    !(document.activeElement instanceof HTMLInputElement) &&
    !(document.activeElement instanceof HTMLTextAreaElement)
  ) {
    event.preventDefault();
    addFilterOpen.value = true;
  }
});

watch(addFilterOpen, (open) => {
  if (open) {
    activeMenu.value = "root";
    focusRootInput();
    return;
  }
  menuSearchInput.value = "";
  openSubMenu.value = undefined;
  sessionFilterIds.value = {};
});

watch(menuSearchInput, () => {
  highlightedIndex.value = filteredFields.value.length > 0 ? 0 : -1;
});

watch(
  () => [addFilterOpen.value, filteredFields.value.length] as const,
  ([open, length]) => {
    if (open && length > 0) highlightedIndex.value = 0;
  },
);

watch(highlightedIndex, (index) => {
  if (import.meta.client && index >= 0 && addFilterOpen.value)
    document.getElementById(`${rootId}-item-${index}`)?.scrollIntoView({ block: "nearest" });
});

watch(lastAddedFilterId, (filterId, _previous, onCleanup) => {
  if (!filterId) return;
  const timer = setTimeout(() => (lastAddedFilterId.value = undefined), 1000);
  onCleanup(() => clearTimeout(timer));
});
</script>

<template>
  <div :class="cn(filtersContainerVariants({ variant, size }), props.class)">
    <DropdownMenu v-if="selectableFields.length > 0" v-model:open="addFilterOpen">
      <DropdownMenuTrigger as-child>
        <slot name="trigger" :open="addFilterOpen">
          <Button variant="outline">
            <PlusIcon />
            {{ mergedI18n.addFilter }}
          </Button>
        </slot>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" :class="cn('w-[220px]', menuPopupClass)">
        <template v-if="showSearchInput">
          <div class="relative">
            <Input
              ref="rootInput"
              v-model="menuSearchInput"
              role="combobox"
              :aria-controls="`${rootId}-listbox`"
              :aria-activedescendant="
                highlightedIndex >= 0 ? `${rootId}-item-${highlightedIndex}` : undefined
              "
              :placeholder="mergedI18n.searchFields"
              :class="
                cn(
                  'h-8 rounded-none border-0 bg-transparent! px-2 text-sm shadow-none',
                  'focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0',
                  activeMenu === 'root' && 'placeholder:text-foreground',
                )
              "
              @focus="activeMenu = 'root'"
              @mouseenter="activeMenu = 'root'"
              @blur="activeMenu === 'root' && focusRootInput()"
              @click.stop
              @keydown="handleRootKeydown"
            />
            <Kbd
              v-if="enableShortcut && shortcutLabel"
              class="bg-background absolute top-1/2 right-2 -translate-y-1/2 border"
            >
              {{ shortcutLabel }}
            </Kbd>
          </div>
          <DropdownMenuSeparator />
        </template>

        <div class="relative flex max-h-full">
          <div
            :id="`${rootId}-listbox`"
            role="listbox"
            class="flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain"
            @mouseenter="activeMenu = 'root'"
          >
            <ScrollArea class="**:data-[slot=scroll-area-scrollbar]:m-0">
              <div
                v-if="filteredFields.length === 0"
                class="text-muted-foreground py-2 text-center text-sm"
              >
                {{ mergedI18n.noFieldsFound }}
              </div>

              <DropdownMenuGroup v-else>
                <template v-for="(field, index) in filteredFields" :key="field.key">
                  <DropdownMenuSub
                    v-if="fieldHasSubmenu(field)"
                    :open="openSubMenu === field.key"
                    @update:open="handleSubmenuOpenChange(field, $event)"
                  >
                    <DropdownMenuSubTrigger
                      :id="`${rootId}-item-${index}`"
                      role="option"
                      :aria-selected="highlightedIndex === index"
                      :data-highlighted="highlightedIndex === index ? '' : undefined"
                      class="data-popup-open:bg-accent data-popup-open:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                      @mouseenter="
                        highlightedIndex = index;
                        activeMenu = 'root';
                      "
                    >
                      <component :is="field.icon" v-if="field.icon" />
                      <span>{{ field.label }}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent class="w-[200px]" side="right">
                      <FilterOptionsMenu
                        :field="field"
                        :values="getSessionValues(field.key!)"
                        :active="activeMenu === field.key"
                        :multiple="field.type === 'multiselect'"
                        :controlled="false"
                        @active="field.searchable !== false && (activeMenu = field.key!)"
                        @update:values="updateSessionValues(field, $event)"
                        @back="closeFieldSubmenu"
                        @close="addFilterOpen = false"
                      />
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem
                    v-else
                    :id="`${rootId}-item-${index}`"
                    role="option"
                    :aria-selected="highlightedIndex === index"
                    :data-highlighted="highlightedIndex === index ? '' : undefined"
                    class="data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                    @mouseenter="highlightedIndex = index"
                    @select="field.key && addFilter(field.key)"
                  >
                    <component :is="field.icon" v-if="field.icon" />
                    <span>{{ field.label }}</span>
                  </DropdownMenuItem>
                </template>
              </DropdownMenuGroup>
            </ScrollArea>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

    <template v-for="filter in filters" :key="filter.id">
      <FilterChip
        v-if="fieldsMap[filter.field]"
        :filter="filter"
        :field="fieldsMap[filter.field]!"
        :auto-focus="filter.id === lastAddedFilterId"
        @update="updateFilter(filter.id, $event)"
        @remove="removeFilter(filter.id)"
      />
    </template>
  </div>
</template>
