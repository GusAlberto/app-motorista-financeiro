'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const colors: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900',
      border: 'border-emerald-200 dark:border-emerald-700',
      icon: <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900',
      border: 'border-red-200 dark:border-red-700',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />,
    },
    info: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      border: 'border-slate-300 dark:border-slate-700',
      icon: <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />,
    },
  }

  const config = colors[type]

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-xl p-4 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-4`}
      role="alert"
    >
      {config.icon}
      <p
        className={`flex-1 text-sm font-medium ${
          type === 'success'
            ? 'text-emerald-700 dark:text-emerald-200'
            : type === 'error'
            ? 'text-red-700 dark:text-red-200'
            : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {message}
      </p>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

/**
 * Toast container for displaying multiple toasts
 */
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-sm w-full sm:bottom-4 sm:w-auto space-y-2">
      {children}
    </div>
  )
}
