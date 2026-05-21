"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { changePasswordAction } from "@/lib/actions/user";
import { useAuth } from "@/components/providers";

const PASSWORD_RULES = [
  { key: "ruleMinChars", test: (v) => v.length >= 8 },
  { key: "ruleNumber", test: (v) => /\d/.test(v) },
  { key: "ruleLetter", test: (v) => /[a-zA-Z]/.test(v) },
];

export function PasswordSection() {
  const router = useRouter();
  const { logOut } = useAuth();
  const t = useTranslations("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const strengthMap = { 0: "weak", 1: "fair", 2: "good", 3: "strong" };

  function getStrength(password) {
    const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
    const colors = ["bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
    const widths = ["w-1/4", "w-2/4", "w-3/4", "w-full"];
    return {
      key: strengthMap[passed],
      color: colors[passed] || colors[0],
      width: widths[passed] || widths[0],
    };
  }

  const strength = getStrength(form.newPassword);

  async function handleSave() {
    if (!form.currentPassword) {
      toast.error(t("passwordRequired"));
      return;
    }
    if (!form.newPassword || form.newPassword.length < 8) {
      toast.error(t("passwordMinLength"));
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }

    setSaving(true);
    const result = await changePasswordAction({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    setSaving(false);

    if (result.success) {
      toast.success(result.message || t("passwordChanged"));
      logOut();
      router.push("/auth");
    } else {
      toast.error(result.message || t("failedPassword"));
    }
  }

  function handleCancel() {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("password")}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              <Lock className="size-3.5" />
              {t("changePassword")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("passwordDesc")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("changePassword")}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="size-3.5" />
              {t("cancel")}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Check className="size-3.5" />
              {saving ? t("updating") : t("updatePassword")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-w-sm">
          <div className="grid gap-2">
            <Label htmlFor="current-password">{t("currentPassword")}</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowCurrent(!showCurrent)}
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="new-password">{t("newPassword")}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowNew(!showNew)}
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {form.newPassword && (
              <>
                <div className="flex gap-1 mt-1">
                  <div className={`h-1 rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="text-xs text-muted-foreground">{t("strength")} {t(strength.key)}</p>
                <ul className="space-y-1 mt-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(form.newPassword);
                    return (
                      <li key={rule.key} className="flex items-center gap-2 text-xs">
                        <span className={passed ? "text-green-500" : "text-muted-foreground"}>
                          {passed ? "✓" : "○"}
                        </span>
                        {t(rule.key)}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p className="text-xs text-destructive">{t("passwordsDoNotMatch")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
