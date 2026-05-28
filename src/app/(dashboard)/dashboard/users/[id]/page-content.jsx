"use client";

import { useParams } from "next/navigation";
import { UserDetails } from "@/components/dashboard/users/user-details";

export default function UserDetailPage() {
  const params = useParams();
  return <UserDetails userId={params.id} />;
}
