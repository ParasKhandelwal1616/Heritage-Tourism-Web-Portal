import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserRole } from "./src/models/User";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith("/admin") && token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Manager and Admin routes
    if (
      path.startsWith("/manager") &&
      token?.role !== UserRole.ADMIN &&
      token?.role !== UserRole.MANAGER
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow authenticated users
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/portal/:path*"],
};
