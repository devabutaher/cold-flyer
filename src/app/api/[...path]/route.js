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

    const fetchOptions = {
      method,
      headers: {},
    };

    const accessToken = request.cookies.get("accessToken")?.value;
    if (accessToken) {
      fetchOptions.headers.Cookie = `accessToken=${accessToken}`;
      fetchOptions.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (method !== "GET" && method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        if (method === "PATCH") {
          const chunks = [];
          const reader = request.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const totalLen = chunks.reduce((a, c) => a + c.length, 0);
          const body = new Uint8Array(totalLen);
          let offset = 0;
          for (const c of chunks) {
            body.set(c, offset);
            offset += c.length;
          }
          fetchOptions.body = body;
        } else {
          fetchOptions.body = request.body;
          fetchOptions.duplex = "half";
        }
        fetchOptions.headers["Content-Type"] = contentType;
      } else {
        try {
          fetchOptions.body = JSON.stringify(await request.json());
          fetchOptions.headers["Content-Type"] = "application/json";
        } catch {}
      }
    }

    const response = await fetch(url, fetchOptions);

    let body;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    const resHeaders = new Headers({ "Content-Type": ct || "application/json" });

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        resHeaders.append("Set-Cookie", cookie);
      });
    }

    return NextResponse.json(body, { status: response.status, headers: resHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}
