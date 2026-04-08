import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/adminAuth";

function unauthorizedApiResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isPublicAdminApi(pathname: string, method: string): boolean {
  if (pathname === "/api/admin/content" && method === "GET") {
    return true;
  }

  if (pathname === "/api/admin/login" && method === "POST") {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const maybeBlogMediaPath =
    segments.length === 3 &&
    (segments[0] === "Blogs" || segments[0] === "blogs") &&
    segments[2].includes(".");

  if (maybeBlogMediaPath) {
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = `/api/blog-files/Blogs/${segments[1]}/${segments[2]}`;
    return NextResponse.rewrite(rewrittenUrl);
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isPublicAdminApi(pathname, request.method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthorized = isAdminSessionValid(token);

  if (pathname === "/admin/login") {
    if (isAuthorized) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthorized) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return unauthorizedApiResponse();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/Blogs/:path*", "/blogs/:path*"],
};
