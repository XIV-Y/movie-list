import { sortNewestFirst } from './selectors.ts'
import { WATCH_STATUSES, WORK_TYPES, type WatchStatus, type Work, type WorkType } from './types.ts'

export const SORT_KEYS = ['added', 'year-desc', 'year-asc', 'title'] as const
export type SortKey = (typeof SORT_KEYS)[number]

export const SORT_LABELS: Record<SortKey, string> = {
  added: '追加の新しい順',
  'year-desc': '公開年の新しい順',
  'year-asc': '公開年の古い順',
  title: 'タイトル順',
}

export const DEFAULT_SORT = 'added' satisfies SortKey
type NonDefaultSort = Exclude<SortKey, typeof DEFAULT_SORT>
const NON_DEFAULT_SORTS = SORT_KEYS.filter((k): k is NonDefaultSort => k !== DEFAULT_SORT)

/**
 * 一覧の検索・絞り込み・並び替えの条件。URL の検索パラメータに保持する。
 * 既定値 (条件なし・追加の新しい順) の項目は undefined にして URL に出さない。
 */
export type WorkFilters = {
  q?: string
  type?: WorkType
  status?: WatchStatus
  sort?: NonDefaultSort
}

function pick<T extends string>(value: unknown, values: readonly T[]): T | undefined {
  return typeof value === 'string' && values.includes(value as T) ? (value as T) : undefined
}

/** URL の検索パラメータを検証する。不正な値は無視して既定値として扱う */
export function parseWorkFilters(search: Record<string, unknown>): WorkFilters {
  // 入力中の空白 (単語の区切りなど) を消さないよう、q はそのまま保持する。空白だけなら条件なし
  const q = typeof search.q === 'string' && search.q.trim() !== '' ? search.q : undefined
  return {
    q,
    type: pick(search.type, WORK_TYPES),
    status: pick(search.status, WATCH_STATUSES),
    sort: pick(search.sort, NON_DEFAULT_SORTS),
  }
}

export function hasActiveFilters(filters: WorkFilters): boolean {
  return Boolean(filters.q || filters.type || filters.status)
}

/** 検索用に表記ゆれをそろえる (全角・半角、大文字・小文字、前後・連続の空白) */
export function normalizeForSearch(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
}

const titleCollator = new Intl.Collator('ja', { numeric: true, sensitivity: 'base' })

function sortWorks(works: readonly Work[], sort: SortKey): Work[] {
  // 同じ順位の作品は追加の新しい順にする
  const base = sortNewestFirst(works)
  const yearOf = (w: Work) => w.releaseYear
  switch (sort) {
    case 'added':
      return base
    case 'title':
      return base.sort((a, b) => titleCollator.compare(a.title, b.title))
    case 'year-desc':
    case 'year-asc': {
      const dir = sort === 'year-desc' ? -1 : 1
      return base.sort((a, b) => {
        const [x, y] = [yearOf(a), yearOf(b)]
        // 公開年のない作品は常に末尾
        if (x === undefined || y === undefined) return (x === undefined ? 1 : 0) - (y === undefined ? 1 : 0)
        return (x - y) * dir
      })
    }
  }
}

export function applyWorkFilters(works: readonly Work[], filters: WorkFilters): Work[] {
  const keywords = filters.q ? normalizeForSearch(filters.q).split(' ') : []
  const matched = works.filter(
    (work) =>
      (!filters.type || work.type === filters.type) &&
      (!filters.status || work.status === filters.status) &&
      keywords.every((k) => normalizeForSearch(work.title).includes(k)),
  )
  return sortWorks(matched, filters.sort ?? DEFAULT_SORT)
}
