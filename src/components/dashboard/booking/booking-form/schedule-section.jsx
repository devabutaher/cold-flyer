"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription as CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, CalendarIcon, ChevronDownIcon, Clock2Icon } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";

function formatShortDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ScheduleSection({ control }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const scheduledDate = useWatch({ control, name: "scheduledDate" });
  const scheduledTime = useWatch({ control, name: "scheduledTime" });

  const formatDateTime = () => {
    if (!scheduledDate) return null;

    const date = new Date(scheduledDate);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let timeStr = "";
    if (scheduledTime?.start && scheduledTime?.end) {
      const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };
      timeStr = ` from ${formatTime(scheduledTime.start)} to ${formatTime(scheduledTime.end)}`;
    } else if (scheduledTime?.start) {
      const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };
      timeStr = ` at ${formatTime(scheduledTime.start)}`;
    }

    return `${dateStr}${timeStr}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Schedule</CardTitle>
            <CardDesc className="text-xs mt-0.5">Pick a date and time window</CardDesc>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="scheduledDate"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="px-1">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer" role="button" tabIndex={0}>
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                      <Input
                        id="date"
                        readOnly
                        value={field.value ? formatShortDate(new Date(field.value)) : ""}
                        placeholder="Pick a date"
                        className="pl-10 pr-10 cursor-pointer"
                      />
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : "");
                        setCalendarOpen(false);
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label className="px-1">Time Window</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Controller
                  name="scheduledTime.start"
                  control={control}
                  render={({ field: tf }) => (
                    <InputGroup>
                      <InputGroupInput type="time" value={tf.value ?? ""} onChange={tf.onChange} />
                      <InputGroupAddon>
                        <Clock2Icon className="h-3.5 w-3.5" />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller
                  name="scheduledTime.end"
                  control={control}
                  render={({ field: tf }) => (
                    <InputGroup>
                      <InputGroupInput type="time" value={tf.value ?? ""} onChange={tf.onChange} />
                      <InputGroupAddon>
                        <Clock2Icon className="h-3.5 w-3.5" />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {scheduledDate && (
          <div className="rounded-lg border bg-muted/30 p-3 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Selected Schedule</p>
            </div>
            <p className="text-sm font-medium">{formatDateTime()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
