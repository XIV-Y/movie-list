import type { WorkSummary } from '../selectors'
import { WORK_TYPES, WORK_TYPE_LABELS } from '../types'

export function WorkSummaryStats({ summary }: { summary: WorkSummary }) {
  const items = [
    { label: 'すべて', count: summary.total },
    ...WORK_TYPES.map((type) => ({ label: WORK_TYPE_LABELS[type], count: summary.byType[type] })),
  ]

  return (
    <dl className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {items.map(({ label, count }, i) => (
        <div
          key={label}
          className={`rounded-xl border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900 ${i === 0 ? 'col-span-3 sm:col-span-1' : ''}`}
        >
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums">
            {count}
            <span className="ml-0.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">件</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
