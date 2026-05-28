"use client";

import { useParams } from "next/navigation";
import { TechnicianDetails } from "@/components/dashboard/technicians/technician-details";

export default function TechnicianDetailPage() {
  const params = useParams();
  return <TechnicianDetails technicianId={params.id} />;
}
