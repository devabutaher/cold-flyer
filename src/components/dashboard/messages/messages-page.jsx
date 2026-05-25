"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { getClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  MessageSquare,
  Phone,
  Send,
  Users,
  UserPlus,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react";

/* ── Steps ─────────────────────────────────────────────── */
const STEPS = [
  { key: "recipients", label: "Recipients", icon: Users },
  { key: "message", label: "Message", icon: MessageSquare },
  { key: "send", label: "Send", icon: Send },
];

/* ── Template Messages ─────────────────────────────────── */
const TEMPLATES = [
  {
    label: "Installation Offer",
    message:
      "প্রিয় {name}, আপনার নতুন এসি ইনস্টলেশন অফারটি এখনও বৈধ। বিস্তারিত জানতে কল করুন: ০১৭XXXXXXXX",
  },
  {
    label: "Repair Reminder",
    message:
      "প্রিয় {name}, আপনার এসি মেরামতের সময় এসেছে। দয়া করে আমাদের সাথে যোগাযোগ করুন। ধন্যবাদ।",
  },
  {
    label: "Maintenance Reminder",
    message:
      "প্রিয় {name}, আপনার এসির নিয়মিত মেইন্টেন্যান্স এর সময় হয়েছে। আজই অ্যাপয়েন্টমেন্ট বুক করুন।",
  },
  {
    label: "Gas Fill Offer",
    message:
      "প্রিয় {name}, এসির গ্যাস ফিল অফার চলছে। সীমিত সময়ের জন্য বিশেষ মূল্যে গ্যাস রিফিল করানো যাবে।",
  },
  {
    label: "Eid Special",
    message:
      "প্রিয় {name}, ঈদ উপলক্ষে Cold Flyer নিয়ে এসেছে বিশেষ ছাড়! সব সার্ভিসে ১০% পর্যন্ত ডিসকাউন্ট।",
  },
  {
    label: "Summer Special",
    message:
      "প্রিয় {name}, গ্রীষ্মকালীন অফার! এসি ইন্সটলেশন ও সার্ভিসে বিশেষ মূল্য ছাড়। আজই যোগাযোগ করুন।",
  },
  {
    label: "Follow-up",
    message:
      "প্রিয় {name}, আপনার সেবা নিয়ে কোনো অভিযোগ বা মতামত থাকলে জানান। আপনার সন্তুষ্টিই আমাদের লক্ষ্য।",
  },
  {
    label: "Salary Notice",
    message:
      "প্রিয় {name}, এই মাসের বেতন প্রক্রিয়াকরণের জন্য আপনার উপস্থিতি ও কাজের বিবরণ প্রয়োজন। দয়া করে অফিসে যোগাযোগ করুন।",
  },
];

/* ── Message Log columns ───────────────────────────────── */
const mapLogRow = (m) => ({
  time: m.time || "—",
  name: m.name || "—",
  number: m.number || "—",
  channel: m.channel || "—",
  message: m.message || "—",
});

const LOG_PDF_COLUMNS = [
  { header: "Time", accessorKey: "time", width: 1 },
  { header: "Name", accessorKey: "name", width: 1.5 },
  { header: "Number", accessorKey: "number", width: 1.5 },
  { header: "Channel", accessorKey: "channel", width: 0.8 },
  { header: "Message", accessorKey: "message", width: 3 },
];

function buildLogColumns() {
  return [
    {
      header: "Time",
      accessorKey: "time",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("time") || "—"}</span>,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("name") || "—"}</span>,
    },
    {
      header: "Number",
      accessorKey: "number",
      cell: ({ row }) => <span className="text-sm">{row.getValue("number") || "—"}</span>,
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: ({ row }) => {
        const ch = row.getValue("channel");
        return (
          <Badge variant={ch === "whatsapp" ? "default" : "secondary"} className="text-[10px]">
            {ch || "—"}
          </Badge>
        );
      },
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-[300px] truncate block">
          {row.getValue("message") || "—"}
        </span>
      ),
    },
  ];
}

