<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { EyeIcon, EyeOffIcon } from "@lucide/vue";
import { computed, shallowRef, useId } from "vue";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import type { PasswordRequirementLabels, PasswordStrengthLabels } from "./strength";

import { assessPassword } from "./strength";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
    label?: string;
    placeholder?: string;
    autocomplete?: string;
    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    minLength?: number;
    showToggle?: boolean;
    showStrength?: boolean;
    showRequirements?: boolean;
    showLabel?: string;
    hideLabel?: string;
    requirementLabels?: Partial<PasswordRequirementLabels>;
    strengthLabels?: Partial<PasswordStrengthLabels>;
    class?: HTMLAttributes["class"];
  }>(),
  {
    placeholder: "Enter a password",
    autocomplete: "new-password",
    minLength: 8,
    showToggle: true,
    showStrength: true,
    showRequirements: true,
    showLabel: "Show password",
    hideLabel: "Hide password",
  },
);

const model = defineModel<string>({ default: "" });
if (!model.value && props.defaultValue) model.value = props.defaultValue;

const revealed = shallowRef(false);
const generatedId = useId();
const inputId = computed(() => props.id ?? generatedId);
const meterId = useId();
const requirementsId = useId();

const result = computed(() =>
  assessPassword(model.value, {
    minLength: props.minLength,
    labels: props.requirementLabels,
    strengthLabels: props.strengthLabels,
  }),
);

const describedBy = computed(() =>
  [props.showStrength ? meterId : "", props.showRequirements ? requirementsId : ""]
    .filter(Boolean)
    .join(" "),
);

const strengthText = computed(() => {
  if (result.value.score <= 1) return "text-rose-600 dark:text-rose-400";
  if (result.value.score === 2) return "text-orange-600 dark:text-orange-400";
  if (result.value.score === 3) return "text-amber-700 dark:text-amber-400";
  return "text-green-700 dark:text-green-400";
});

function segmentClass(segment: number) {
  if (segment > result.value.score) return "bg-muted";
  if (result.value.score <= 1) return "bg-rose-500";
  if (result.value.score === 2) return "bg-orange-500";
  if (result.value.score === 3) return "bg-amber-500";
  return "bg-green-500";
}

function onUpdate(value: string | number) {
  model.value = String(value);
}
</script>

<template>
  <div data-slot="password-input" :class="cn('grid w-full gap-2', props.class)">
    <label v-if="props.label" :for="inputId" class="text-sm font-medium text-foreground">
      {{ props.label }}
    </label>

    <InputGroup>
      <InputGroupInput
        :id="inputId"
        v-bind="$attrs"
        :model-value="model"
        :type="revealed ? 'text' : 'password'"
        :name="props.name"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        :required="props.required"
        :disabled="props.disabled"
        :aria-invalid="props.invalid || undefined"
        :aria-describedby="describedBy || undefined"
        spellcheck="false"
        autocapitalize="off"
        autocorrect="off"
        @update:model-value="onUpdate"
      />
      <InputGroupAddon v-if="props.showToggle" align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          :aria-pressed="revealed"
          :aria-label="revealed ? props.hideLabel : props.showLabel"
          :disabled="props.disabled"
          @click="revealed = !revealed"
        >
          <EyeOffIcon v-if="revealed" />
          <EyeIcon v-else />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>

    <div v-if="props.showStrength" class="flex items-center gap-3">
      <div
        :id="meterId"
        role="meter"
        :aria-label="props.label ? `${props.label} strength` : 'Password strength'"
        aria-valuemin="0"
        aria-valuemax="4"
        :aria-valuenow="result.score"
        :aria-valuetext="result.label || 'Empty'"
        class="flex flex-1 gap-1"
      >
        <span
          v-for="segment in 4"
          :key="segment"
          aria-hidden="true"
          class="h-1 flex-1 rounded-full"
          :class="segmentClass(segment)"
        />
      </div>
      <span v-if="result.label" class="text-xs font-medium" :class="strengthText">
        {{ result.label }}
      </span>
    </div>

    <ul
      v-if="props.showRequirements"
      :id="requirementsId"
      aria-label="Password requirements"
      class="grid gap-1 text-xs"
    >
      <li
        v-for="check in result.checks"
        :key="check.id"
        class="flex items-center gap-2"
        :class="check.met ? 'text-foreground' : 'text-muted-foreground'"
      >
        <span class="sr-only">{{ check.met ? "Met" : "Not met" }}:</span>
        <span
          aria-hidden="true"
          class="size-1.5 shrink-0 rounded-full"
          :class="check.met ? 'bg-foreground' : 'bg-muted-foreground/40'"
        />
        {{ check.label }}
      </li>
    </ul>
  </div>
</template>
