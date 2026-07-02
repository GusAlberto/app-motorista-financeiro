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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type') ?? 'signup'
  const next = searchParams.get('next') ?? '/app/dashboard'

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
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Password recovery: redirect to a password update page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/app/settings?tab=password&reset=true`)
      }

      // Email confirmation: redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect to error page or login on failure
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
