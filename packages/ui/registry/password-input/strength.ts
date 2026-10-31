export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordCheck {
  id: "length" | "lowercase" | "uppercase" | "number" | "symbol";
  label: string;
  met: boolean;
}

export interface PasswordStrength {
  score: PasswordScore;
  label: string;
  checks: PasswordCheck[];
}

export interface PasswordStrengthLabels {
  weak: string;
  fair: string;
  good: string;
  strong: string;
}

export interface PasswordRequirementLabels {
  length: string;
  lowercase: string;
  uppercase: string;
  number: string;
  symbol: string;
}

export const defaultStrengthLabels: PasswordStrengthLabels = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

// A short local denylist. This is a hint in the form, not a breach database.
const commonPasswords = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwertyui",
  "qwerty123",
  "letmein1",
  "welcome1",
  "admin123",
  "iloveyou",
]);

export function requirementLabels(minLength: number): PasswordRequirementLabels {
  return {
    length: `At least ${minLength} characters`,
    lowercase: "A lowercase letter",
    uppercase: "An uppercase letter",
    number: "A number",
    symbol: "A symbol",
  };
}

const scoreLabels: Record<Exclude<PasswordScore, 0>, keyof PasswordStrengthLabels> = {
  1: "weak",
  2: "fair",
  3: "good",
  4: "strong",
};

export function assessPassword(
  value: string,
  options?: {
    minLength?: number;
    labels?: Partial<PasswordRequirementLabels>;
    strengthLabels?: Partial<PasswordStrengthLabels>;
  },
): PasswordStrength {
  const minLength = options?.minLength ?? 8;
  const labels = { ...requirementLabels(minLength), ...options?.labels };
  const strengthLabels = { ...defaultStrengthLabels, ...options?.strengthLabels };
  const checks: PasswordCheck[] = [
    { id: "length", label: labels.length, met: value.length >= minLength },
    { id: "lowercase", label: labels.lowercase, met: /[a-z]/.test(value) },
    { id: "uppercase", label: labels.uppercase, met: /[A-Z]/.test(value) },
    { id: "number", label: labels.number, met: /\d/.test(value) },
    { id: "symbol", label: labels.symbol, met: /[^A-Za-z0-9]/.test(value) },
  ];

  if (!value) return { score: 0, label: "", checks };

  const met = checks.filter((check) => check.met).length;
  let score: PasswordScore = met <= 1 ? 1 : met === 2 ? 2 : met <= 4 ? 3 : 4;
  if (value.length >= 12 && met >= 4) score = 4;
  if (value.length < minLength || commonPasswords.has(value.toLowerCase())) score = 1;

  return { score, label: strengthLabels[scoreLabels[score]], checks };
}
