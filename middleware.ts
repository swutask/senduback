import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isObjectId, isUUID, toKebabCase } from "./utils/slugify";

const invalidPaths = ["/restricted-items", "/$", "/&"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect unwanted paths to Homepage
  if (invalidPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  // normalize order page slugs to kebab-case
  if (pathname.startsWith("/orders/")) {
    const segments = pathname.split("/").filter(Boolean);

    const normalizedSegments = segments.map((seg, i) => {
      if (i === 0) return seg; // "orders"
      if (isUUID(seg) || isObjectId(seg)) return seg;

      return toKebabCase(seg);
    });

    const normalizedPath = "/" + normalizedSegments.join("/");

    if (pathname !== normalizedPath) {
      const url = request.nextUrl.clone();
      url.pathname = normalizedPath;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}
