import type { WorkGroup } from '../filters.ts'
import { WorkSection } from './WorkSection'

/** タグ別表示: タグ名を見出しにして、タグごとに作品をまとめて並べる */
export function WorkGroupedList({ groups }: { groups: readonly WorkGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map(({ tag, works }, i) => (
        // タグ名には空白などが含まれうるので、id には並び順を使う
        <WorkSection key={tag ?? ''} id={`tag-group-${i}`} label={tag ?? 'タグなし'} muted={tag === null} works={works} />
      ))}
    </div>
  )
}
