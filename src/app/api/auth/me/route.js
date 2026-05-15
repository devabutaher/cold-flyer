import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    // No cookies at all — definitely not authenticated, avoid 401 noise
    if (!cookieHeader) {
      return NextResponse.json({ success: true, data: null });
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ success: true, data: null });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to get current user" }, { status: 500 });
  }
}
