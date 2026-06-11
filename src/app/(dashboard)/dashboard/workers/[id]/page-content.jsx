"use client";

import { useParams } from "next/navigation";
import { WorkerDetails } from "@/components/dashboard/workers/worker-details";

export default function WorkerDetailPage() {
  const params = useParams();
  return <WorkerDetails workerId={params.id} />;
}
