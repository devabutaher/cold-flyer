"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TEMPLATES } from "./message-constants";

export function MessageEditor({ template, message, onTemplateChange, onMessageChange, recipients }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Write Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="template" className="mb-1.5 block">
            Template
          </Label>
          <Select value={template} onValueChange={onTemplateChange}>
            <SelectTrigger id="template" className="w-full">
              <SelectValue placeholder="Select a template..." />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.label} value={t.label}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message" className="mb-1.5 block">
            Message
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type your message here... Use {name} as placeholder."
            rows={6}
            className="resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {message.length} character{message.length !== 1 ? "s" : ""}. Use {"{name}"} for recipient name.
          </p>
        </div>

        {message && recipients.length > 0 && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Preview with first recipient:</p>
            <p className="text-sm">{message.replace(/{name}/g, recipients[0].name)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
