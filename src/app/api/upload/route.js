import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await response.json();
    const setCookie = response.headers.get("set-cookie");

    return NextResponse.json(data, {
      status: response.status,
      headers: setCookie ? { "Set-Cookie": setCookie } : {},
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
  }
}
