import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import api from "@/lib/api/master";
import { User, Mail, Phone, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await api.getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl border p-8 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground mb-8">Coming Soon</p>

          <div className="space-y-4 text-left bg-muted/30 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{user.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{user.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium capitalize">{user.role || "user"}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            We are working on your profile page. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
