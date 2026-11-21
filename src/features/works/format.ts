/** "2026-11-15" → "2026/11/15" */
export function formatDate(isoDate: string): string {
  return isoDate.replaceAll('-', '/')
}
