import { Check } from "lucide-react";
import { STEPS } from "./message-constants";

export function StepIndicator({ currentStep, onNavigate }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-0 flex-1">
          <div
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
              i === currentStep
                ? "bg-primary text-primary-foreground"
                : i < currentStep
                  ? "bg-green-500/10 text-green-600"
                  : "bg-muted text-muted-foreground"
            }`}
            onClick={() => i < currentStep && onNavigate(i)}
          >
            {i < currentStep ? <Check size={14} /> : <s.icon size={14} />}
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="flex-1 h-px mx-2 bg-border" />}
        </div>
      ))}
    </div>
  );
}
