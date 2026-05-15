import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request, { params }) {
  // Next.js 15 requires awaiting params
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const body = await request.json().catch(() => ({}));

    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    const setCookie = response.headers.get("set-cookie");

    return NextResponse.json(data, {
      status: response.status,
      headers: setCookie ? { "Set-Cookie": setCookie } : {},
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, message: "Failed to create checkout" }, { status: 500 });
  }
}
