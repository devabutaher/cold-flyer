"use client";

import { useAuth } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccountSchema, signInSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crown, Eye, EyeOff, Shield } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function AuthPage() {
  const t = useTranslations("auth");
  const [tab, setTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { refreshUser } = useAuth();

  const isSignIn = tab === "signin";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isSignIn ? signInSchema : createAccountSchema),
  });

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (!window.google?.accounts) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogle = async () => {
    if (!GOOGLE_CLIENT_ID) {
      setAuthError(t("googleSignInFailed"));
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      const idToken = await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) resolve(response.credential);
            else reject(new Error(t("noCredential")));
          },
        });
        window.google.accounts.id.prompt();
      });

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || t("googleSignInFailedFallback"));
      await refreshUser();
      toast.success(t("signedInGoogle"));
      router.push(redirectTo);
    } catch (err) {
      if (err.message !== t("noCredential")) {
        setAuthError(err.message || t("googleSignInFailedFallback"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (t) => {
    setTab(t);
    setAuthError("");
    setShowPassword(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError("");
    try {
      const endpoint = isSignIn ? "/api/auth/login" : "/api/auth/register";
      const body = isSignIn
        ? { email: data.email, password: data.password }
        : {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone || "",
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || t("somethingWentWrong"));

      await refreshUser();

      if (isSignIn) {
        if (result.data?.user?.role === "admin") {
          toast.success(t("welcomeAdmin"));
        } else {
          toast.success(t("welcomeBack"));
        }
      } else {
        toast.success(t("welcomeNew"));
      }
      router.push(redirectTo);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="font-sans font-bold text-5xl text-white leading-tight mt-2 mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            {t("heroDesc")}
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm">
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

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAdminHint(!showAdminHint)}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Shield size={12} />
              {showAdminHint ? t("hideAdminInfo") : t("areYouAdmin")}
            </button>

            {showAdminHint && (
              <div className="mt-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-sm">
                <p className="text-amber-600 font-medium flex items-center gap-1">
                  <Crown size={14} />
                  {t("adminAccessTitle")}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {t("adminAccessDesc")}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
              {loading ? t("loadingButton") : isSignIn ? t("signInButton") : t("createAccountButton")}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button type="button" variant="outline" onClick={handleGoogle} disabled={loading} className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            {t("googleSignIn")}
          </Button>

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
        </div>
      </div>
    </div>
  );
}
