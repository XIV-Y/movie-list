import { formatDate } from '../format.ts'
import { WATCH_STATUS_LABELS, type Work } from '../types.ts'
import { RatingStars } from './RatingStars'
import { WorkTypeBadge } from './WorkTypeBadge'

export function WorkCard({ work }: { work: Work }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <WorkTypeBadge type={work.type} />
        {work.releaseYear !== undefined && <span>{work.releaseYear}年</span>}
        {work.status !== 'watched' && (
          <span className="ml-auto rounded-full border border-zinc-300 px-2 py-0.5 dark:border-zinc-700">
            {WATCH_STATUS_LABELS[work.status]}
          </span>
        )}
      </div>

      <h3 className="text-base font-bold leading-snug break-words">{work.title}</h3>

      {work.note && <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{work.note}</p>}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        {work.rating !== undefined && <RatingStars rating={work.rating} />}
        {work.watchedOn && (
          <time dateTime={work.watchedOn}>{formatDate(work.watchedOn)} 視聴</time>
        )}
      </div>

      {work.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="タグ">
          {work.tags.map((tag) => (
            <li key={tag} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
