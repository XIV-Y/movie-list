import { WORK_TYPE_LABELS, type WorkType } from '../types'

const STYLES: Record<WorkType, string> = {
  movie: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  drama: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  anime: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  other: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700/50 dark:text-zinc-300',
}

export function WorkTypeBadge({ type }: { type: WorkType }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${STYLES[type]}`}>
      {WORK_TYPE_LABELS[type]}
    </span>
  )
}
