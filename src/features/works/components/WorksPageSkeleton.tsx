import { getWorks } from '../repository.ts'
import { WORK_GRID_CLASS, WorkList } from './WorkList'
import { WorkFilterBar } from './WorkFilterBar'
import { WorkCardSkeleton } from './WorkCardSkeleton'
import { WorkSummaryStats } from './WorkSummaryStats'
import { WorksPage } from './WorksPage'

/**
 * TOP ページの読み込み中表示。JavaScript の読み込み前 (ビルド時の HTML) に表示し、
 * 実際の画面と同じ骨組み・同じ件数のカードで、切り替え時のレイアウトシフトを防ぐ。
 */
export function WorksPageSkeleton() {
  // 記録はビルドに含まれているので、件数は実際と同じにできる
  const count = getWorks().length

  return (
    <div aria-busy="true">
      <p className="sr-only" role="status">
        読み込み中…
      </p>
      <WorksPage
        summary={<WorkSummaryStats />}
        // 検索バーも同じ寸法で表示しておく (操作は読み込み後から)
        toolbar={<WorkFilterBar value={{}} onChange={() => {}} disabled />}
        resultInfo={`${count} 件`}
        list={
          // 0 件のときは実際の画面と同じ「まだ記録がありません」を出す
          count === 0 ? (
            <WorkList works={[]} />
          ) : (
            <ul className={WORK_GRID_CLASS} aria-hidden>
              {Array.from({ length: count }, (_, i) => (
                <li key={i}>
                  <WorkCardSkeleton />
                </li>
              ))}
            </ul>
          )
        }
      />
    </div>
  )
}
