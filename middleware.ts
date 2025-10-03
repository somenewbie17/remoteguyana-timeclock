import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/app', '/manager', '/shifts']

export function middleware(_req: NextRequest) {
  // TEMP: auth disabled for demo/smoke. Always allow.
  return NextResponse.next()
}

export const config = {
  // Keep matcher but middleware is a no-op (auth temporarily disabled)
  matcher: ['/app/:path*', '/manager/:path*', '/shifts/:path*']
}