/* ── Main Page ──────────────────────────────────────────── */
export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [recipients, setRecipients] = useState([]);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [sendingStatus, setSendingStatus] = useState("");

  /* ── Data ── */
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const res = await getClient().get("/api/messages");
      return res.data?.data?.messages || [];
    },
  });

  const columns = useMemo(() => buildLogColumns(), []);

  /* ── Import Customers ── */
  const importCustomers = useCallback(async () => {
    try {
      const res = await getClient().get("/api/customers");
      const customers = res.data?.data?.customers || [];
      const newRecipients = customers
        .filter((c) => c.phone)
        .map((c) => ({ name: c.name, phone: c.phone }));
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

  /* ── Import Workers ── */
  const importWorkers = useCallback(async () => {
    try {
      const res = await getClient().get("/api/technicians");
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

  /* ── Manual Add ── */
  const addManual = useCallback(() => {
    if (!manualName || !manualPhone) {
      toast.error("Please enter both name and phone.");
      return;
    }
    const exists = recipients.some((r) => r.phone === manualPhone);
    if (exists) {
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

  /* ── Template Selection ── */
  const handleTemplateChange = useCallback(
    (val) => {
      setTemplate(val);
      const tpl = TEMPLATES.find((t) => t.label === val);
      if (tpl) setMessage(tpl.message);
    },
    [],
  );

  /* ── Send via WhatsApp ── */
  const sendWhatsApp = useCallback(async () => {
    if (recipients.length === 0) {
      toast.error("No recipients selected.");
      return;
    }
    if (!message) {
      toast.error("No message to send.");
      return;
    }
    setSendingStatus(`Opening WhatsApp for ${recipients.length} recipient(s)...`);
    // Open sequentially with delays
    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      const personalized = message.replace(/{name}/g, r.name);
      const url = `https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(personalized)}`;
      window.open(url, "_blank");
      setSendingStatus(`Opened WhatsApp for ${r.name} (${i + 1}/${recipients.length})`);
      // Wait between opens
      if (i < recipients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    setSendingStatus("Done! WhatsApp windows opened.");

    // Log the message
    try {
      await getClient().post("/api/messages", {
        time: new Date().toISOString(),
        name: recipients.map((r) => r.name).join(", "),
        number: recipients.map((r) => r.phone).join(", "),
        channel: "whatsapp",
        message,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    } catch {
      // Silently fail logging
    }
  }, [recipients, message, queryClient]);

  /* ── Send via SMS ── */
  const sendSMS = useCallback(async () => {
    if (recipients.length === 0) {
      toast.error("No recipients selected.");
      return;
    }
    if (!message) {
      toast.error("No message to send.");
      return;
    }
    setSendingStatus(`Opening SMS for ${recipients.length} recipient(s)...`);
    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      const personalized = message.replace(/{name}/g, r.name);
      const url = `sms:${r.phone.replace(/[^0-9]/g, "")}?body=${encodeURIComponent(personalized)}`;
      window.open(url, "_blank");
      setSendingStatus(`Opened SMS for ${r.name} (${i + 1}/${recipients.length})`);
      if (i < recipients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setSendingStatus("Done! SMS windows opened.");

    try {
      await getClient().post("/api/messages", {
        time: new Date().toISOString(),
        name: recipients.map((r) => r.name).join(", "),
        number: recipients.map((r) => r.phone).join(", "),
        channel: "sms",
        message,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    } catch {
      // Silently fail logging
    }
  }, [recipients, message, queryClient]);

  /* ── Navigate ── */
  const canNext = step === 0 ? recipients.length > 0 : step === 1 ? message.trim().length > 0 : true;
  const canPrev = step > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Send Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Send bulk WhatsApp or SMS messages to customers and workers.
        </p>
      </div>

      {/* ── Progress Steps ── */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-0 flex-1">
            <div
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
              }`}
              onClick={() => i < step && setStep(i)}
            >
              {i < step ? <Check size={14} /> : <s.icon size={14} />}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Recipients ── */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Select Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={importCustomers}>
                <Users size={14} className="mr-1.5" />
                Import Customers
              </Button>
              <Button variant="outline" size="sm" onClick={importWorkers}>
                <Users size={14} className="mr-1.5" />
                Import Workers
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll} disabled={recipients.length === 0}>
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
                  onChange={(e) => setManualName(e.target.value)}
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
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Phone number"
                  className="h-9"
                />
              </div>
              <Button size="sm" onClick={addManual}>
                <UserPlus size={14} className="mr-1.5" />
                Add
              </Button>
            </div>

            {/* Chips */}
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {recipients.map((r) => (
                  <Badge key={r.phone} variant="secondary" className="gap-1.5 pr-1">
                    {r.name}
                    <button
                      onClick={() => removeRecipient(r.phone)}
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
      )}

      {/* ── Step 2: Write Message ── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Write Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template" className="mb-1.5 block">
                Template
              </Label>
              <Select value={template} onValueChange={handleTemplateChange}>
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here... Use {name} as placeholder."
                rows={6}
                className="resize-y"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {message.length} character{message.length !== 1 ? "s" : ""}. Use {"{name}"} for recipient name.
              </p>
            </div>

            {/* Preview */}
            {message && recipients.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Preview with first recipient:</p>
                <p className="text-sm">{message.replace(/{name}/g, recipients[0].name)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 3: Send ── */}
      {step === 2 && (
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
              <Button size="lg" onClick={sendWhatsApp} disabled={!canNext}>
                <MessageSquare size={16} className="mr-2" />
                Send via WhatsApp
              </Button>
              <Button size="lg" variant="outline" onClick={sendSMS} disabled={!canNext}>
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
      )}

      {/* ── Navigation ── */}
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

      {/* ── Message Log ── */}
      <Separator />

      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-4">Message Log</h2>
        <DataTable
          columns={columns}
          data={messages}
          loading={isLoading}
          rowCount="messages"
          defaultSort={[]}
          emptyMessage="No messages sent yet."
          emptyIcon={<MessageSquare size={40} />}
          toolbar={(table) => (
            <TableToolbar
              table={table}
              searchPlaceholder="Search messages..."
              selectedLabel="messages"
              filters={[]}
              actions={
                <ExportMenu
                  table={table}
                  filename="message-log"
                  mapRow={mapLogRow}
                  pdfTitle="ColdFlyer — Message Log"
                  pdfColumns={LOG_PDF_COLUMNS}
                />
              }
            />
          )}
        />
      </div>
    </div>
  );
}
