"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

const OTHER_VALUE = "__other__";

function getValue(opt) {
  return typeof opt === "object" && opt !== null ? opt.value : opt;
}

function getLabel(opt) {
  const label = typeof opt === "object" && opt !== null ? (opt.label ?? opt.value) : opt;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function SelectWithOther({
  options = [],
  value = "",
  onChange,
  placeholder = "Select...",
  otherLabel = "Other",
  otherPlaceholder = "Enter custom value",
  disabled = false,
  className,
}) {
  const optionValues = useMemo(() => options.map(getValue), [options]);

  const isValueCustom = value && !optionValues.includes(value);

  const [isOther, setIsOther] = useState(isValueCustom);
  const [customText, setCustomText] = useState(isValueCustom ? value : "");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (value === "" || value === undefined || value === null) {
      setIsOther(false);
      setCustomText("");
    } else if (!optionValues.includes(value)) {
      setIsOther(true);
      setCustomText(value);
    } else {
      setIsOther(false);
      setCustomText("");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [value, optionValues]);

  const handleSelectChange = (selected) => {
    if (selected === OTHER_VALUE) {
      setIsOther(true);
    } else {
      setIsOther(false);
      setCustomText("");
      onChange(selected);
    }
  };

  const handleCustomInput = (e) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(text);
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <Select
        value={isOther ? OTHER_VALUE : (optionValues.includes(value) ? value : "")}
        onValueChange={handleSelectChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => {
            const val = getValue(opt);
            return (
              <SelectItem key={val} value={val}>
                {getLabel(opt)}
              </SelectItem>
            );
          })}
          <SelectItem value={OTHER_VALUE}>{otherLabel}</SelectItem>
        </SelectContent>
      </Select>
      {isOther && (
        <Input
          value={customText}
          onChange={handleCustomInput}
          placeholder={otherPlaceholder}
          autoFocus
        />
      )}
    </div>
  );
}
