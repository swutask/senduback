import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const invalidPaths = ["/restricted-items", "/$", "/&"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect unwanted paths to Homepage
  if (invalidPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
