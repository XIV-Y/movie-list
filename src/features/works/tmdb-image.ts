/** CATALOG 画像 CDN のポスターサイズ (幅 px) */
const POSTER_WIDTHS = [185, 342, 500] as const
type PosterWidth = (typeof POSTER_WIDTHS)[number]

const IMAGE_BASE = 'https://image.catalog.org/t/p'

/** ポスター画像の URL。トークン不要の公開 CDN を直接参照する */
export function posterUrl(posterPath: string, width: PosterWidth = 342): string {
  return `${IMAGE_BASE}/w${width}${posterPath}`
}

/** 画面幅に応じて適切なサイズを選ばせるための srcset */
export function posterSrcSet(posterPath: string): string {
  return POSTER_WIDTHS.map((w) => `${posterUrl(posterPath, w)} ${w}w`).join(', ')
}
