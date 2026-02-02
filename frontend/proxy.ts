import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/service/userService";
import { Roles } from "@/constants/roles";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  console.log("🔍 Request intercepted for:", pathname);

  let isAuthenticated = false;
  let isAdmin = false;
  let isProvider = false;
  let isCustomer = false;

  try {
    // Adding a delay of 5 seconds before fetching the session data
    
    const { data } = await userService.getSession();
    console.log("📋 Session Data:", data);
    
    if (data && data.user) {
      isAuthenticated = true;
      isAdmin = data.user.role === Roles.admin;
      isProvider = data.user.role === Roles.provider;
      isCustomer = data.user.role === Roles.customer;
    }
    
    console.log("✅ Auth Status:", { isAuthenticated, isAdmin, isProvider, isCustomer });
  } catch (error) {
    console.error("❌ Session error:", error);
    isAuthenticated = false;
  }
  
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 5 seconds
  // Handle routing based on roles and authentication status
  if (pathname.startsWith("/profile")) {
    if (!isAuthenticated) {
      console.log("🚫 Unauthorized access to profile - Redirecting to login");
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    console.log("✅ Authorized access to profile");
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      console.log("🚫 Unauthenticated access to admin - Redirecting to login");
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (!isAdmin) {
      console.log("🚫 Non-admin access to admin route - Redirecting to unauthorized");
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    console.log("✅ Admin access granted");
    return NextResponse.next();
  }

  if (pathname.startsWith("/provider")) {
    if (!isAuthenticated) {
      console.log("🚫 Unauthenticated access to provider - Redirecting to login");
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (!isProvider) {
      console.log("🚫 Non-provider access to provider route - Redirecting to unauthorized");
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    console.log("✅ Provider access granted");
    return NextResponse.next();
  }

  console.log("✅ Request allowed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/admin/dashboard",
    "/admin/dashboard/:path*",
    "/provider/dashboard",
    "/provider/dashboard/:path*",
  ],
};
