import type { WorkGroup } from '../filters.ts'
import { WorkList } from './WorkList'

/** タグ別表示: タグ名を見出しにして、タグごとに作品をまとめて並べる */
export function WorkGroupedList({ groups }: { groups: readonly WorkGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map(({ tag, works }, i) => {
        // タグ名には空白などが含まれうるので、id には並び順を使う
        const headingId = `tag-group-${i}`
        return (
          <section key={tag ?? ''} aria-labelledby={headingId} className="space-y-3">
            <h3 id={headingId} className="flex items-baseline gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
              <span className={`text-base font-bold ${tag ? '' : 'text-zinc-500 dark:text-zinc-400'}`}>{tag ?? 'タグなし'}</span>
              <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{works.length} 件</span>
            </h3>
            <WorkList works={works} titleAs="h4" />
          </section>
        )
      })}
    </div>
  )
}
