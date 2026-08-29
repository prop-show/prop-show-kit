import type {
  Component,
  ComputedRef,
  HTMLAttributes,
  InjectionKey,
  MaybeRefOrGetter,
  Ref,
  VNodeChild,
} from "vue";

import { refDebounced } from "@vueuse/core";
import { cva } from "class-variance-authority";
import { computed, inject, shallowRef, toValue, watch } from "vue";

export interface FilterI18nConfig {
  addFilter: string;
  searchFields: string;
  noFieldsFound: string;
  noResultsFound: string;
  select: string;
  true: string;
  false: string;
  min: string;
  max: string;
  to: string;
  typeAndPressEnter: string;
  selected: string;
  selectedCount: string;
  percent: string;
  defaultCurrency: string;
  defaultColor: string;
  addFilterTitle: string;
  loadingOptions?: string;
  errorLoadingOptions?: string;
  operators: {
    is: string;
    isNot: string;
    isAnyOf: string;
    isNotAnyOf: string;
    includesAll: string;
    excludesAll: string;
    before: string;
    after: string;
    between: string;
    notBetween: string;
    contains: string;
    notContains: string;
    startsWith: string;
    endsWith: string;
    isExactly: string;
    equals: string;
    notEquals: string;
    greaterThan: string;
    lessThan: string;
    overlaps: string;
    includes: string;
    excludes: string;
    includesAllOf: string;
    includesAnyOf: string;
    empty: string;
    notEmpty: string;
  };
  placeholders: {
    enterField: (fieldType: string) => string;
    selectField: string;
    searchField: (fieldName: string) => string;
    enterKey: string;
    enterValue: string;
  };
  helpers: {
    formatOperator: (operator: string) => string;
  };
  validation: {
    invalidEmail: string;
    invalidUrl: string;
    invalidTel: string;
    invalid: string;
  };
}

export type FilterI18nOverrides = Partial<
  Omit<FilterI18nConfig, "operators" | "placeholders" | "helpers" | "validation">
> & {
  operators?: Partial<FilterI18nConfig["operators"]>;
  placeholders?: Partial<FilterI18nConfig["placeholders"]>;
  helpers?: Partial<FilterI18nConfig["helpers"]>;
  validation?: Partial<FilterI18nConfig["validation"]>;
};

export const DEFAULT_I18N: FilterI18nConfig = {
  addFilter: "Filter",
  searchFields: "Filter...",
  noFieldsFound: "No filters found.",
  noResultsFound: "No results found.",
  select: "Select...",
  true: "True",
  false: "False",
  min: "Min",
  max: "Max",
  to: "to",
  typeAndPressEnter: "Type and press Enter to add tag",
  selected: "selected",
  selectedCount: "selected",
  percent: "%",
  defaultCurrency: "$",
  defaultColor: "#000000",
  addFilterTitle: "Add filter",
  loadingOptions: "Loading...",
  errorLoadingOptions: "Failed to load options.",
  operators: {
    is: "is",
    isNot: "is not",
    isAnyOf: "is any of",
    isNotAnyOf: "is not any of",
    includesAll: "includes all",
    excludesAll: "excludes all",
    before: "before",
    after: "after",
    between: "between",
    notBetween: "not between",
    contains: "contains",
    notContains: "does not contain",
    startsWith: "starts with",
    endsWith: "ends with",
    isExactly: "is exactly",
    equals: "equals",
    notEquals: "not equals",
    greaterThan: "greater than",
    lessThan: "less than",
    overlaps: "overlaps",
    includes: "includes",
    excludes: "excludes",
    includesAllOf: "includes all of",
    includesAnyOf: "includes any of",
    empty: "is empty",
    notEmpty: "is not empty",
  },
  placeholders: {
    enterField: (fieldType) => `Enter ${fieldType}...`,
    selectField: "Select...",
    searchField: (fieldName) => `Search ${fieldName.toLowerCase()}...`,
    enterKey: "Enter key...",
    enterValue: "Enter value...",
  },
  helpers: {
    formatOperator: (operator) => operator.replace(/_/g, " "),
  },
  validation: {
    invalidEmail: "Invalid email format",
    invalidUrl: "Invalid URL format",
    invalidTel: "Invalid phone format",
    invalid: "Invalid input format",
  },
};

export interface FilterOption<T = unknown> {
  value: T;
  label: string;
  icon?: Component;
  metadata?: Record<string, unknown>;
  class?: HTMLAttributes["class"];
}

export interface FilterOperator {
  value: string;
  label: string;
  supportsMultiple?: boolean;
}

export interface CustomRendererProps<T = unknown> {
  field: FilterFieldConfig<T>;
  values: T[];
  operator: string;
  onChange: (values: T[]) => void;
}

export interface FilterOptionListRenderProps<T = unknown> {
  options: FilterOption<T>[];
  highlightedIndex: number;
  renderOption: (option: FilterOption<T>, index: number) => VNodeChild;
}

export interface FilterFieldGroup<T = unknown> {
  group?: string;
  fields: FilterFieldConfig<T>[];
}

