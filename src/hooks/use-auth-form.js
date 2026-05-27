"use client";

import { useAuth } from "@/components/providers";
import { forgotPassword, googleAuth, loginUser, registerUser } from "@/lib/actions/auth";
import { createAccountSchema, signInSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function useAuthForm() {
  const t = useTranslations("auth");
  const [tab, setTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const googleBtnRef = useRef(null);

  const isSignIn = tab === "signin";

  const handleForgotPassword = async (email) => {
    setLoading(true);
    setAuthError("");
    try {
      await forgotPassword(email);
      setForgotSent(true);
      toast.success(t("passwordResetSent"));
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(isSignIn ? signInSchema : createAccountSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (window.google?.accounts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGoogleReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client?hl=en";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleReady || !googleBtnRef.current) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      locale: "en",
      callback: async (response) => {
        if (!response?.credential) return;
        setLoading(true);
        setAuthError("");
        try {
          await googleAuth(response.credential);
          const user = await refreshUser();
          toast.success(t("signedInGoogle"));
          router.push(searchParams.get("redirect") || (["admin", "moderator", "worker"].includes(user?.role) ? "/dashboard" : "/"));
        } catch (err) {
          setAuthError(err.message || t("googleSignInFailedFallback"));
        } finally {
          setLoading(false);
        }
      },
    });

    google.accounts.id.renderButton(googleBtnRef.current, {
      type: "standard",
      shape: "rectangular",
      theme: "outline",
      size: "large",
      locale: "en",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleReady]);

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setAuthError("");
    setShowPassword(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError("");
    try {
      if (isSignIn) {
        await loginUser(data.email, data.password);
      } else {
        await registerUser(data.name, data.email, data.password, data.phone || "");
      }
      const user = await refreshUser();
      if (isSignIn) {
        toast.success(t("welcomeBack"));
      } else {
        toast.success(t("welcomeNew"));
      }
      router.push(searchParams.get("redirect") || (["admin", "moderator", "worker"].includes(user?.role) ? "/dashboard" : "/"));
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    tab,
    isSignIn,
    showPassword,
    authError,
    loading,
    showAdminHint,
    googleReady,
    googleBtnRef,
    forgotPasswordMode,
    forgotSent,
    handleForgotPassword,
    setForgotPasswordMode,
    register,
    handleSubmit,
    errors,
    setShowPassword,
    setShowAdminHint,
    handleTabSwitch,
    onSubmit,
  };
}
