"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { changePasswordAction } from "@/lib/actions/user";
import { useAuth } from "@/components/providers";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema } from "@/validations";

export function PasswordSection({ userProvider }) {
  const router = useRouter();
  const { logOut } = useAuth();
  const t = useTranslations("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    resolver: zodResolver(passwordChangeSchema),
    mode: "onTouched",
  });

  const newPassword = useWatch({ control, name: "newPassword" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  if (userProvider === "google") return null;

  async function onSave(data) {
    setSaving(true);
    const result = await changePasswordAction({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
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
    reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
            <Button size="sm" onClick={handleSubmit(onSave)} disabled={saving}>
              <Check className="size-3.5" />
              {saving ? t("updating") : t("updatePassword")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">{t("currentPassword")}</Label>
            <div className="relative">
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <Input id="current-password" type={showCurrent ? "text" : "password"} {...field} />
                )}
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
            {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="new-password">{t("newPassword")}</Label>
            <div className="relative">
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => <Input id="new-password" type={showNew ? "text" : "password"} {...field} />}
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
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input id="confirm-password" type={showConfirm ? "text" : "password"} {...field} />
                )}
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
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            {confirmPassword && newPassword !== confirmPassword && !errors.confirmPassword && (
              <p className="text-xs text-destructive">{t("passwordsDoNotMatch")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
