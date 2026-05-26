"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Loader2 } from "lucide-react";

export function SendActions({ recipients, message, onSendWhatsApp, onSendSMS, sendingStatus }) {
  const canSend = recipients.length > 0 && message.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Send Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Recipients</span>
            <span className="font-medium">{recipients.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Message length</span>
            <span className="font-medium">{message.length} chars</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={onSendWhatsApp} disabled={!canSend}>
            <MessageSquare size={16} className="mr-2" />
            Send via WhatsApp
          </Button>
          <Button size="lg" variant="outline" onClick={onSendSMS} disabled={!canSend}>
            <Phone size={16} className="mr-2" />
            Send via SMS
          </Button>
        </div>

        {sendingStatus && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            {sendingStatus}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
