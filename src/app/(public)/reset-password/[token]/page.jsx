"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/auth";
import { animations } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, KeyRound, LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage({ params }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { token } = use(params);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(token, password);
      setSuccess(true);
      toast.success(t("resetPassword") + " — " + t("signIn"));
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ─────────────────────────────────────
  if (success) {
    return (
      <div className="flex min-h-screen w-full overflow-hidden bg-background">
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
        <div className="w-full md:w-1/2 flex items-center justify-center px-6">
          <motion.div
            className="w-full max-w-sm text-center"
            variants={animations.entrance.scaleUp}
            initial="hidden"
            animate="visible"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="size-8 text-emerald-500" />
            </div>
            <h2 className="font-sans font-bold text-2xl text-foreground mb-2">{t("resetPassword")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("resetPassword")} successful! Redirecting to {t("signIn")}...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Reset form ────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
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

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
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
            <p className="text-muted-foreground text-sm mt-1">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                {t("password")}
              </label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("passwordPlaceholder")}
                  className={cn("pr-10", error && "border-destructive focus-visible:ring-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </div>

            <Button type="submit" disabled={loading || !password} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("loadingButton")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="size-4" />
                  {t("resetPassword")}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← {t("signIn")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
