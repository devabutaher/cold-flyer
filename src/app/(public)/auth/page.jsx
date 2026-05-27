import { Suspense } from "react";
import AuthPageComponent from "@/components/auth/auth-page";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageComponent />
    </Suspense>
  );
}
