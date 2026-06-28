import { NextRequest, NextResponse } from "next/server";

// Subdomain routing.
// `studio.nodeheus.com` (and `studio.localhost:3000`) is served from the
// `/studio` route without the prefix ever appearing in the URL.
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") || "").split(":")[0];
  const sub = host.split(".")[0];

  if (sub === "studio") {
    if (url.pathname === "/studio" || url.pathname.startsWith("/studio/")) {
      return NextResponse.next();
    }
    const rewritten = url.clone();
    rewritten.pathname = `/studio${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(rewritten);
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
