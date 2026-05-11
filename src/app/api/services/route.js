import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/services${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE_URL}/api/services`, {
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
    return NextResponse.json(
      { success: false, message: "Failed to create service" },
      { status: 500 }
    );
  }
}