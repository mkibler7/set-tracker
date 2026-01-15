import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? "http://localhost:5000";

console.log("[api-proxy] BACKEND =", BACKEND);

type Ctx = { params: any };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, ctx);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, ctx);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, ctx);
}

async function forward(req: NextRequest, ctx: Ctx) {
  const params = await Promise.resolve(ctx.params);
  const segments: string[] = params?.path ?? [];

  // Always forward /api/* to backend /api/*
  const backendPath = `/api/${segments.join("/")}`;

  const url = new URL(req.url);
  const target = new URL(backendPath, BACKEND);
  target.search = url.search;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : await req.text(),
      redirect: "manual",
    });

    const body = await upstream.arrayBuffer();
    const res = new NextResponse(body, { status: upstream.status });

    // Copy headers except set-cookie, then append set-cookie(s)
    upstream.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (k === "set-cookie") return;
      // avoid hop-by-hop / problematic headers
      if (k === "content-encoding") return;
      if (k === "content-length") return;
      if (k === "transfer-encoding") return;
      if (k === "connection") return;
      res.headers.set(key, value);
    });

    const setCookies = (upstream.headers as any).getSetCookie?.() ?? [];
    for (const cookie of setCookies) res.headers.append("set-cookie", cookie);

    return res;
  } catch (err: any) {
    console.error("[api-proxy] UPSTREAM FETCH FAILED:", err);

    return NextResponse.json(
      {
        error: "Upstream fetch failed",
        backend: BACKEND,
        target: target.toString(),
        message: err?.message ?? String(err),
      },
      { status: 502 }
    );
  }
}
