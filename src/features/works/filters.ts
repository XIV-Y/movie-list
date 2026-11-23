import { sortNewestFirst } from './selectors.ts'
import { WORK_TYPES, type Work, type WorkType } from './types.ts'

export const SORT_KEYS = ['added', 'year-desc', 'year-asc', 'title'] as const
export type SortKey = (typeof SORT_KEYS)[number]

export const SORT_LABELS: Record<SortKey, string> = {
  added: '追加の新しい順',
  'year-desc': '公開年の新しい順',
  'year-asc': '公開年の古い順',
  title: 'タイトル順',
}

/** 一覧の表示方法: すべてを 1 つの一覧で表示 / タグごとにまとめて表示 */
export const VIEW_KEYS = ['all', 'tags'] as const
export type ViewKey = (typeof VIEW_KEYS)[number]

export const VIEW_LABELS: Record<ViewKey, string> = {
  all: 'すべて',
  tags: 'タグ別',
}

export const DEFAULT_VIEW = 'all' satisfies ViewKey

export const DEFAULT_SORT = 'added' satisfies SortKey
type NonDefaultSort = Exclude<SortKey, typeof DEFAULT_SORT>
const NON_DEFAULT_SORTS = SORT_KEYS.filter((k): k is NonDefaultSort => k !== DEFAULT_SORT)

/**
 * 一覧の表示方法・絞り込み (種別)・並び替えの条件。URL の検索パラメータに保持する。
 * 既定値 (すべて表示・すべての種別・追加の新しい順) の項目は undefined にして URL に出さない。
 */
export type WorkFilters = {
  view?: Exclude<ViewKey, typeof DEFAULT_VIEW>
  type?: WorkType
  sort?: NonDefaultSort
}

function pick<T extends string>(value: unknown, values: readonly T[]): T | undefined {
  return typeof value === 'string' && values.includes(value as T) ? (value as T) : undefined
}

/** URL の検索パラメータを検証する。不正な値や廃止した項目 (q / status) は無視する */
export function parseWorkFilters(search: Record<string, unknown>): WorkFilters {
  return {
    view: pick(search.view, ['tags'] as const),
    type: pick(search.type, WORK_TYPES),
    sort: pick(search.sort, NON_DEFAULT_SORTS),
  }
}

export function hasActiveFilters(filters: WorkFilters): boolean {
  return Boolean(filters.type)
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
  const matched = works.filter((work) => !filters.type || work.type === filters.type)
  return sortWorks(matched, filters.sort ?? DEFAULT_SORT)
}

export type WorkGroup = {
  /** タグ名。タグのない作品のグループは null */
  tag: string | null
  works: Work[]
}

const tagCollator = new Intl.Collator('ja', { numeric: true, sensitivity: 'base' })

/**
 * 作品をタグごとにまとめる (並び順は works の順を保つ)。
 * 複数のタグを持つ作品はそれぞれのグループに入る。グループはタグ名順で、タグのない作品は最後。
 */
export function groupWorksByTag(works: readonly Work[]): WorkGroup[] {
  const groups = new Map<string, Work[]>()
  const untagged: Work[] = []
  for (const work of works) {
    if (!work.tags?.length) untagged.push(work)
    for (const tag of work.tags ?? []) groups.set(tag, [...(groups.get(tag) ?? []), work])
  }
  const tagged = [...groups].sort(([a], [b]) => tagCollator.compare(a, b)).map(([tag, ws]) => ({ tag, works: ws }))
  return untagged.length > 0 ? [...tagged, { tag: null, works: untagged }] : tagged
}
