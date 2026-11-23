import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { WorkFilterBar } from '../features/works/components/WorkFilterBar'
import { WorkGroupedList } from '../features/works/components/WorkGroupedList'
import { WorkSection } from '../features/works/components/WorkSection'
import { WorkSummaryStats } from '../features/works/components/WorkSummaryStats'
import { WorksPage } from '../features/works/components/WorksPage'
import { applyWorkFilters, groupWorksByTag, parseWorkFilters, type WorkFilters } from '../features/works/filters'
import { getWorks } from '../features/works/repository'
import { summarizeWorks } from '../features/works/selectors'

export const Route = createFileRoute('/')({
  // 表示方法・並び替えの条件は URL の検索パラメータに保持する (?view=tags&sort=title)
  validateSearch: (search): WorkFilters => parseWorkFilters(search),
  loader: () => getWorks(),
  component: Home,
})

function Home() {
  const works = Route.useLoaderData()
  const search = Route.useSearch()
  // HTML はビルド時に「条件なし」で生成している。ハイドレーションが終わるまでは同じ内容で描画し、
  // その後に URL の条件を適用する (先に適用すると HTML と食い違ってハイドレーションエラーになる)
  const hydrated = useHydrated()
  const filters: WorkFilters = hydrated ? search : {}
  const navigate = Route.useNavigate()
  const results = applyWorkFilters(works, filters)

  // 入力のたびに履歴が増えないよう replace で URL を更新する
  const setFilters = (next: WorkFilters) => navigate({ search: next, replace: true })

  return (
    <WorksPage
      summary={<WorkSummaryStats summary={summarizeWorks(works)} />}
      toolbar={<WorkFilterBar value={filters} onChange={setFilters} />}
      list={
        // タグ別表示 (?view=tags)。記録が 0 件のときは「すべて」と同じ表示 (まだ記録がありません) にする。
        // 「すべて」でもタグ別と同じ見出し行 (名前と件数) を出し、切り替えても一覧の位置が変わらないようにする
        filters.view === 'tags' && results.length > 0 ? (
          <WorkGroupedList groups={groupWorksByTag(results)} />
        ) : (
          <WorkSection id="all-works" label="すべて" works={results} />
        )
      }
    />
  )
}
