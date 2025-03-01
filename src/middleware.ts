import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith("/game/")) {
    // Verificar se tem ID da sessão
    const sessionId = path.split("/")[2]
    if (!sessionId) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/game/:path*",
}

