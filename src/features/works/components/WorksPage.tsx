import type { ReactNode } from 'react'

/** TOP ページの骨組み。実際の画面とスケルトンで共通にして、切り替え時に寸法が変わらないようにする */
export function WorksPage({ summary, list }: { summary: ReactNode; list: ReactNode }) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="summary-heading" className="space-y-3">
        <h1 id="summary-heading" className="text-xl font-bold">
          視聴記録
        </h1>
        {summary}
      </section>

      <section aria-labelledby="list-heading" className="space-y-3">
        <h2 id="list-heading" className="text-lg font-bold">
          最近の記録
        </h2>
        {list}
      </section>
    </div>
  )
}
