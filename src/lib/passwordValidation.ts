export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

export const PASSWORD_RULES = {
  minLength: 10,
  labels: {
    minLength: "At least 10 characters",
    hasLowercase: "One lowercase letter",
    hasUppercase: "One uppercase letter",
    hasNumber: "One number",
    hasSymbol: "One symbol",
  },
} as const;

export function validatePassword(password: string): PasswordValidationResult {
  const requirements = {
    minLength: password.length >= PASSWORD_RULES.minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  const errors: string[] = [];
  if (!requirements.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters long`);
  }
  if (!requirements.hasLowercase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!requirements.hasUppercase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!requirements.hasNumber) {
    errors.push("Password must contain at least one number");
  }
  if (!requirements.hasSymbol) {
    errors.push("Password must contain at least one symbol");
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  const { requirements } = validatePassword(password);
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const length = password.length;

  if (!requirements.minLength || metRequirements < 4) return "weak";
  if (length >= 16 && metRequirements === 5) return "strong";
  if (length >= 12 && metRequirements === 5) return "good";
  return "fair";
}

export function getStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "Weak";
    case "fair":
      return "Fair";
    case "good":
      return "Good";
    case "strong":
      return "Strong";
  }
}
