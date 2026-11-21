import { createFileRoute } from '@tanstack/react-router'
import { WorkList } from '../features/works/components/WorkList'
import { WorkSummaryStats } from '../features/works/components/WorkSummaryStats'
import { getWorks } from '../features/works/repository'
import { sortNewestFirst, summarizeWorks } from '../features/works/selectors'

export const Route = createFileRoute('/')({
  loader: () => getWorks(),
  component: Home,
})

function Home() {
  const works = Route.useLoaderData()
  const sorted = sortNewestFirst(works)

  return (
    <div className="space-y-8">
      <section aria-labelledby="summary-heading" className="space-y-3">
        <h1 id="summary-heading" className="text-xl font-bold">
          視聴記録
        </h1>
        <WorkSummaryStats summary={summarizeWorks(works)} />
      </section>

      <section aria-labelledby="list-heading" className="space-y-3">
        <h2 id="list-heading" className="text-lg font-bold">
          最近の記録
        </h2>
        <WorkList works={sorted} />
      </section>
    </div>
  )
}
