import { WORK_TYPES, type Work, type WorkType } from './types.ts'

/**
 * 視聴日の新しい順に並べる。
 * 視聴日のない作品 (見たい など) は末尾にまとめ、登録の新しい順にする。
 */
export function sortByWatchedOnDesc(works: readonly Work[]): Work[] {
  return [...works].sort((a, b) => {
    if (a.watchedOn && b.watchedOn) return b.watchedOn.localeCompare(a.watchedOn)
    if (a.watchedOn) return -1
    if (b.watchedOn) return 1
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export type WorkSummary = {
  total: number
  byType: Record<WorkType, number>
}

export function summarizeWorks(works: readonly Work[]): WorkSummary {
  const byType = Object.fromEntries(WORK_TYPES.map((t) => [t, 0])) as Record<WorkType, number>
  for (const work of works) byType[work.type]++
  return { total: works.length, byType }
}
