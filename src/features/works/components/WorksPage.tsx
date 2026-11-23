import type { ReactNode } from 'react'

type Props = {
  summary: ReactNode
  /** 表示方法の切り替え・並び替え */
  toolbar: ReactNode
  list: ReactNode
}

/** TOP ページの骨組み */
export function WorksPage({ summary, toolbar, list }: Props) {
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
        {list}
      </section>
    </div>
  )
}