export type FilterFieldsConfig<T = unknown> = FilterFieldConfig<T>[] | FilterFieldGroup<T>[];

export interface FilterFieldConfig<T = unknown> {
  key?: string;
  label?: string;
  icon?: Component;
  type?: "select" | "multiselect" | "text" | "custom" | "separator";
  group?: string;
  fields?: FilterFieldConfig<T>[];
  options?: FilterOption<T>[];
  loadOptions?: (query: string) => FilterOption<T>[] | Promise<FilterOption<T>[]>;
  renderOptionList?: (props: FilterOptionListRenderProps<T>) => VNodeChild;
  operators?: FilterOperator[];
  customRenderer?: Component;
  customValueRenderer?: Component;
  placeholder?: string;
  searchable?: boolean;
  maxSelections?: number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string | Component;
  suffix?: string | Component;
  pattern?: string;
  validation?: (value: unknown) => boolean | { valid: boolean; message?: string };
  allowCustomValues?: boolean;
  class?: HTMLAttributes["class"];
  menuPopupClass?: HTMLAttributes["class"];
  groupLabel?: string;
  onLabel?: string;
  offLabel?: string;
  onInputChange?: (event: Event) => void;
  defaultOperator?: string;
  value?: T[];
  onValueChange?: (values: T[]) => void;
}

export interface Filter<T = unknown> {
  id: string;
  field: string;
  operator: string;
  values: T[];
}

export interface FilterGroup<T = unknown> {
  id: string;
  label?: string;
  filters: Filter<T>[];
  fields: FilterFieldConfig<T>[];
}

export interface FiltersProps<T = unknown> {
  fields: FilterFieldsConfig<T>;
  class?: HTMLAttributes["class"];
  variant?: "solid" | "default";
  size?: "sm" | "default" | "lg";
  radius?: "default" | "full";
  i18n?: FilterI18nOverrides;
  showSearchInput?: boolean;
  allowMultiple?: boolean;
  menuPopupClass?: HTMLAttributes["class"];
  enableShortcut?: boolean;
  shortcutKey?: string;
  shortcutLabel?: string;
}

export interface FilterContextValue {
  variant: "solid" | "default";
  size: "sm" | "default" | "lg";
  radius: "default" | "full";
  i18n: FilterI18nConfig;
  class?: HTMLAttributes["class"];
  showSearchInput: boolean;
  allowMultiple: boolean;
}

export const filterContextKey: InjectionKey<ComputedRef<FilterContextValue>> =
  Symbol("filter-context");

const defaultFilterContext = computed<FilterContextValue>(() => ({
  variant: "default",
  size: "default",
  radius: "default",
  i18n: DEFAULT_I18N,
  showSearchInput: true,
  allowMultiple: true,
}));

export function useFilterContext() {
  return inject(filterContextKey, defaultFilterContext);
}

