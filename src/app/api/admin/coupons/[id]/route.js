import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify(body), credentials: "include",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch { return NextResponse.json({ success: false, message: "Failed to update coupon" }, { status: 500 }); }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
      method: "DELETE", headers: { Cookie: cookieHeader }, credentials: "include",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch { return NextResponse.json({ success: false, message: "Failed to delete coupon" }, { status: 500 }); }
}
