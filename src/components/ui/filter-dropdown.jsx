"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { motion } from "framer-motion";

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: i * 0.03, ease: "easeOut" },
  }),
};

function FilterDropdown({ options, value, onChange, placeholder }) {
  const t = useTranslations("common");
  const normalizedOptions = options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt));

  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-1.5 px-3 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder || t("filter") || "Filter"} />
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="relative z-50 max-h-60 min-w-36 overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md"
          position="popper"
          sideOffset={4}
        >
          <motion.div variants={dropdownVariants} initial="hidden" animate="visible">
            <SelectPrimitive.Viewport className="p-1">
              {normalizedOptions.map((option, i) => (
                <motion.div key={option.value} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                  <SelectPrimitive.Item
                    value={option.value}
                    className={cn(
                      "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-3 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
                    )}
                  >
                    <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                      <CheckIcon className="size-3" />
                    </SelectPrimitive.ItemIndicator>
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                </motion.div>
              ))}
            </SelectPrimitive.Viewport>
          </motion.div>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export default FilterDropdown;
export { FilterDropdown };
