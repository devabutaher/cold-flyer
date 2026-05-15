import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics${qs ? `?${qs}` : ""}`, {
      headers: { "Content-Type": "application/json", Cookie: request.headers.get("cookie") || "" },
      credentials: "include",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, data: { sales: { dailySales: [], categorySales: [] }, services: { totalBookings: 0, completedBookings: 0, revenue: 0, byStatus: [], byCategory: [] } } }, { status: 500 });
  }
}
