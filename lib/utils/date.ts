/**
 * lib/utils/date.ts
 *
 * Calendar-date helpers. A transaction's date is a *calendar date* (the
 * day the driver earned/spent), not an instant in time. Converting such a
 * date through `new Date(...)` + timezone shifts it across midnight in
 * negative-offset zones (e.g. Brazil UTC-3), which is the root cause of
 * the "added today, shows as yesterday" bug.
 *
 * Rule of thumb: capture, compare, and display these dates as plain
 * "YYYY-MM-DD" strings. Never round-trip them through UTC.
 */

/**
 * Today's calendar date in the runtime's LOCAL timezone, as "YYYY-MM-DD".
 * Uses local get* accessors (not toISOString, which is UTC).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Extract the "YYYY-MM-DD" calendar date from a stored transaction_date
 * (which is an ISO timestamp like "2026-07-03T00:00:00Z"). Pure string
 * slice — no Date object, no timezone conversion.
 */
export function getDatePart(isoTimestamp: string): string {
  return isoTimestamp.split('T')[0]
}

/**
 * Format a "YYYY-MM-DD" calendar date for display in pt-BR, WITHOUT
 * timezone shifting. Builds the Date from local components so the day
 * never rolls back a day.
 */
export function formatCalendarDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const [year, month, day] = getDatePart(dateStr).split('-').map(Number)
  // Month is 0-indexed; constructing with local components keeps the day intact.
  const localDate = new Date(year, month - 1, day)
  return localDate.toLocaleDateString('pt-BR', options)
}
