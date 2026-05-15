import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 });

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await fetch(`${API_BASE_URL}/api/services/bookings/${id}/confirm`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      credentials: "include",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to confirm booking" }, { status: 500 });
  }
}
