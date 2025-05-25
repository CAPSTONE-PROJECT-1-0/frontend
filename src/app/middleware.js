import { NextResponse } from "next/server"

export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === "/" || path === "/about" || path === "/login"

  const token = request.cookies.get("auth-token")?.value || ""

  if (path === "/dashboard" && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/about", "/login", "/dashboard"],
}
