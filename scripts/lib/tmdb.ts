/**
 * CATALOG (作品データベース) API クライアント。手元のスクリプト専用。
 * トークンは環境変数 CATALOG_API_TOKEN から読む。サイトのコードからは import しないこと。
 * https://example.invalid
 */
import type { CatalogMediaType, WorkType } from '../../src/features/works/types.ts'

const API_BASE = 'https://example.invalid'
const LANGUAGE = 'ja-JP'

/** CATALOG のジャンル ID */
const GENRE = {
  animation: 16,
  documentary: 99,
  reality: 10764,
  talk: 10767,
} as const

export type CatalogSearchResult = {
  id: number
  mediaType: CatalogMediaType
  title: string
  originalTitle: string
  releaseYear?: number
  posterPath?: string
  overview: string
}

export type CatalogDetails = CatalogSearchResult & {
  genreIds: number[]
}

export class CatalogError extends Error {
  override name = 'CatalogError'
}

function getToken(): string {
  const token = process.env.CATALOG_API_TOKEN
  if (!token) {
    throw new CatalogError(
      [
        '環境変数 CATALOG_API_TOKEN が設定されていません。',
        'CATALOG の「API Read Access Token」を ~/.config/movie-list/env に次の形式で保存してください:',
        '  CATALOG_API_TOKEN=eyJ...',
        '(リポジトリ内には置かないでください)',
      ].join('\n'),
    )
  }
  return token
}

async function request<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  for (const [key, value] of Object.entries({ language: LANGUAGE, ...params })) {
    url.searchParams.set(key, value)
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
  })
  if (!res.ok) {
    const hint = res.status === 401 ? ' (トークンが正しいか確認してください)' : ''
    throw new CatalogError(`CATALOG API エラー: ${res.status} ${res.statusText}${hint}`)
  }
  return (await res.json()) as T
}

type RawResult = {
  id: number
  media_type?: string
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  release_date?: string
  first_air_date?: string
  poster_path?: string | null
  overview?: string
  genre_ids?: number[]
  genres?: { id: number }[]
}

function toResult(raw: RawResult, mediaType: CatalogMediaType): CatalogDetails {
  const date = mediaType === 'movie' ? raw.release_date : raw.first_air_date
  const year = date ? Number(date.slice(0, 4)) : Number.NaN
  return {
    id: raw.id,
    mediaType,
    title: (mediaType === 'movie' ? raw.title : raw.name) ?? '',
    originalTitle: (mediaType === 'movie' ? raw.original_title : raw.original_name) ?? '',
    releaseYear: Number.isInteger(year) ? year : undefined,
    posterPath: raw.poster_path ?? undefined,
    overview: raw.overview ?? '',
    genreIds: raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? [],
  }
}

/** 映画・TV 番組をまとめてキーワード検索する (人物などは除外) */
export async function searchWorks(query: string): Promise<CatalogSearchResult[]> {
  const data = await request<{ results: RawResult[] }>('/search/multi', { query, include_adult: 'false' })
  return data.results
    .filter((r): r is RawResult & { media_type: CatalogMediaType } => r.media_type === 'movie' || r.media_type === 'tv')
    .map((r) => toResult(r, r.media_type))
}

/** 作品の詳細を日本語で取得する */
export async function getWorkDetails(mediaType: CatalogMediaType, id: number): Promise<CatalogDetails> {
  const raw = await request<RawResult>(`/${mediaType}/${id}`)
  return toResult(raw, mediaType)
}

/** CATALOG のジャンルと区分から、このアプリの種別を推定する */
export function inferWorkType(details: Pick<CatalogDetails, 'mediaType' | 'genreIds'>): WorkType {
  const genres = new Set(details.genreIds)
  if (genres.has(GENRE.animation)) return 'anime'
  if (genres.has(GENRE.documentary) || genres.has(GENRE.reality) || genres.has(GENRE.talk)) return 'other'
  return details.mediaType === 'movie' ? 'movie' : 'drama'
}
