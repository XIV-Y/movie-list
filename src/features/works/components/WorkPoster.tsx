import { useCallback, useState } from 'react'
import { isPosterAvailable, posterSrcSet, posterUrl } from '../poster-image.ts'
import type { Work } from '../types.ts'

type Props = {
  work: Pick<Work, 'title' | 'catalog'>
  /** 表示幅のヒント (img の sizes 属性) */
  sizes: string
}

/**
 * 2:3 のポスター画像。枠の寸法は先に確保するのでレイアウトシフトは起きない。
 * 読み込み中は背景を点滅させる。画像自体は JavaScript なしでも表示されるよう、透明にはしない。
 * ポスターがない作品はタイトル入りのプレースホルダーを表示する。
 */
export function WorkPoster({ work, sizes }: Props) {
  const posterPath = isPosterAvailable() ? work.catalog?.posterPath : undefined
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  // キャッシュ済みの画像は onLoad より前に読み込みが終わっていることがあるので、マウント時にも確認する
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setStatus('loaded')
  }, [])

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800 ${
        posterPath && status === 'loading' ? 'animate-pulse motion-reduce:animate-none' : ''
      }`}
    >
      {posterPath ? (
        <img
          ref={imgRef}
          src={posterUrl(posterPath)}
          srcSet={posterSrcSet(posterPath)}
          sizes={sizes}
          alt={`${work.title} のポスター`}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          // 読み込みに失敗したときは画像を出さず、背景のプレースホルダーのままにする
          onError={() => setStatus('error')}
          className={`size-full object-cover ${status === 'error' ? 'invisible' : ''}`}
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
