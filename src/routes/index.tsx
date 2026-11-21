import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { WorkFilterBar } from '../features/works/components/WorkFilterBar'
import { WorkList } from '../features/works/components/WorkList'
import { WorkSummaryStats } from '../features/works/components/WorkSummaryStats'
import { WorksPage } from '../features/works/components/WorksPage'
import { applyWorkFilters, hasActiveFilters, parseWorkFilters, type WorkFilters } from '../features/works/filters'
import { getWorks } from '../features/works/repository'
import { summarizeWorks } from '../features/works/selectors'

export const Route = createFileRoute('/')({
  // 絞り込み・並び替えの条件は URL の検索パラメータに保持する (?type=movie&sort=title)
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
  const filtered = hasActiveFilters(filters)

  // 入力のたびに履歴が増えないよう replace で URL を更新する
  const setFilters = (next: WorkFilters) => navigate({ search: next, replace: true })
  const clearFilters = () => setFilters({ sort: filters.sort })

  return (
    <WorksPage
      summary={<WorkSummaryStats summary={summarizeWorks(works)} />}
      toolbar={<WorkFilterBar value={filters} onChange={setFilters} />}
      resultInfo={filtered ? `${works.length} 件中 ${results.length} 件` : `${works.length} 件`}
      list={
        <WorkList
          works={results}
          empty={
            filtered ? (
              <>
                <p className="font-medium">条件に一致する作品がありません</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  条件をクリア
                </button>
              </>
            ) : undefined
          }
        />
      }
    />
  )
}
