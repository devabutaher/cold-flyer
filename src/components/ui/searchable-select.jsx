"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = options.filter((o) =>
    (o.name || o.label || o).toLowerCase().includes(search.toLowerCase()),
  );

  const selected = options.find((o) => (o.id ?? o.value ?? o) === value);
  const display = selected?.name ?? selected?.label ?? selected ?? "";

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) setSearch("");
  }

  function handleTriggerClick() {
    setOpen(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          tabIndex={0}
          data-slot="select-trigger"
          data-size="default"
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-placeholder:text-muted-foreground data-[size=default]:h-9 dark:bg-input/30 dark:hover:bg-input/50",
            !value && "text-muted-foreground",
            className,
          )}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
        >
          <span className="truncate">{value ? display : placeholder}</span>
          <ChevronDown
            className={cn(
              "pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="relative w-[--radix-popover-trigger-width] rounded-md bg-popover p-0 text-popover-foreground shadow-md outline-none"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div ref={listRef} className="max-h-60 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No results</p>
          ) : (
            filtered.map((o) => {
              const id = o.id ?? o.value ?? o;
              const label = o.name ?? o.label ?? o;
              return (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 pr-8 text-sm outline-hidden select-none transition-colors hover:bg-accent hover:text-accent-foreground",
                    id === value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="truncate">{label}</span>
                  {id === value && (
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
