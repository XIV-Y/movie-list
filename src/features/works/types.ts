/** 作品の種別 */
export const WORK_TYPES = ['movie', 'drama', 'anime', 'other'] as const
export type WorkType = (typeof WORK_TYPES)[number]

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  movie: '映画',
  drama: 'ドラマ',
  anime: 'アニメ',
  other: 'その他',
}

/** 視聴ステータス */
export const WATCH_STATUSES = ['watched', 'watching', 'want'] as const
export type WatchStatus = (typeof WATCH_STATUSES)[number]

export const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
  watched: '見た',
  watching: '見ている',
  want: '見たい',
}

/** 評価の範囲 (1〜5) */
export const RATING_MIN = 1
export const RATING_MAX = 5

/** 外部の作品データベース上の作品の区分 */
export const CATALOG_MEDIA_TYPES = ['movie', 'tv'] as const
export type CatalogMediaType = (typeof CATALOG_MEDIA_TYPES)[number]

/** 外部の作品データベースから取得した作品情報 */
export type CatalogRef = {
  id: number
  mediaType: CatalogMediaType
  /** ポスター画像のパス (例: "/abc123.jpg")。画像 CDN の URL 生成に使う */
  posterPath?: string
}

/** 視聴記録として保存する映像作品 */
export type Work = {
  id: string
  title: string
  type: WorkType
  status: WatchStatus
  /** 公開・放送開始年 */
  releaseYear?: number
  /** 視聴日 (YYYY-MM-DD) */
  watchedOn?: string
  /** 評価 (RATING_MIN〜RATING_MAX) */
  rating?: number
  /** 感想メモ */
  note?: string
  tags: string[]
  /** 作品データベースから登録した作品のみ */
  catalog?: CatalogRef
  /** 作成日時 (ISO 8601) */
  createdAt: string
  /** 更新日時 (ISO 8601) */
  updatedAt: string
}
