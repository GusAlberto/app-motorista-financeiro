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
      bg: 'bg-green-50 dark:bg-green-900',
      border: 'border-green-200 dark:border-green-700',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900',
      border: 'border-red-200 dark:border-red-700',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900',
      border: 'border-blue-200 dark:border-blue-700',
      icon: <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
  }

  const config = colors[type]

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg p-4 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-4`}
      role="alert"
    >
      {config.icon}
      <p
        className={`flex-1 text-sm font-medium ${
          type === 'success'
            ? 'text-green-700 dark:text-green-200'
            : type === 'error'
            ? 'text-red-700 dark:text-red-200'
            : 'text-blue-700 dark:text-blue-200'
        }`}
      >
        {message}
      </p>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Toast container for displaying multiple toasts
 */
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-auto space-y-2">
      {children}
    </div>
  )
}
