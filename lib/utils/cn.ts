/**
 * lib/utils/cn.ts
 *
 * Class name utility for combining Tailwind CSS classes with shadcn/ui.
 * Merges Tailwind classes intelligently (handles conflicting utilities).
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge CSS class names, resolving Tailwind conflicts.
 *
 * @example
 * cn('px-4 py-2', 'px-6') // → 'py-2 px-6' (px-6 overrides px-4)
 * cn('text-red-500', condition && 'text-blue-500') // conditional class
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
