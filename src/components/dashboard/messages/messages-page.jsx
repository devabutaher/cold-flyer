"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { TEMPLATES } from "./message-constants";
import { StepIndicator } from "./step-indicator";
import { RecipientsPicker } from "./recipients-picker";
import { MessageEditor } from "./message-editor";
import { SendActions } from "./send-actions";
import { MessageLog } from "./message-log";

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [recipients, setRecipients] = useState([]);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [sendingStatus, setSendingStatus] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const res = await getClient().get("/messages");
      return res.data?.data?.messages || [];
    },
  });

  const importCustomers = useCallback(async () => {
    try {
      const res = await getClient().get("/customers");
      const customers = res.data?.data?.customers || [];
      const newRecipients = customers.filter((c) => c.phone).map((c) => ({ name: c.name, phone: c.phone }));
      setRecipients((prev) => {
        const existing = new Set(prev.map((r) => r.phone));
        const unique = newRecipients.filter((r) => !existing.has(r.phone));
        toast.success(`${unique.length} customers imported.`);
        return [...prev, ...unique];
      });
    } catch {
      toast.error("Failed to import customers.");
    }
  }, []);

  const importWorkers = useCallback(async () => {
    try {
      const res = await getClient().get("/admin/technicians");
      const technicians = res.data?.data?.technicians || [];
      const newRecipients = technicians
        .filter((t) => t.user?.phone)
        .map((t) => ({ name: t.user?.name || t.employeeId, phone: t.user.phone }));
      setRecipients((prev) => {
        const existing = new Set(prev.map((r) => r.phone));
        const unique = newRecipients.filter((r) => !existing.has(r.phone));
        toast.success(`${unique.length} workers imported.`);
        return [...prev, ...unique];
      });
    } catch {
      toast.error("Failed to import workers.");
    }
  }, []);

  const addManual = useCallback(() => {
    if (!manualName || !manualPhone) {
      toast.error("Please enter both name and phone.");
      return;
    }
    if (recipients.some((r) => r.phone === manualPhone)) {
      toast.error("This number is already added.");
      return;
    }
    setRecipients((prev) => [...prev, { name: manualName, phone: manualPhone }]);
    setManualName("");
    setManualPhone("");
    toast.success("Recipient added.");
  }, [manualName, manualPhone, recipients]);

  const removeRecipient = useCallback((phone) => {
    setRecipients((prev) => prev.filter((r) => r.phone !== phone));
  }, []);

  const clearAll = useCallback(() => {
    setRecipients([]);
    toast.info("Recipients cleared.");
  }, []);

  const handleTemplateChange = useCallback((val) => {
    setTemplate(val);
    const tpl = TEMPLATES.find((t) => t.label === val);
    if (tpl) setMessage(tpl.message);
  }, []);

  const logMessage = useCallback(
    async (channel) => {
      try {
        await getClient().post("/messages", {
          time: new Date().toISOString(),
          name: recipients.map((r) => r.name).join(", "),
          number: recipients.map((r) => r.phone).join(", "),
          channel,
          message,
        });
        queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      } catch {}
    },
    [recipients, message, queryClient],
  );

  // WhatsApp uses wa.me links (opens browser tab) + server-side audit logging.
  // This is intentional for MVP — no WhatsApp Business API client, no delivery tracking.
  // To upgrade: integrate Twilio/Meta Cloud API with a dedicated service layer.
  const sendViaChannel = useCallback(
    async (channel, protocol) => {
      if (recipients.length === 0 || !message) {
        toast.error(recipients.length === 0 ? "No recipients selected." : "No message to send.");
        return;
      }
      setSendingStatus(`Opening ${channel} for ${recipients.length} recipient(s)...`);
      for (let i = 0; i < recipients.length; i++) {
        const r = recipients[i];
        const personalized = message.replace(/{name}/g, r.name);
        const url =
          protocol === "whatsapp"
            ? `https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(personalized)}`
            : `sms:${r.phone.replace(/[^0-9]/g, "")}?body=${encodeURIComponent(personalized)}`;
        window.open(url, "_blank");
        setSendingStatus(`Opened ${channel} for ${r.name} (${i + 1}/${recipients.length})`);
        if (i < recipients.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, protocol === "whatsapp" ? 1500 : 1000));
        }
      }
      setSendingStatus(`Done! ${channel} windows opened.`);
      await logMessage(channel);
    },
    [recipients, message, logMessage],
  );

  const canNext = step === 0 ? recipients.length > 0 : step === 1 ? message.trim().length > 0 : true;
  const canPrev = step > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Send Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Send bulk WhatsApp or SMS messages to customers and workers.</p>
      </div>

      <StepIndicator currentStep={step} onNavigate={setStep} />

      {step === 0 && (
        <RecipientsPicker
          recipients={recipients}
          onImportCustomers={importCustomers}
          onImportWorkers={importWorkers}
          onClearAll={clearAll}
          manualName={manualName}
          manualPhone={manualPhone}
          onManualNameChange={setManualName}
          onManualPhoneChange={setManualPhone}
          onAddManual={addManual}
          onRemoveRecipient={removeRecipient}
        />
      )}

      {step === 1 && (
        <MessageEditor
          template={template}
          message={message}
          onTemplateChange={handleTemplateChange}
          onMessageChange={setMessage}
          recipients={recipients}
        />
      )}

      {step === 2 && (
        <SendActions
          recipients={recipients}
          message={message}
          onSendWhatsApp={() => sendViaChannel("whatsapp", "whatsapp")}
          onSendSMS={() => sendViaChannel("sms", "sms")}
          sendingStatus={sendingStatus}
        />
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={!canPrev} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft size={14} className="mr-1.5" />
          Previous
        </Button>
        <Button disabled={!canNext} onClick={() => setStep((s) => Math.min(s + 1, 2))}>
          Next
          <ChevronRight size={14} className="ml-1.5" />
        </Button>
      </div>

      <Separator />
      <MessageLog messages={messages} isLoading={isLoading} />
    </div>
  );
}
