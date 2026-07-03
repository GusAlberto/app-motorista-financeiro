'use client'

/**
 * app/(app)/settings/page.tsx
 *
 * User settings page — profile, password change, preferences, logout.
 * Mobile-first: single column on mobile, two-column on md+.
 * Protected by middleware.ts (requires authentication).
 *
 * Sections:
 *  1. Account — display email (read-only), edit name + phone
 *  2. Password — change password
 *  3. Preferences — theme toggle, language selector
 *  4. Danger Zone — sign out
 */

import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTheme } from '@/components/ThemeProvider'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { Metadata } from 'next'

// Note: 'use client' pages cannot export metadata
// Title handled by layout or parent metadata

// ─────────────────────────────────────────────
// Form field component for reuse within page
// ─────────────────────────────────────────────

function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  error,
  hint,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange?: (val: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  error?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
        className={cn(
          'h-12 w-full rounded-xl border px-4',
          'text-base text-slate-900 placeholder-slate-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20',
          'dark:text-slate-50 dark:placeholder-slate-500',
          readOnly
            ? 'cursor-default bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            : 'bg-white dark:bg-slate-800',
          error
            ? 'border-red-500 focus:border-red-500 dark:border-red-500'
            : 'border-slate-300 focus:border-amber-500 dark:border-slate-700 dark:focus:border-amber-400',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-readonly={readOnly}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Settings Page
// ─────────────────────────────────────────────

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const supabase = createClient()

  // ── Section 1: Profile ──────────────────────
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Load existing profile on mount
  useEffect(() => {
    if (!user?.id) return

    supabase
      .from('driver_profiles')
      .select('full_name, phone')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name ?? '')
          setPhone(data.phone ?? '')
        }
      })
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user?.id) return
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(false)

    // Upsert driver profile (insert or update).
    // `driver_profiles.id` (not user_id) is the primary key, so without an
    // explicit onConflict target, PostgREST defaults to matching on the PK
    // — which is never present in this payload — and every save after the
    // first would try to INSERT again and fail on the user_id UNIQUE
    // constraint. Target user_id explicitly to make this a true upsert.
    const { error } = await supabase
      .from('driver_profiles')
      .upsert(
        {
          user_id: user.id,
          full_name: fullName.trim() || null,
          phone: phone.trim() || null,
        },
        { onConflict: 'user_id' }
      )

    setProfileLoading(false)
    if (error) {
      setProfileError('Erro ao salvar perfil. Tente novamente.')
    } else {
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
  }

  // ── Section 2: Password ──────────────────────
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (newPassword.length < 8) {
      errors.newPassword = 'A nova senha deve ter pelo menos 8 caracteres.'
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = 'A senha deve conter pelo menos uma letra maiúscula.'
    }
    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'As senhas não coincidem.'
    }
    if (newPassword === currentPassword) {
      errors.newPassword = 'A nova senha deve ser diferente da senha atual.'
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setPasswordErrors({})
    setPasswordLoading(true)

    // Re-authenticate with the current password before changing it.
    // supabase.auth.updateUser() only requires an active session — without
    // this step, anyone who gets hold of a live session (stolen cookie,
    // unlocked device) could silently change the password without ever
    // knowing the original one. The "Senha atual" field was previously
    // collected but never actually verified against anything.
    if (user?.email) {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (reauthError) {
        setPasswordLoading(false)
        setPasswordErrors({ currentPassword: 'Senha atual incorreta.' })
        return
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setPasswordLoading(false)

    if (error) {
      setPasswordErrors({ newPassword: 'Erro ao alterar senha. Tente novamente.' })
    } else {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    }
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Gerencie sua conta e preferências.
        </p>
      </div>

      {/* ── Section 1: Account / Profile ── */}
      <section
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        aria-labelledby="account-heading"
      >
        <h2
          id="account-heading"
          className="mb-4 font-display text-base font-bold text-slate-900 dark:text-slate-50"
        >
          Conta
        </h2>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          {/* Email — read-only */}
          <FormField
            id="email"
            label="Email"
            type="email"
            value={user?.email ?? ''}
            readOnly
            hint="O email não pode ser alterado."
          />

          {/* Name */}
          <FormField
            id="fullName"
            label="Nome completo"
            value={fullName}
            onChange={setFullName}
            placeholder="Seu nome"
            disabled={profileLoading}
          />

          {/* Phone */}
          <FormField
            id="phone"
            label="Telefone"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="(11) 99999-9999"
            disabled={profileLoading}
          />

          {profileError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {profileError}
            </p>
          )}

          {profileSuccess && (
            <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
              Perfil atualizado com sucesso!
            </p>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className={cn(
              'flex h-12 w-full items-center justify-center rounded-xl md:w-auto md:px-6',
              'bg-amber-500 text-base font-semibold text-slate-950',
              'transition-colors hover:bg-amber-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {profileLoading ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </form>
      </section>

      {/* ── Section 2: Password ── */}
      <section
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        aria-labelledby="password-heading"
      >
        <h2
          id="password-heading"
          className="mb-4 font-display text-base font-bold text-slate-900 dark:text-slate-50"
        >
          Alterar senha
        </h2>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <FormField
            id="currentPassword"
            label="Senha atual"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="••••••••"
            disabled={passwordLoading}
            error={passwordErrors.currentPassword}
          />

          <FormField
            id="newPassword"
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Mínimo 8 caracteres"
            disabled={passwordLoading}
            error={passwordErrors.newPassword}
            hint="Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números."
          />

          <FormField
            id="confirmNewPassword"
            label="Confirmar nova senha"
            type="password"
            value={confirmNewPassword}
            onChange={setConfirmNewPassword}
            placeholder="Repita a nova senha"
            disabled={passwordLoading}
            error={passwordErrors.confirmNewPassword}
          />

          {passwordSuccess && (
            <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
              Senha alterada com sucesso!
            </p>
          )}

          <button
            type="submit"
            disabled={passwordLoading || !currentPassword || !newPassword || !confirmNewPassword}
            className={cn(
              'flex h-12 w-full items-center justify-center rounded-xl md:w-auto md:px-6',
              'bg-amber-500 text-base font-semibold text-slate-950',
              'transition-colors hover:bg-amber-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {passwordLoading ? 'Alterando...' : 'Alterar senha'}
          </button>
        </form>
      </section>

      {/* ── Section 3: Preferences ── */}
      <section
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        aria-labelledby="preferences-heading"
      >
        <h2
          id="preferences-heading"
          className="mb-4 font-display text-base font-bold text-slate-900 dark:text-slate-50"
        >
          Preferências
        </h2>

        <div className="flex flex-col gap-4">
          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                Tema escuro
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alterne entre tema claro e escuro.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              role="switch"
              aria-checked={resolvedTheme === 'dark'}
              aria-label="Ativar tema escuro"
              className={cn(
                'relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
                'transition-colors duration-200 ease-in-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
                resolvedTheme === 'dark' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0',
                  'transition duration-200 ease-in-out',
                  resolvedTheme === 'dark' ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </div>

          {/* Language selector */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="language"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Idioma
            </label>
            <select
              id="language"
              defaultValue="pt-BR"
              className={cn(
                'h-12 w-full rounded-xl border border-slate-300 px-4',
                'bg-white text-base text-slate-900',
                'transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20',
                'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50',
                'dark:focus:border-amber-400',
              )}
              aria-describedby="language-hint"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
            </select>
            <p id="language-hint" className="text-xs text-slate-500 dark:text-slate-400">
              Idiomas adicionais disponíveis em breve.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Danger Zone ── */}
      <section
        className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-slate-900"
        aria-labelledby="danger-heading"
      >
        <h2
          id="danger-heading"
          className="mb-1 font-display text-base font-bold text-red-700 dark:text-red-400"
        >
          Encerrar sessão
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Você será desconectado de todos os dispositivos.
        </p>

        <button
          onClick={logout}
          className={cn(
            'flex h-12 w-full items-center justify-center rounded-xl md:w-auto md:px-6',
            'border border-red-200 bg-white text-base font-semibold text-red-700',
            'transition-colors hover:bg-red-50',
            'dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
          )}
        >
          Sair da conta
        </button>
      </section>
    </div>
  )
}
