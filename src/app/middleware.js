import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/about" || path === "/login"

  // Get the authentication token from cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // If the path is dashboard and there's no token, redirect to login
  if (path === "/dashboard" && !token) {
    // Store the original URL to redirect back after login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  // If the path is login and there's a token, redirect to dashboard
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: ["/", "/about", "/login", "/dashboard"],
}
