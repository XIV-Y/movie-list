import { formatDate } from '../format.ts'
import { WATCH_STATUS_LABELS, type Work } from '../types.ts'
import { RatingStars } from './RatingStars'
import { WorkPoster } from './WorkPoster'
import { WorkTypeBadge } from './WorkTypeBadge'

/** WorkList のグリッド列数に合わせた画像の表示幅 */
const POSTER_SIZES = '(min-width: 1024px) 190px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw'

export function WorkCard({ work }: { work: Work }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative">
        <WorkPoster work={work} sizes={POSTER_SIZES} />
        {work.status !== 'watched' && (
          <span className="absolute top-2 right-2 rounded-full bg-zinc-950/75 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {WATCH_STATUS_LABELS[work.status]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <WorkTypeBadge type={work.type} />
          {work.releaseYear !== undefined && <span>{work.releaseYear}年</span>}
        </div>

        <h3 className="line-clamp-2 text-sm font-bold leading-snug break-words">{work.title}</h3>

        {work.note && <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">{work.note}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {work.rating !== undefined && <RatingStars rating={work.rating} />}
          {work.watchedOn && <time dateTime={work.watchedOn}>{formatDate(work.watchedOn)}</time>}
        </div>

        {work.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1" aria-label="タグ">
            {work.tags.map((tag) => (
              <li key={tag} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
