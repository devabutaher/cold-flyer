import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  return proxy(request, params, "GET");
}

export async function POST(request, { params }) {
  return proxy(request, params, "POST");
}

export async function PUT(request, { params }) {
  return proxy(request, params, "PUT");
}

export async function PATCH(request, { params }) {
  return proxy(request, params, "PATCH");
}

export async function DELETE(request, { params }) {
  return proxy(request, params, "DELETE");
}

async function proxy(request, params, method) {
  try {
    const { path } = await params;
    const pathname = Array.isArray(path) ? path.join("/") : path;
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const url = `${BASE_URL}/api/${pathname}${qs ? `?${qs}` : ""}`;

    const cookieHeader = request.headers.get("cookie") || "";

    const fetchOptions = {
      method,
      headers: {
        Cookie: cookieHeader,
      },
    };

    if (method !== "GET" && method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        fetchOptions.body = await request.formData();
      } else {
        try {
          fetchOptions.body = JSON.stringify(await request.json());
          fetchOptions.headers["Content-Type"] = "application/json";
        } catch {}
      }
    }

    const response = await fetch(url, { ...fetchOptions, credentials: "include" });

    let body;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    const resHeaders = new Headers({ "Content-Type": ct || "application/json" });

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        resHeaders.append("Set-Cookie", value);
      }
    });

    return NextResponse.json(body, { status: response.status, headers: resHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}
