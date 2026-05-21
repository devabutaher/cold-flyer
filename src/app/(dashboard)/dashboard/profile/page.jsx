import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import { getAddressesAction } from "@/lib/actions/user";
import { sanitizeForRSC } from "@/lib/utils";
import { ProfileSection } from "@/components/dashboard/profile/profile-section";
import { AddressSection } from "@/components/dashboard/profile/address-section";
import { PasswordSection } from "@/components/dashboard/profile/password-section";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const { addresses } = await getAddressesAction();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <ProfileSection user={sanitizeForRSC(user)} />
      <PasswordSection />
      <AddressSection initialAddresses={sanitizeForRSC(addresses)} />
    </div>
  );
}
