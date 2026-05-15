import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function proxy(request, method) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const body = method !== "GET" ? await request.json() : undefined;

    const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Failed to ${method === "GET" ? "fetch" : "create"} coupons` },
      { status: 500 }
    );
  }
}

export async function GET(request) { return proxy(request, "GET"); }
export async function POST(request) { return proxy(request, "POST"); }
