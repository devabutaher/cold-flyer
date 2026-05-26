"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthForm } from "@/hooks/use-auth-form";
import { animations } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crown, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export default function AuthPage() {
  const t = useTranslations("auth");
  const {
    tab,
    isSignIn,
    showPassword,
    authError,
    loading,
    showAdminHint,
    googleBtnRef,
    register,
    handleSubmit,
    errors,
    setShowPassword,
    handleTabSwitch,
    onSubmit,
    forgotPasswordMode,
    forgotSent,
    handleForgotPassword,
    setForgotPasswordMode,
  } = useAuthForm();

  const [forgotEmail, setForgotEmail] = useState("");

  // ── Forgot password mode ──────────────────────────────
  if (forgotPasswordMode) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-center p-10">
          <Image
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80"
            alt="HVAC"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
          <div className="relative z-10">
            <Badge>{t("badge")}</Badge>
            <h1 className="font-sans font-bold text-5xl text-white leading-tight mt-2 mb-4">{t("heroTitle")}</h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">{t("heroDesc")}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-background">
          <motion.div
            className="w-full max-w-sm"
            variants={animations.entrance.fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <LockKeyhole className="size-6 text-primary" />
              </div>
              <h2 className="font-sans font-bold text-2xl text-foreground">{t("resetPassword")}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t("signInSub")}</p>
            </div>

            {forgotSent ? (
              <motion.div
                className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center"
                variants={animations.entrance.scaleUp}
                initial="hidden"
                animate="visible"
              >
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="size-6 text-primary" />
                </div>
                <p className="text-foreground font-medium text-sm">{t("passwordResetSent")}</p>
                <p className="text-muted-foreground text-xs mt-2">
                  Check your inbox and follow the link to reset your password.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPassword(forgotEmail);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    {t("emailLabel")}
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className={cn("pl-9", authError && "border-destructive focus-visible:ring-destructive")}
                    />
                  </div>
                  {authError && <p className="text-destructive text-xs mt-1">{authError}</p>}
                </div>

                <Button type="submit" disabled={loading || !forgotEmail} className="w-full">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t("loadingButton")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="size-4" />
                      {t("sendResetLink")}
                    </span>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordMode(false);
                  setForgotEmail("");
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← {t("signIn")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Default sign-in / sign-up mode ────────────────────
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-center p-10">
        <Image
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80"
          alt="HVAC"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10">
          <Badge>{t("badge")}</Badge>
          <h1 className="font-sans font-bold text-5xl text-white leading-tight mt-2 mb-4">{t("heroTitle")}</h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">{t("heroDesc")}</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-background">
        <motion.div
          className="w-full max-w-sm"
          variants={animations.entrance.fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="font-sans font-bold text-2xl text-foreground mb-1">{t("signInTitle")}</h2>
          <p className="text-muted-foreground text-sm mb-7">{t("signInSub")}</p>

          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            {[
              { value: "signin", label: t("signInTab") },
              { value: "create", label: t("createAccountTab") },
            ].map((tabItem) => (
              <button
                key={tabItem.value}
                type="button"
                onClick={() => handleTabSwitch(tabItem.value)}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200",
                  tab === tabItem.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tabItem.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {t("name")}
                </label>
                <Input
                  {...register("name")}
                  placeholder={t("namePlaceholder")}
                  className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>
            )}

            {!isSignIn && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {t("phone")} (<span className="font-medium">{t("phoneOptional")}</span>)
                </label>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  className={cn(errors.phone && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                {t("emailLabel")}
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder={t("emailPlaceholder")}
                className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("password")}
                </label>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder={t("passwordPlaceholder")}
                  className={cn("pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            {authError && <p className="text-destructive text-sm">{authError}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("loadingButton")}
                </span>
              ) : isSignIn ? (
                t("signInButton")
              ) : (
                t("createAccountButton")
              )}
            </Button>
            {isSignIn && (
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-xs font-bold uppercase tracking-widest text-primary/80 hover:text-primary transition-colors"
              >
                {t("forgotPassword")}
              </button>
            )}
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div ref={googleBtnRef} className="w-full min-h-11" />

          <p className="text-muted-foreground text-xs text-center mt-6">
            {t("protectedBy")}{" "}
            <a href="#" className="text-primary underline underline-offset-2">
              Privacy Policy
            </a>{" "}
            &{" "}
            <a href="#" className="text-primary underline underline-offset-2">
              Terms of Service
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
