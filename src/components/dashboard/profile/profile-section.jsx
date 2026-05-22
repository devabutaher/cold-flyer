"use client";

import { useAuth } from "@/components/providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { sendVerificationCodeAction, updateProfileAction, verifyEmailAction } from "@/lib/actions/user";
import { getClient } from "@/lib/http-client";
import { Cake, Camera, Check, ChevronDownIcon, Loader2, Mail, Pencil, User, VenetianMask, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const GENDERS = ["male", "female", "other"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function toDateInputValue(dateStr) {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? undefined : d;
  } catch {
    return undefined;
  }
}

function formatShortDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ProfileSection({ user }) {
  const router = useRouter();
  const t = useTranslations("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(toDateInputValue(user.dateOfBirth) || new Date());
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    dateOfBirth: toDateInputValue(user.dateOfBirth),
    gender: user.gender || "",
  });
  const { refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);

  async function handleSave() {
    setSaving(true);
    const payload = {};
    if (form.name !== user.name) payload.name = form.name;
    if (form.phone !== (user.phone || "")) payload.phone = form.phone;
    const origDate = toDateInputValue(user.dateOfBirth);
    if (form.dateOfBirth?.getTime() !== origDate?.getTime())
      payload.dateOfBirth = form.dateOfBirth?.toISOString() || null;
    if (form.gender !== (user.gender || "")) payload.gender = form.gender || null;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      setSaving(false);
      return;
    }

    const result = await updateProfileAction(payload);
    setSaving(false);

    if (result.success) {
      toast.success(t("profileUpdated"));
      setIsEditing(false);
      refreshUser();
      router.refresh();
    } else {
      toast.error(result.message || t("failedProfile"));
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("imageTooLarge"));
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const client = getClient();
      const res = await client.patch("/users/avatar", formData, {
        headers: { "Content-Type": undefined },
      });
      if (res.data?.success) {
        setAvatarUrl(res.data.data.avatar);
        toast.success(t("avatarUpdated"));
        refreshUser();
        router.refresh();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("failedAvatar"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSendCode() {
    setSendingCode(true);
    const result = await sendVerificationCodeAction();
    setSendingCode(false);
    if (result.success) {
      toast.success(result.message || "Code sent");
      setVerifying(true);
    } else {
      toast.error(result.message || "Failed to send code");
    }
  }

  async function handleVerifyCode() {
    if (!verifyCode || verifyCode.length < 6) return;
    setConfirmingCode(true);
    const result = await verifyEmailAction(verifyCode);
    setConfirmingCode(false);
    if (result.success) {
      toast.success(result.message || "Email verified");
      setVerifyCode("");
      setVerifying(false);
      refreshUser();
      router.refresh();
    } else {
      toast.error(result.message || "Failed to verify email");
    }
  }

  function handleCancel() {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      dateOfBirth: toDateInputValue(user.dateOfBirth),
      gender: user.gender || "",
    });
    setCalendarMonth(toDateInputValue(user.dateOfBirth) || new Date());
    setIsEditing(false);
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("profileInfo")}</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="size-3.5" />
              {t("edit")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="size-3.5" />
                {t("cancel")}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Check className="size-3.5" />
                {saving ? t("saving") : t("save")}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative group">
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileSelect} />
            <Avatar size="lg" className="size-20">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={user.name} /> : null}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-100"
              aria-label={t("changeAvatar")}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-5 text-white animate-spin" />
              ) : (
                <Camera className="size-5 text-white" />
              )}
            </button>
          </div>

          <div className="flex-1 w-full space-y-4">
            {isEditing ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">{t("dateOfBirth")}</Label>
                  <div className="relative flex gap-2">
                    <Input
                      id="dob"
                      readOnly
                      value={form.dateOfBirth ? formatShortDate(form.dateOfBirth) : ""}
                      placeholder={t("pickDate")}
                      className="bg-background pr-10 cursor-pointer"
                      onClick={() => setCalendarOpen(true)}
                    />
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
                          <ChevronDownIcon className="size-4" />
                          <span className="sr-only">Pick a date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
                        <Calendar
                          mode="single"
                          selected={form.dateOfBirth}
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setForm({ ...form, dateOfBirth: date });
                            setCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">{t("gender")}</Label>
                  <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder={t("selectGender")} />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {t(opt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("name")}</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{t("email")}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.email}</p>
                      <Badge
                        variant={user.isEmailVerified ? "secondary" : "outline"}
                        className="text-[10px] h-5 px-1.5"
                      >
                        {user.isEmailVerified ? t("verified") : t("unverified")}
                      </Badge>
                    </div>
                    {!user.isEmailVerified && !verifying && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={handleSendCode}
                        disabled={sendingCode}
                      >
                        {sendingCode ? t("sending") : t("verifyEmail")}
                      </Button>
                    )}
                    {!user.isEmailVerified && verifying && (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          size={6}
                          maxLength={6}
                          placeholder="000000"
                          value={verifyCode}
                          onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                          className="w-28 h-8 text-center text-sm tracking-widest"
                          onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                        />
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={handleVerifyCode}
                          disabled={confirmingCode || verifyCode.length < 6}
                        >
                          {confirmingCode ? t("saving") : t("confirm")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Cake className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("dateOfBirth")}</p>
                    <p className="font-medium">{user.dateOfBirth ? formatDate(user.dateOfBirth) : t("notSet")}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <VenetianMask className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("gender")}</p>
                    <p className="font-medium capitalize">{user.gender ? t(user.gender) : t("notSet")}</p>
                  </div>
                </div>
                {user.role !== "user" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("role")}</p>
                        <p className="font-medium capitalize">{user.role}</p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
