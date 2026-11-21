import type { WorkSummary } from '../selectors.ts'
import { WORK_TYPES, WORK_TYPE_LABELS } from '../types.ts'

/** summary を省略するとスケルトン (件数部分だけ読み込み中の表示) になる */
export function WorkSummaryStats({ summary }: { summary?: WorkSummary }) {
  const items = [
    { label: 'すべて', count: summary?.total },
    ...WORK_TYPES.map((type) => ({ label: WORK_TYPE_LABELS[type], count: summary?.byType[type] })),
  ]

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {items.map(({ label, count }, i) => (
        <div
          key={label}
          className={`rounded-xl border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900 ${i === 0 ? 'col-span-2 sm:col-span-1' : ''}`}
        >
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums">
            {count === undefined ? (
              // 実際の数字と同じ行の高さを保つため、透明な文字を入れておく
              <span className="inline-block animate-pulse rounded bg-zinc-200 text-transparent motion-reduce:animate-none dark:bg-zinc-800">
                00
              </span>
            ) : (
              count
            )}
            <span className="ml-0.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">件</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
