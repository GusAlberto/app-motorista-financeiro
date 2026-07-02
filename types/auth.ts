/**
 * types/auth.ts
 *
 * TypeScript interfaces for authentication state and user context.
 * Used by useAuth hook, AuthProvider, and auth-related components.
 */

import type { Session } from '@supabase/supabase-js'

/**
 * Application user — subset of Supabase auth.User with our custom profile data.
 * Contains only what the UI needs; avoid exposing raw Supabase user object.
 */
export interface User {
  /** Supabase auth user UUID */
  id: string
  /** User's email address */
  email: string
  /** Display name from driver_profiles.full_name (null until profile is filled in) */
  displayName: string | null
  /** UTC ISO timestamp of account creation */
  created_at: string
}

/**
 * Auth context shape — returned by useAuth() hook.
 * Provides user state, session, and auth actions to components.
 */
export interface AuthContext {
  /** Current authenticated user, or null if not logged in */
  user: User | null
  /** Raw Supabase session (includes JWT, refresh token) — null if not authenticated */
  session: Session | null
  /** True while the session is being loaded on initial mount */
  loading: boolean
  /** Sign out the current user and redirect to /login */
  logout: () => Promise<void>
}

/**
 * Login form values
 */
export interface LoginFormValues {
  email: string
  password: string
}

/**
 * Signup form values
 */
export interface SignupFormValues {
  email: string
  password: string
  confirmPassword: string
  agreedToTerms: boolean
}

/**
 * Forgot password form values
 */
export interface ForgotPasswordFormValues {
  email: string
}

/**
 * Settings profile form values
 */
export interface ProfileFormValues {
  fullName: string
  phone: string
}

/**
 * Settings password change form values
 */
export interface PasswordChangeFormValues {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}
