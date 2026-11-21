import { posterSrcSet, posterUrl } from '../catalog-image.ts'
import type { Work } from '../types.ts'

type Props = {
  work: Pick<Work, 'title' | 'catalog'>
  /** 表示幅のヒント (img の sizes 属性) */
  sizes: string
}

/** 2:3 のポスター画像。ポスターがない作品はタイトル入りのプレースホルダーを表示する */
export function WorkPoster({ work, sizes }: Props) {
  const posterPath = work.catalog?.posterPath

  return (
    <div className="relative aspect-[2/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
      {posterPath ? (
        <img
          src={posterUrl(posterPath)}
          srcSet={posterSrcSet(posterPath)}
          sizes={sizes}
          alt={`${work.title} のポスター`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-200 to-zinc-300 p-3 text-center dark:from-zinc-800 dark:to-zinc-900">
          <span aria-hidden className="text-3xl opacity-60">🎬</span>
          <span className="line-clamp-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">{work.title}</span>
        </div>
      )}
    </div>
  )
}
