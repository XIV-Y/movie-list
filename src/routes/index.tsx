import { createFileRoute } from '@tanstack/react-router'
import { WorkList } from '../features/works/components/WorkList'
import { WorkSummaryStats } from '../features/works/components/WorkSummaryStats'
import { WorksPage } from '../features/works/components/WorksPage'
import { getWorks } from '../features/works/repository'
import { sortNewestFirst, summarizeWorks } from '../features/works/selectors'

export const Route = createFileRoute('/')({
  loader: () => getWorks(),
  component: Home,
})

function Home() {
  const works = Route.useLoaderData()

  return (
    <WorksPage
      summary={<WorkSummaryStats summary={summarizeWorks(works)} />}
      list={<WorkList works={sortNewestFirst(works)} />}
    />
  )
}
