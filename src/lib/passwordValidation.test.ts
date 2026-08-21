import { describe, it, expect } from "vitest";
import {
  validatePassword,
  getPasswordStrength,
  getStrengthLabel,
  summarizePasswordErrors,
  PASSWORD_RULES,
} from "./passwordValidation";

describe("validatePassword", () => {
  it("rejects an empty password with all requirements unmet", () => {
    const result = validatePassword("");
    expect(result.isValid).toBe(false);
    expect(Object.values(result.requirements).every((v) => v === false)).toBe(true);
    expect(result.errors).toHaveLength(5);
  });

  it("requires the minimum length", () => {
    const result = validatePassword("Ab1!efgh"); // 8 chars
    expect(result.requirements.minLength).toBe(false);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(String(PASSWORD_RULES.minLength));
  });

  it.each([
    ["missing uppercase", "abcdefgh1!", "hasUppercase"],
    ["missing lowercase", "ABCDEFGH1!", "hasLowercase"],
    ["missing number", "Abcdefghi!", "hasNumber"],
    ["missing symbol", "Abcdefghi1", "hasSymbol"],
  ] as const)("detects %s", (_label, password, key) => {
    const result = validatePassword(password);
    expect(result.requirements[key]).toBe(false);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it("accepts a password meeting every rule", () => {
    const result = validatePassword("Str0ngPass!");
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(Object.values(result.requirements).every(Boolean)).toBe(true);
  });

  it("treats spaces and unicode punctuation as symbols", () => {
    expect(validatePassword("Abcdefghi1 ").requirements.hasSymbol).toBe(true);
    expect(validatePassword("Abcdefghi1€").requirements.hasSymbol).toBe(true);
  });
});

describe("getPasswordStrength", () => {
  it("returns weak for short or sparse passwords", () => {
    expect(getPasswordStrength("")).toBe("weak");
    expect(getPasswordStrength("abc")).toBe("weak");
    expect(getPasswordStrength("abcdefghij")).toBe("weak");
  });

  it("returns fair when all rules are met at minimum length", () => {
    expect(getPasswordStrength("Str0ngPass!")).toBe("fair");
  });

  it("returns good at 12+ characters with all rules met", () => {
    expect(getPasswordStrength("Str0ngPass!12")).toBe("good");
  });

  it("returns strong at 16+ characters with all rules met", () => {
    expect(getPasswordStrength("Str0ngPassword!12")).toBe("strong");
  });
});

describe("getStrengthLabel", () => {
  it("maps every strength to a human label", () => {
    expect(getStrengthLabel("weak")).toBe("Weak");
    expect(getStrengthLabel("fair")).toBe("Fair");
    expect(getStrengthLabel("good")).toBe("Good");
    expect(getStrengthLabel("strong")).toBe("Strong");
  });
});

describe("summarizePasswordErrors", () => {
  it("returns null for a valid password", () => {
    expect(summarizePasswordErrors("Str0ngPass!")).toBeNull();
  });

  it("summarizes only the missing character types", () => {
    expect(summarizePasswordErrors("abcdefghij")).toBe(
      "Password is missing: an uppercase letter, a number, a symbol."
    );
  });

  it("leads with length when the password is too short", () => {
    expect(summarizePasswordErrors("Ab1!")).toBe("Use at least 10 characters.");
  });
});
