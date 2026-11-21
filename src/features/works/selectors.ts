import { WORK_TYPES, type Work, type WorkType } from './types.ts'

/** 追加の新しい順に並べる (JSON では後ろにあるものほど新しい) */
export function sortNewestFirst(works: readonly Work[]): Work[] {
  return [...works].reverse()
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
