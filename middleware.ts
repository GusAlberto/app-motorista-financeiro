/**
 * middleware.ts
 *
 * Next.js middleware for route protection and session management.
 *
 * Responsibilities:
 *  1. Protect /app/* routes — unauthenticated users are redirected to /login
 *  2. Refresh Supabase session tokens on each request (SSR-safe cookie update)
 *  3. Pass user session to server-side code via cookies
 *
 * Matcher: runs on /app/* and auth routes (excludes static files, _next, images)
 */

import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Routes that require authentication (prefix match).
 * Unauthenticated requests to these routes are redirected to /login.
 */
const PROTECTED_PREFIXES = ['/app', '/dashboard', '/settings', '/transactions']

/**
 * Routes that authenticated users should NOT access (redirect to dashboard).
 * Prevents logged-in users from seeing the login/signup pages again.
 */
const AUTH_PREFIXES = ['/login', '/signup', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a mutable response to pass cookies through
  let supabaseResponse = NextResponse.next({ request })

  // Create a server-side Supabase client that reads/writes cookies for session
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        // Forward cookies to the request (for use in server components)
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        // Recreate response so cookies are set on the actual HTTP response
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: Do not run code between createServerClient and supabase.auth.getUser()
  // that may invalidate the session. Await getUser() immediately.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  // Redirect unauthenticated users away from protected routes
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    // Preserve the original destination for post-login redirect (optional)
    // loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages (optional UX improvement)
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // IMPORTANT: Return supabaseResponse (not NextResponse.next()) to preserve
  // session cookies that were refreshed by Supabase during getUser()
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (Next.js static files)
     * - _next/image (Next.js image optimization)
     * - favicon.ico, manifest.json, robots.txt, sitemap.xml
     * - Public assets (images, fonts)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)).*)',
  ],
}
