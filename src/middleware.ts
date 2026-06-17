import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin'

  if (!isAdminRoute) return NextResponse.next()

  const sessionCookie = req.cookies.get('authjs.session-token')?.value
  const secureSessionCookie = req.cookies.get('__Secure-authjs.session-token')?.value
  const hasSession = !!(sessionCookie || secureSessionCookie)

  if (isLoginPage) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
