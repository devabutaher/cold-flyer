"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription as CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CalendarDays, Clock2Icon } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";

export function ScheduleSection({ control }) {
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
        <Controller
          name="scheduledDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Calendar Section - Left Side 60% */}
                  <div className="rounded-lg border bg-card p-4 flex-1">
                    <div className="flex items-center gap-2 pb-2 border-b mb-4">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Date Window <span className="text-destructive">*</span>
                      </span>
                    </div>
                    <div className="w-full overflow-x-auto">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        style={{ width: "100%", minWidth: "280px" }}
                        className="rounded-lg border [--cell-size:--spacing(8)] md:[--cell-size:--spacing(6)]"
                      />
                    </div>
                  </div>

                  {/* Time Window Section */}
                  <div className="rounded-lg border bg-card p-4 space-y-4 flex-1">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Clock2Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Time Window</span>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
                      <Controller
                        name="scheduledTime.start"
                        control={control}
                        render={({ field: tf }) => (
                          <InputGroup>
                            <InputGroupInput id="time-from" type="time" value={tf.value ?? ""} onChange={tf.onChange} />
                            <InputGroupAddon>
                              <Clock2Icon className="h-3.5 w-3.5" />
                            </InputGroupAddon>
                          </InputGroup>
                        )}
                      />
                    </Field>

                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-border"></div>
                      <span className="text-xs text-muted-foreground">to</span>
                      <div className="h-px flex-1 bg-border"></div>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="time-to">End Time</FieldLabel>
                      <Controller
                        name="scheduledTime.end"
                        control={control}
                        render={({ field: tf }) => (
                          <InputGroup>
                            <InputGroupInput id="time-to" type="time" value={tf.value ?? ""} onChange={tf.onChange} />
                            <InputGroupAddon>
                              <Clock2Icon className="h-3.5 w-3.5" />
                            </InputGroupAddon>
                          </InputGroup>
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* Selected Date & Time Display - Bottom */}
                {scheduledDate && (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Selected Schedule</p>
                    </div>
                    <p className="text-sm font-medium">{formatDateTime()}</p>
                  </div>
                )}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
