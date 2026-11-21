import type { Work } from '../types.ts'
import { WorkCard } from './WorkCard'

export function WorkList({ works }: { works: readonly Work[] }) {
  if (works.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-12 text-center dark:border-zinc-700">
        <p className="font-medium">まだ記録がありません</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">見た作品を記録していきましょう。</p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {works.map((work) => (
        <li key={work.id}>
          <WorkCard work={work} />
        </li>
      ))}
    </ul>
  )
}
