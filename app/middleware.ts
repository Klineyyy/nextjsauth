// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define which routes should be protected
const protectedRoutes = ["/dashboard"];
// Define which routes are for non-authenticated users
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Try to verify the token
  const isAuthenticated = token
    ? verifyToken(token)
    : false;

  // Redirect authenticated users trying to access login/signup pages to dashboard
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes to login
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    return true;
  } catch (error) {
    return false;
  }
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};