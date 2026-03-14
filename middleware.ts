import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserRole } from "./src/types/user";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith("/dashboard/admin") && token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    // Manager and Admin routes
    if (
      path.startsWith("/dashboard/manager") &&
      token?.role !== UserRole.ADMIN &&
      token?.role !== UserRole.MANAGER
    ) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/portal/:path*",
    "/events/:path*",
    "/blogs/:path*"
  ],
};
