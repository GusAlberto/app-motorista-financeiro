/**
 * app/auth/callback/route.ts
 *
 * Supabase Auth callback handler.
 * Handles email verification and password reset redirects.
 *
 * Supabase sends users to this URL after clicking email confirmation or
 * password reset links. This route exchanges the auth code for a session,
 * then redirects to the appropriate page.
 */

import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Only allow same-site, single-slash relative paths as a post-auth redirect
 * target. Blocks open-redirect payloads like `//evil.com`, `/\evil.com`, or
 * a full external URL — an attacker who controls the emailed link's `next`
 * query param could otherwise send a real, validly-signed Supabase auth
 * code but bounce the user to an attacker-controlled site right after.
 */
function safeRedirectPath(path: string | null, fallback: string): string {
  if (!path) return fallback
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return fallback
  }
  return path
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type') ?? 'signup'
  const next = safeRedirectPath(searchParams.get('next'), '/dashboard')

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Password recovery: redirect to the password update section of settings
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/settings?tab=password&reset=true`)
      }

      // Email confirmation (or any other flow): honor a validated `next`, default to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect to login with an error flag on failure
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
