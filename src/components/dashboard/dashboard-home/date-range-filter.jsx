"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "All", days: null },
];

export function DateRangeFilter({ startDate, endDate, onRangeChange }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);

  const activePreset = useMemo(
    () => PRESETS.find(
      (p) =>
        p.days === null
          ? !startDate && !endDate
          : startDate &&
            endDate &&
            Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) === p.days
    ),
    [startDate, endDate]
  );

  const handlePreset = useCallback(
    (days) => {
      if (days === null) {
        onRangeChange(null, null);
      } else {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onRangeChange(start, end);
      }
      setCustomOpen(false);
    },
    [onRangeChange]
  );

  const handleCustomApply = useCallback(() => {
    if (customStart && customEnd) {
      onRangeChange(customStart, customEnd);
      setCustomOpen(false);
    }
  }, [customStart, customEnd, onRangeChange]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Period:</span>
      {PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant={activePreset?.label === preset.label ? "default" : "outline"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => handlePreset(preset.days)}
        >
          {preset.label}
        </Button>
      ))}
      <Popover open={customOpen} onOpenChange={setCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={!activePreset ? "default" : "outline"}
            size="sm"
            className="h-7 px-2.5 text-xs gap-1"
          >
            <CalendarIcon className="h-3 w-3" />
            {startDate && endDate && !activePreset
              ? `${format(startDate, "dd/MM")} - ${format(endDate, "dd/MM")}`
              : "Custom"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={{ from: customStart || startDate, to: customEnd || endDate }}
            onSelect={(range) => {
              setCustomStart(range?.from || null);
              setCustomEnd(range?.to || null);
            }}
            numberOfMonths={2}
          />
          <div className="flex justify-end p-3 pt-0">
            <Button size="sm" onClick={handleCustomApply} disabled={!customStart || !customEnd}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
