import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl
  
  // Get hostname of request (e.g. colchones.localhost:3000, colchones.tienda.com)
  const hostname = req.headers.get('host') || ''

  // Define the base domain (e.g. localhost:3000 or your vercel production domain)
  // We can just extract the subdomain assuming format [subdomain].[domain].[tld]
  // For local development with localhost:3000, the subdomain is the first part.
  
  let subdomain = ''
  
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.')
    if (parts.length > 1 && parts[0] !== 'localhost') {
      subdomain = parts[0]
    }
  } else {
    // For production (e.g. colchones.vercel.app or colchones.tienda.com)
    // You should adapt this to your actual production domain structure.
    const parts = hostname.split('.')
    // Typically, if you have subdomain.vercel.app, parts[0] is the subdomain.
    if (parts.length > 2) {
      subdomain = parts[0]
    } else if (parts.length === 2 && !hostname.includes('vercel.app')) {
      // If it's a custom domain without a subdomain?
      subdomain = parts[0]
    } else {
      subdomain = parts[0]
    }
  }

  // If there's no subdomain (e.g. just localhost:3000), default to a tenant or show an error/landing page.
  // For now, let's default to "colchones" if none is provided so the app doesn't break.
  if (!subdomain || subdomain === 'localhost' || subdomain === 'tienda-vert-beta' || subdomain === 'www') {
    subdomain = 'colchones' 
  }

  // Rewrite to /[domain]/path
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}${url.search}`, req.url))
}
