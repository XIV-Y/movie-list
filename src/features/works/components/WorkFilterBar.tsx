import { DEFAULT_SORT, SORT_KEYS, SORT_LABELS, type WorkFilters } from '../filters.ts'
import { WORK_TYPES, WORK_TYPE_LABELS } from '../types.ts'

type Props = {
  value: WorkFilters
  onChange: (next: WorkFilters) => void
  /** 読み込み中 (スケルトン) は操作できないようにする */
  disabled?: boolean
}

const CONTROL =
  'h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ' +
  'focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400/40 disabled:opacity-60 ' +
  'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'

/** 一覧の絞り込み (種別) と並び替え */
export function WorkFilterBar({ value, onChange, disabled }: Props) {
  // 既定値の項目は undefined にして URL に出さない
  const update = (patch: Partial<Record<keyof WorkFilters, string>>) => {
    const next: Record<string, string | undefined> = { ...value, ...patch }
    for (const key of Object.keys(next)) if (!next[key] || (key === 'sort' && next[key] === DEFAULT_SORT)) next[key] = undefined
    onChange(next as WorkFilters)
  }

  return (
    <div role="group" aria-label="絞り込みと並び替え" className="grid grid-cols-2 gap-2 sm:flex">
      <label>
        <span className="sr-only">種別</span>
        <select value={value.type ?? ''} onChange={(e) => update({ type: e.target.value })} disabled={disabled} className={`${CONTROL} w-full`}>
          <option value="">すべての種別</option>
          {WORK_TYPES.map((t) => (
            <option key={t} value={t}>
              {WORK_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">並び順</span>
        <select value={value.sort ?? DEFAULT_SORT} onChange={(e) => update({ sort: e.target.value })} disabled={disabled} className={`${CONTROL} w-full`}>
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
