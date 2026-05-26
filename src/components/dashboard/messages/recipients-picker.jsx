"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, X } from "lucide-react";

export function RecipientsPicker({
  recipients,
  onImportCustomers,
  onImportWorkers,
  onClearAll,
  manualName,
  manualPhone,
  onManualNameChange,
  onManualPhoneChange,
  onAddManual,
  onRemoveRecipient,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Select Recipients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onImportCustomers}>
            <Users size={14} className="mr-1.5" />
            Import Customers
          </Button>
          <Button variant="outline" size="sm" onClick={onImportWorkers}>
            <Users size={14} className="mr-1.5" />
            Import Workers
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearAll} disabled={recipients.length === 0}>
            <X size={14} className="mr-1.5" />
            Clear All
          </Button>
        </div>

        <Separator />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="manual-name" className="mb-1.5 block text-xs">
              Name
            </Label>
            <Input
              id="manual-name"
              value={manualName}
              onChange={(e) => onManualNameChange(e.target.value)}
              placeholder="Recipient name"
              className="h-9"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="manual-phone" className="mb-1.5 block text-xs">
              Phone
            </Label>
            <Input
              id="manual-phone"
              value={manualPhone}
              onChange={(e) => onManualPhoneChange(e.target.value)}
              placeholder="Phone number"
              className="h-9"
            />
          </div>
          <Button size="sm" onClick={onAddManual}>
            <UserPlus size={14} className="mr-1.5" />
            Add
          </Button>
        </div>

        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {recipients.map((r) => (
              <Badge key={r.phone} variant="secondary" className="gap-1.5 pr-1">
                {r.name}
                <button
                  onClick={() => onRemoveRecipient(r.phone)}
                  className="ml-0.5 hover:text-destructive transition-colors"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {recipients.length} recipient{recipients.length !== 1 ? "s" : ""} selected.
        </p>
      </CardContent>
    </Card>
  );
}
