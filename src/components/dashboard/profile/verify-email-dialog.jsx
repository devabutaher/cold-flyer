"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { sendVerificationCodeAction, verifyEmailAction } from "@/lib/actions/user";

export function VerifyEmailDialog({ open, onOpenChange, email, onSuccess }) {
  const t = useTranslations("profile");
  const [step, setStep] = useState("idle");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleSendCode() {
    setSending(true);
    const result = await sendVerificationCodeAction();
    setSending(false);
    if (result.success) {
      toast.success(result.message || "Code sent");
      setStep("sent");
    } else {
      toast.error(result.message || "Failed to send code");
    }
  }

  async function handleVerify() {
    if (code.length < 6) return;
    setVerifying(true);
    const result = await verifyEmailAction(code);
    setVerifying(false);
    if (result.success) {
      toast.success(result.message || "Email verified");
      setCode("");
      setStep("idle");
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(result.message || "Failed to verify email");
    }
  }

  function handleClose() {
    setCode("");
    setStep("idle");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="size-4" />
            {t("verifyEmail")}
          </DialogTitle>
          <DialogDescription>
            {step === "sent"
              ? `Enter the 6-digit code sent to ${email}`
              : `A verification code will be sent to ${email}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex justify-center py-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              {step === "sent" ? <Mail className="size-7 text-primary" /> : <Send className="size-7 text-primary" />}
            </div>
          </div>

          {step === "sent" && (
            <div className="space-y-3">
              <Label htmlFor="verify-code" className="text-center block text-sm">
                Verification code
              </Label>
              <Input
                id="verify-code"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6).toUpperCase())}
                placeholder="000000"
                className="h-12 text-center text-2xl tracking-[0.5em] font-mono"
                maxLength={6}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {step === "idle" ? (
              <Button className="w-full" onClick={handleSendCode} disabled={sending}>
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {sending ? t("sending") : "Send Code"}
              </Button>
            ) : (
              <>
                <Button className="w-full" onClick={handleVerify} disabled={verifying || code.length < 6}>
                  {verifying ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  {verifying ? t("saving") : t("confirm")}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSendCode} disabled={sending} className="text-xs">
                  Resend code
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
