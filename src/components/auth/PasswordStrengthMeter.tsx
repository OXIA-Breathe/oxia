import { Check, X } from "lucide-react";
import {
  validatePassword,
  getPasswordStrength,
  getStrengthLabel,
  PASSWORD_RULES,
} from "@/lib/passwordValidation";

interface PasswordStrengthMeterProps {
  password: string;
  id?: string;
}


const strengthConfig = {
  weak: { color: "bg-destructive", width: "w-1/4", text: "text-destructive" },
  fair: { color: "bg-warning", width: "w-2/4", text: "text-warning" },
  good: { color: "bg-primary", width: "w-3/4", text: "text-primary" },
  strong: { color: "bg-success", width: "w-full", text: "text-success" },
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { requirements } = validatePassword(password);
  const strength = getPasswordStrength(password);
  const config = strengthConfig[strength];
  const requirementEntries = Object.entries(PASSWORD_RULES.labels) as [
    keyof typeof PASSWORD_RULES.labels,
    string
  ][];

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          {password.length > 0 && (
            <span className={`font-medium ${config.text}`}>
              {getStrengthLabel(strength)}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${config.color} ${config.width}`}
            aria-hidden="true"
          />
        </div>
      </div>

      <ul className="space-y-1.5">
        {requirementEntries.map(([key, label]) => {
          const met = requirements[key];
          return (
            <li
              key={key}
              className={`flex items-center gap-2 text-xs transition-colors ${
                met ? "text-success" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 ${
                  met ? "bg-success/10" : "bg-muted"
                }`}
                aria-hidden="true"
              >
                {met ? (
                  <Check className="w-2.5 h-2.5 text-success" strokeWidth={3} />
                ) : (
                  <X className="w-2.5 h-2.5 text-muted-foreground" strokeWidth={3} />
                )}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
