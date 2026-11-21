import type { ReactNode } from 'react'

type Props = {
  summary: ReactNode
  /** 絞り込み・並び替え */
  toolbar: ReactNode
  /** 表示件数 (1 行分の高さを常に確保する) */
  resultInfo: ReactNode
  list: ReactNode
}

/** TOP ページの骨組み */
export function WorksPage({ summary, toolbar, resultInfo, list }: Props) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="summary-heading" className="space-y-3">
        <h1 id="summary-heading" className="text-xl font-bold">
          視聴記録
        </h1>
        {summary}
      </section>

      <section aria-labelledby="list-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="list-heading" className="text-lg font-bold">
            記録一覧
          </h2>
          <div className="w-full sm:w-auto">{toolbar}</div>
        </div>
        <p className="h-5 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
          {resultInfo}
        </p>
        {list}
      </section>
    </div>
  )
}
