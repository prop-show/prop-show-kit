<script setup lang="ts">
import type { ComponentPublicInstance, HTMLAttributes } from "vue";

import { CheckIcon, ChevronsUpDownIcon } from "@lucide/vue";
import { computed, nextTick, ref, shallowRef, useId, useTemplateRef, watch } from "vue";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import type { CountryCode, PhoneValue } from "./phone";

import {
  applyPhoneInput,
  caretAfterDigits,
  changePhoneCountry,
  digitsBefore,
  flagEmoji,
  listPhoneCountries,
  matchesPhoneCountry,
  phoneFromE164,
} from "./phone";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
    defaultCountry?: CountryCode;
    label?: string;
    placeholder?: string;
    autocomplete?: string;
    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    validate?: boolean;
    locale?: string;
    countries?: CountryCode[];
    priorityCountries?: CountryCode[];
    searchPlaceholder?: string;
    emptyText?: string;
    countryLabel?: string;
    phoneLabel?: string;
    invalidMessage?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    defaultCountry: "US",
    placeholder: "",
    autocomplete: "tel",
    validate: true,
    priorityCountries: () => ["US", "GB", "CA", "AU"],
    searchPlaceholder: "Search countries",
    emptyText: "No countries found",
    countryLabel: "Country",
    phoneLabel: "Phone number",
    invalidMessage: "Enter a valid phone number.",
  },
);

const modelValue = defineModel<string>({ default: "" });
const starting = phoneFromE164(modelValue.value || props.defaultValue || "", props.defaultCountry);
if (!modelValue.value && props.defaultValue) modelValue.value = starting.e164;

const country = ref<CountryCode>(starting.country);
const national = ref(starting.national);
const valid = ref(starting.valid);
const open = shallowRef(false);
const query = shallowRef("");
const touched = shallowRef(false);
const highlighted = shallowRef(0);
const nationalInput = shallowRef<HTMLInputElement | null>(null);
const searchField = useTemplateRef<ComponentPublicInstance>("searchField");

const generatedId = useId();
const inputId = computed(() => props.id ?? generatedId);
const listId = useId();
const errorId = useId();

let syncing = false;

const catalog = computed(() => {
  const allowed = props.countries ? new Set(props.countries) : null;
  return listPhoneCountries(props.locale).filter((item) => !allowed || allowed.has(item.iso));
});

const visible = computed(() => {
  const priority = new Set(props.priorityCountries);
  const pinned = props.priorityCountries.flatMap((iso) => {
    const item = catalog.value.find((entry) => entry.iso === iso);
    return item && matchesPhoneCountry(item, query.value) ? [item] : [];
  });
  const rest = catalog.value.filter(
    (item) => !priority.has(item.iso) && matchesPhoneCountry(item, query.value),
  );
  return { pinned: pinned.length, items: [...pinned, ...rest] };
});

const selected = computed(
  () =>
    catalog.value.find((item) => item.iso === country.value) ?? {
      iso: country.value,
      callingCode: "",
      name: country.value,
    },
);

const showError = computed(
  () =>
    props.invalid ||
    (props.validate &&
      touched.value &&
      national.value.replace(/\D/g, "").length > 0 &&
      !valid.value),
);

function applyValue(next: PhoneValue) {
  syncing = true;
  country.value = next.country;
  national.value = next.national;
  valid.value = next.valid;
  modelValue.value = next.e164;
  nextTick(() => {
    syncing = false;
  });
}

function placeCaret(input: HTMLInputElement, digitCount: number) {
  const caret = caretAfterDigits(national.value, digitCount);
  input.value = national.value;
  input.setSelectionRange(caret, caret);
}

function onNationalInput(event: Event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  nationalInput.value = input;
  const digitCount = digitsBefore(input.value, input.selectionStart ?? input.value.length);
  applyValue(applyPhoneInput(input.value, country.value));
  placeCaret(input, digitCount);
  nextTick(() => placeCaret(input, digitCount));
}

function rememberNational(event: FocusEvent) {
  if (event.target instanceof HTMLInputElement) nationalInput.value = event.target;
}

function selectCountry(iso: CountryCode) {
  applyValue(changePhoneCountry(national.value, iso));
  open.value = false;
  nextTick(() => nationalInput.value?.focus());
}

