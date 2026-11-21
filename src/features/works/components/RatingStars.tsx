import { RATING_MAX } from '../types'

export function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex text-sm leading-none" role="img" aria-label={`評価 ${rating} / ${RATING_MAX}`}>
      {Array.from({ length: RATING_MAX }, (_, i) => (
        <span key={i} aria-hidden className={i < rating ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}>
          ★
        </span>
      ))}
    </span>
  )
}
