/**
 * Orders CV entries most recent first, by start date.
 *
 * Within a list every `start` shares one format — `YYYY-MM` for experience, `YYYY` for
 * education and courses — so a plain string comparison sorts them correctly and no date
 * parsing is needed. Returns a new array: the source is the TanStack Query cache.
 */
export function byStartDesc<T extends {start: string}>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => b.start.localeCompare(a.start))
}
