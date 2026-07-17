export function formatDateToYYYYMMDD(date: Date): string {
  // Frontmatter dates (e.g. `2026-07-12`) are parsed as UTC midnight. Use the
  // UTC components so the displayed date matches the author's intended calendar
  // date regardless of the viewer's timezone (otherwise viewers west of UTC see
  // the previous day).
  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = date.getUTCDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}
