import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firebaseToken } = body;

    const response = await fetch(`${API_BASE_URL}/api/auth/firebase/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firebaseToken }),
      credentials: "include",
    });

    const data = await response.json();
    
    // Forward cookies from backend to frontend
    const cookieHeader = response.headers.get("set-cookie") || "";
    
    const responseOptions = {
      status: response.status,
    };

    if (cookieHeader) {
      responseOptions.headers = { "Set-Cookie": cookieHeader };
    }

    return NextResponse.json(data, responseOptions);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}