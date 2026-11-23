import { DEFAULT_SORT, DEFAULT_VIEW, SORT_KEYS, SORT_LABELS, VIEW_KEYS, VIEW_LABELS, type WorkFilters } from '../filters.ts'

type Props = {
  value: WorkFilters
  onChange: (next: WorkFilters) => void
}

const CONTROL =
  'h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ' +
  'focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400/40 ' +
  'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'

/** 一覧の表示方法 (すべて / タグ別) と並び替え */
export function WorkFilterBar({ value, onChange }: Props) {
  // 既定値の項目は undefined にして URL に出さない
  const update = (patch: Partial<Record<keyof WorkFilters, string>>) => {
    const next: Record<string, string | undefined> = { ...value, ...patch }
    for (const key of Object.keys(next)) {
      if (!next[key] || (key === 'sort' && next[key] === DEFAULT_SORT) || (key === 'view' && next[key] === DEFAULT_VIEW)) {
        next[key] = undefined
      }
    }
    onChange(next as WorkFilters)
  }

  return (
    <div role="group" aria-label="表示方法と並び替え" className="grid grid-cols-2 gap-2 sm:flex">
      {/* 表示方法の切り替え (セグメントボタン) */}
      <div
        role="group"
        aria-label="表示方法"
        className="grid h-10 grid-cols-2 rounded-lg border border-zinc-300 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800"
      >
        {VIEW_KEYS.map((view) => {
          const active = (value.view ?? DEFAULT_VIEW) === view
          return (
            <button
              key={view}
              type="button"
              aria-pressed={active}
              onClick={() => update({ view })}
              className={`rounded-md px-3 text-sm transition-colors motion-reduce:transition-none ${
                active
                  ? 'bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {VIEW_LABELS[view]}
            </button>
          )
        })}
      </div>

      <label>
        <span className="sr-only">並び順</span>
        <select value={value.sort ?? DEFAULT_SORT} onChange={(e) => update({ sort: e.target.value })} className={`${CONTROL} w-full`}>
          {SORT_KEYS.map((k) => (
            <option key={k} value={k}>
              {SORT_LABELS[k]}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
