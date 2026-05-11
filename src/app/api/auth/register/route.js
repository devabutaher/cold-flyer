import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firebaseToken, phone } = body;

    const response = await fetch(`${API_BASE_URL}/api/auth/firebase/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firebaseToken, phone }),
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
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}