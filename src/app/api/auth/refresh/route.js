import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, message: "No session" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    const data = await response.json();
    const setCookies = response.headers.getSetCookie();

    const headers = new Headers({ "Content-Type": "application/json" });
    if (setCookies?.length > 0) {
      for (const cookie of setCookies) {
        headers.append("Set-Cookie", cookie);
      }
    }

    return NextResponse.json(data, { status: response.status, headers });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Token refresh failed" },
      { status: 500 }
    );
  }
}
