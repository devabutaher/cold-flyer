"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccountSchema, signInSchema } from "@/lib/auth-schemas";
import { auth, googleProvider } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { Badge } from "../ui/badge";

export default function AuthPage() {
  const [tab, setTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isSignIn = tab === "signin";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isSignIn ? signInSchema : createAccountSchema),
  });

  const handleTabSwitch = (t) => {
    setTab(t);
    setFirebaseError("");
    setShowPassword(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setFirebaseError("");
    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        await updateProfile(user, { displayName: data.name });
      }
      router.push("/");
    } catch (err) {
      setFirebaseError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setFirebaseError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      setFirebaseError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left — image panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-center p-10">
        <img
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80"
          alt="HVAC"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10">
          <Badge>Precision Thermal Systems</Badge>
          <h1 className="font-sans font-bold text-5xl text-white leading-tight mt-2 mb-4">
            Kinetic <br /> Comfort.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            Experience industrial-grade HVAC management with ColdFlyer's
            proprietary fleet telemetry and thermal precision engineering.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm">
          {/* Title */}
          <h2 className="font-sans font-bold text-2xl text-foreground mb-1">
            Welcome Back.
          </h2>
          <p className="text-muted-foreground text-sm mb-7">
            Access your fleet dashboard or create a new account.
          </p>

          {/* Tab switcher */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            {[
              { value: "signin", label: "Sign In" },
              { value: "create", label: "Create Account" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTabSwitch(t.value)}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200",
                  tab === t.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            {!isSignIn && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Full Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className={cn(
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Email Address
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                className={cn(
                  errors.email &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Password
                </label>
                {isSignIn && (
                  <button
                    type="button"
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "pr-10",
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Keep signed in */}
            {isSignIn && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-3.5 h-3.5" />
                <span className="text-sm text-muted-foreground">
                  Keep me signed in for 30 days
                </span>
              </label>
            )}

            {firebaseError && (
              <p className="text-destructive text-sm">{firebaseError}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Please wait..."
                : isSignIn
                  ? "Enter Workspace →"
                  : "Create Account →"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full"
          >
            <FaGoogle size={15} />
            Google
          </Button>

          <p className="text-muted-foreground text-xs text-center mt-6">
            Protected by reCAPTCHA.{" "}
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

function getFirebaseError(code) {
  const errors = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Invalid email address.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
  };
  return errors[code] ?? "Something went wrong. Please try again.";
}
