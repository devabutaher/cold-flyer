"use client";

import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Pricing" },
  { id: 3, label: "Details" },
];

export function ServiceFormHeader({ completedSections = 0, title }) {
  const isEdit = title === "Edit Service";
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title || "Add New Service"}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isEdit ? "Update the details to modify this service." : "Fill in the details to add a new service."}
        </p>
      </div>

      <ol className="flex items-center gap-1 text-xs text-muted-foreground">
        {STEPS.map((step, i) => {
          const done = i < completedSections;
          const active = i === completedSections;
          return (
            <li key={step.id} className="flex items-center gap-1">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xxs font-medium transition-colors",
                  done && "bg-primary text-primary-foreground",
                  active && "border-2 border-primary text-primary",
                  !done && !active && "border border-border text-muted-foreground",
                )}
              >
                {done ? "✓" : step.id}
              </span>
              <span className={cn("hidden sm:inline", active && "text-foreground font-medium")}>{step.label}</span>
              {i < STEPS.length - 1 && <span className="mx-1 text-border">—</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
