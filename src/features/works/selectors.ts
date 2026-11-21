import { WORK_TYPES, type Work, type WorkType } from './types.ts'

/**
 * 視聴日の新しい順に並べる。
 * 視聴日のない作品 (見たい など) は末尾にまとめ、追加の新しい順 (JSON で後ろにあるものが先) にする。
 */
export function sortByWatchedOnDesc(works: readonly Work[]): Work[] {
  return works
    .map((work, index) => ({ work, index }))
    .sort((a, b) => {
      const [x, y] = [a.work.watchedOn, b.work.watchedOn]
      if (x && y) return y.localeCompare(x) || b.index - a.index
      if (x) return -1
      if (y) return 1
      return b.index - a.index
    })
    .map(({ work }) => work)
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