export const filtersContainerVariants = cva("flex flex-wrap items-center", {
  variants: {
    variant: {
      solid: "gap-2",
      default: "",
    },
    size: {
      sm: "gap-1.5",
      default: "gap-2.5",
      lg: "gap-3.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export function mergeFilterI18n(i18n?: FilterI18nOverrides): FilterI18nConfig {
  return {
    ...DEFAULT_I18N,
    ...i18n,
    operators: { ...DEFAULT_I18N.operators, ...i18n?.operators },
    placeholders: { ...DEFAULT_I18N.placeholders, ...i18n?.placeholders },
    helpers: { ...DEFAULT_I18N.helpers, ...i18n?.helpers },
    validation: { ...DEFAULT_I18N.validation, ...i18n?.validation },
  };
}

export function isFieldGroup<T>(
  item: FilterFieldConfig<T> | FilterFieldGroup<T>,
): item is FilterFieldGroup<T> {
  return "fields" in item && Array.isArray(item.fields);
}

export function flattenFields<T>(fields: FilterFieldsConfig<T>): FilterFieldConfig<T>[] {
  return fields.flatMap((item) => {
    if (isFieldGroup(item)) return item.fields;
    if (item.group && item.fields) return item.fields;
    return item;
  });
}

export function getFieldsMap<T>(
  fields: FilterFieldsConfig<T>,
): Record<string, FilterFieldConfig<T>> {
  return Object.fromEntries(
    flattenFields(fields)
      .filter((field) => field.key)
      .map((field) => [field.key as string, field]),
  );
}

export function fieldHasOptions<T>(field: FilterFieldConfig<T>): boolean {
  return (field.options?.length ?? 0) > 0 || typeof field.loadOptions === "function";
}

export function createOperatorsFromI18n(i18n: FilterI18nConfig): Record<string, FilterOperator[]> {
  return {
    select: [
      { value: "is", label: i18n.operators.is },
      { value: "is_not", label: i18n.operators.isNot },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
    multiselect: [
      { value: "is_any_of", label: i18n.operators.isAnyOf },
      { value: "is_not_any_of", label: i18n.operators.isNotAnyOf },
      { value: "includes_all", label: i18n.operators.includesAll },
      { value: "excludes_all", label: i18n.operators.excludesAll },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
    text: [
      { value: "contains", label: i18n.operators.contains },
      { value: "not_contains", label: i18n.operators.notContains },
      { value: "starts_with", label: i18n.operators.startsWith },
      { value: "ends_with", label: i18n.operators.endsWith },
      { value: "is", label: i18n.operators.isExactly },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
    custom: [
      { value: "is", label: i18n.operators.is },
      { value: "after", label: i18n.operators.after },
      { value: "between", label: i18n.operators.between },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
  };
}

export const DEFAULT_OPERATORS = createOperatorsFromI18n(DEFAULT_I18N);

export function getOperatorsForField<T>(
  field: FilterFieldConfig<T>,
  values: T[],
  i18n: FilterI18nConfig,
): FilterOperator[] {
  if (field.operators) return field.operators;

  const operators = createOperatorsFromI18n(i18n);
  const fieldType =
    field.type === "multiselect" || (field.type === "select" && values.length > 1)
      ? "multiselect"
      : (field.type ?? "select");

  return operators[fieldType] ?? operators.select!;
}

const fieldOptionCaches = new WeakMap<object, Map<unknown, FilterOption<unknown>>>();

function getFieldOptionCache<T>(field: FilterFieldConfig<T>): Map<T, FilterOption<T>> {
  let cache = fieldOptionCaches.get(field);
  if (!cache) {
    cache = new Map();
    fieldOptionCaches.set(field, cache);
  }
  return cache as Map<T, FilterOption<T>>;
}

function cacheOptions<T>(field: FilterFieldConfig<T>, options: FilterOption<T>[]) {
  const cache = getFieldOptionCache(field);
  for (const option of options) cache.set(option.value, option);
}

export function resolveSelectedOptions<T>(
  field: FilterFieldConfig<T>,
  values: T[],
): FilterOption<T>[] {
  cacheOptions(field, field.options ?? []);
  const cache = getFieldOptionCache(field);
  return values.map((value) => cache.get(value) ?? { value, label: String(value) });
}

export function matchesFilterOption<T>(option: FilterOption<T>, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return !normalizedQuery || option.label.toLocaleLowerCase().includes(normalizedQuery);
}

export function toggleFilterValue<T>(values: T[], value: T, multiple: boolean): T[] {
  if (values.includes(value)) return values.filter((currentValue) => currentValue !== value);
  return multiple ? [...values, value] : [value];
}

export interface ResolvedFieldOptions<T> {
  isAsync: ComputedRef<boolean>;
  options: ComputedRef<FilterOption<T>[]>;
  loading: Ref<boolean>;
  error: Ref<boolean>;
  resolveSelected: (values: T[]) => FilterOption<T>[];
}

export function useFieldOptions<T>(
  field: MaybeRefOrGetter<FilterFieldConfig<T>>,
  searchInput: Ref<string>,
  enabled: MaybeRefOrGetter<boolean>,
): ResolvedFieldOptions<T> {
  const currentField = computed(() => toValue(field));
  const isAsync = computed(() => typeof currentField.value.loadOptions === "function");
  const asyncOptions = shallowRef<FilterOption<T>[]>(currentField.value.options ?? []);
  const loading = shallowRef(false);
  const error = shallowRef(false);
  const debouncedQuery = refDebounced(searchInput, 250);
  let requestId = 0;

  watch(
    () => [currentField.value, currentField.value.options] as const,
    ([nextField, options]) => {
      cacheOptions(nextField, options ?? []);
      if (nextField.loadOptions) asyncOptions.value = options ?? [];
    },
    { immediate: true },
  );

  watch(
    [() => currentField.value.loadOptions, () => toValue(enabled), debouncedQuery],
    async ([loader, isEnabled, query], _previous, onCleanup) => {
      if (!loader || !isEnabled) {
        loading.value = false;
        return;
      }

      const activeRequest = ++requestId;
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });

      loading.value = true;
      error.value = false;
      try {
        const result = await loader(String(query));
        if (cancelled || activeRequest !== requestId) return;
        cacheOptions(currentField.value, result);
        asyncOptions.value = result;
      } catch {
        if (!cancelled && activeRequest === requestId) error.value = true;
      } finally {
        if (!cancelled && activeRequest === requestId) loading.value = false;
      }
    },
    { immediate: true },
  );

  return {
    isAsync,
    options: computed(() =>
      isAsync.value ? asyncOptions.value : (currentField.value.options ?? []),
    ),
    loading,
    error,
    resolveSelected: (values) => resolveSelectedOptions(currentField.value, values),
  };
}

export function createFilter<T>(field: string, operator = "is", values: T[] = []): Filter<T> {
  return {
    id: crypto.randomUUID(),
    field,
    operator,
    values,
  };
}

export function createFilterGroup<T>(
  id: string,
  label: string,
  fields: FilterFieldConfig<T>[],
  initialFilters: Filter<T>[] = [],
): FilterGroup<T> {
  return {
    id,
    label,
    filters: initialFilters,
    fields,
  };
}
