// Unauthenticated GET proxy for the backend's public endpoints (directory +
// public profiles). Keeps the backend origin server-side and avoids CORS setup
// in the browser. Redirects from the backend (historical slugs) are NOT
// followed here — the caller decides what to do with a 3xx.
import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.API_INTERNAL_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api/v1"
).replace(/\/$/, "");

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const target = `${API_BASE}/public/${path.join("/")}${req.nextUrl.search}`;

  const res = await fetch(target, { redirect: "manual", cache: "no-store" });

  if (res.status >= 300 && res.status < 400) {
    return NextResponse.json(
      { redirectLocation: res.headers.get("location") },
      { status: res.status },
    );
  }

  const body = await res.arrayBuffer();
  const out = new NextResponse(body, { status: res.status });
  const ct = res.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);
  return out;
}
