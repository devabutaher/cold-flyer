import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await response.json();
    const setCookie = response.headers.get("set-cookie");

    const responseOptions = {
      status: response.status,
    };

    if (setCookie) {
      responseOptions.headers = { "Set-Cookie": setCookie };
    }

    return NextResponse.json(data, responseOptions);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}