function onSearchKeydown(event: KeyboardEvent) {
  const items = visible.value.items;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const last = items.length - 1;
    if (last >= 0) {
      highlighted.value =
        event.key === "ArrowDown"
          ? Math.min(last, highlighted.value + 1)
          : Math.max(0, highlighted.value - 1);
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    const item = items[highlighted.value];
    if (item) selectCountry(item.iso);
  } else if (event.key === "Escape") {
    open.value = false;
  }
  event.stopPropagation();
}

watch(modelValue, (value) => {
  if (syncing) return;
  const next = phoneFromE164(value, country.value);
  country.value = next.country;
  national.value = next.national;
  valid.value = next.valid;
});

watch(query, () => {
  highlighted.value = visible.value.items.length > 0 ? 0 : -1;
});

watch(open, (isOpen) => {
  if (!isOpen) {
    query.value = "";
    return;
  }
  highlighted.value = 0;
  nextTick(() => {
    const element = searchField.value?.$el;
    if (element instanceof HTMLInputElement) element.focus();
  });
});

watch(highlighted, (index) => {
  if (index < 0 || !open.value || typeof document === "undefined") return;
  document.getElementById(`${listId}-item-${index}`)?.scrollIntoView({ block: "nearest" });
});
</script>

<template>
  <div data-slot="phone-input" :class="cn('grid w-full gap-2', props.class)">
    <label v-if="props.label" :for="inputId" class="text-sm font-medium text-foreground">
      {{ props.label }}
    </label>

    <InputGroup>
      <InputGroupAddon align="inline-start">
        <DropdownMenu v-model:open="open">
          <DropdownMenuTrigger as-child>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              class="h-6 gap-1 px-1.5 font-normal"
              :aria-label="`${props.countryLabel}, ${selected.name}, +${selected.callingCode}`"
              :disabled="props.disabled"
            >
              <span aria-hidden="true" class="text-base leading-none">{{
                flagEmoji(selected.iso)
              }}</span>
              <span class="text-muted-foreground tabular-nums">+{{ selected.callingCode }}</span>
              <ChevronsUpDownIcon class="size-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" class="w-72 overflow-hidden p-0">
            <div class="border-b p-1">
              <Input
                ref="searchField"
                :model-value="query"
                role="combobox"
                autocomplete="off"
                :aria-expanded="open"
                :aria-controls="listId"
                :aria-activedescendant="
                  highlighted >= 0 ? `${listId}-item-${highlighted}` : undefined
                "
                :placeholder="props.searchPlaceholder"
                class="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
                @update:model-value="query = String($event)"
                @click.stop
                @keydown="onSearchKeydown"
              />
            </div>
            <div :id="listId" role="listbox" class="max-h-64 overflow-y-auto p-1">
              <p
                v-if="visible.items.length === 0"
                class="px-2 py-6 text-center text-sm text-muted-foreground"
              >
                {{ props.emptyText }}
              </p>
              <template v-for="(item, index) in visible.items" :key="item.iso">
                <DropdownMenuSeparator v-if="index === visible.pinned && visible.pinned > 0" />
                <DropdownMenuItem
                  :id="`${listId}-item-${index}`"
                  role="option"
                  :aria-selected="item.iso === country"
                  :data-highlighted="highlighted === index ? '' : undefined"
                  class="data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                  @mouseenter="highlighted = index"
                  @select="selectCountry(item.iso)"
                >
                  <span aria-hidden="true">{{ flagEmoji(item.iso) }}</span>
                  <span class="min-w-0 flex-1 truncate">{{ item.name }}</span>
                  <CheckIcon v-if="item.iso === country" class="size-4" />
                  <span class="text-muted-foreground tabular-nums">+{{ item.callingCode }}</span>
                </DropdownMenuItem>
              </template>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
      <InputGroupInput
        :id="inputId"
        v-bind="$attrs"
        :model-value="national"
        type="tel"
        inputmode="tel"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        :required="props.required"
        :disabled="props.disabled"
        :aria-label="props.label ? undefined : props.phoneLabel"
        :aria-invalid="showError || undefined"
        :aria-describedby="showError ? errorId : undefined"
        @focus="rememberNational"
        @input="onNationalInput"
        @blur="touched = true"
      />
    </InputGroup>
    <input v-if="props.name" type="hidden" :name="props.name" :value="modelValue" />

    <p v-if="showError" :id="errorId" class="text-xs text-destructive">
      {{ props.invalidMessage }}
    </p>
  </div>
</template>
