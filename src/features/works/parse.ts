import {
  RATING_MAX,
  RATING_MIN,
  CATALOG_MEDIA_TYPES,
  WATCH_STATUSES,
  WORK_TYPES,
  type CatalogInfo,
  type Work,
} from './types.ts'

/**
 * 視聴記録 JSON の内容を検証して Work[] に変換する。
 * JSON は手で編集されることがあるため、誤りがあれば場所が分かるメッセージで例外を投げる。
 * (アプリとスクリプトの両方から使うので、Node でそのまま動く書き方にしている)
 */
export function parseWorks(data: unknown): Work[] {
  if (!Array.isArray(data)) throw new WorksParseError('ルートは配列である必要があります')

  const works = data.map((item, index) => parseWork(item, `[${index}]`))

  const seenIds = new Set<string>()
  const seenCatalog = new Set<string>()
  works.forEach((work, index) => {
    if (seenIds.has(work.id)) throw new WorksParseError(`[${index}].id "${work.id}" が重複しています`)
    seenIds.add(work.id)
    if (work.catalog) {
      const key = `${work.catalog.mediaType}/${work.catalog.id}`
      if (seenCatalog.has(key)) throw new WorksParseError(`[${index}].catalog (${key}) が重複しています`)
      seenCatalog.add(key)
    }
  })

  return works
}

export class WorksParseError extends Error {
  override name = 'WorksParseError'
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function parseWork(value: unknown, at: string): Work {
  const o = asObject(value, at)
  const work: Work = {
    id: str(o, 'id', at),
    title: str(o, 'title', at),
    type: oneOf(o, 'type', WORK_TYPES, at),
    status: oneOf(o, 'status', WATCH_STATUSES, at),
    tags: strArray(o, 'tags', at),
    createdAt: dateTime(o, 'createdAt', at),
    updatedAt: dateTime(o, 'updatedAt', at),
  }

  if (o.releaseYear !== undefined) work.releaseYear = int(o, 'releaseYear', at, 1870, 2100)
  if (o.watchedOn !== undefined) {
    const v = str(o, 'watchedOn', at)
    if (!DATE_RE.test(v) || Number.isNaN(Date.parse(v))) fail(at, 'watchedOn', 'YYYY-MM-DD 形式の日付')
    work.watchedOn = v
  }
  if (o.rating !== undefined) work.rating = int(o, 'rating', at, RATING_MIN, RATING_MAX)
  if (o.note !== undefined) work.note = str(o, 'note', at)
  if (o.catalog !== undefined) work.catalog = parseCatalog(o.catalog, `${at}.catalog`)

  return work
}

function parseCatalog(value: unknown, at: string): CatalogInfo {
  const o = asObject(value, at)
  const catalog: CatalogInfo = {
    id: int(o, 'id', at, 1, Number.MAX_SAFE_INTEGER),
    mediaType: oneOf(o, 'mediaType', CATALOG_MEDIA_TYPES, at),
  }
  if (o.posterPath !== undefined) {
    const v = str(o, 'posterPath', at)
    if (!/^\/[\w.-]+$/.test(v)) fail(at, 'posterPath', '"/xxxx.jpg" 形式のパス')
    catalog.posterPath = v
  }
  return catalog
}

function asObject(value: unknown, at: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new WorksParseError(`${at} はオブジェクトである必要があります`)
  }
  return value as Record<string, unknown>
}

function fail(at: string, key: string, expected: string): never {
  throw new WorksParseError(`${at}.${key} は${expected}である必要があります`)
}

function str(o: Record<string, unknown>, key: string, at: string): string {
  const v = o[key]
  if (typeof v !== 'string' || v.trim() === '') fail(at, key, '空でない文字列')
  return v
}

function int(o: Record<string, unknown>, key: string, at: string, min: number, max: number): number {
  const v = o[key]
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max) {
    fail(at, key, `${min}〜${max} の整数`)
  }
  return v
}

function oneOf<T extends string>(o: Record<string, unknown>, key: string, values: readonly T[], at: string): T {
  const v = o[key]
  if (typeof v !== 'string' || !values.includes(v as T)) fail(at, key, `${values.join(' / ')} のいずれか`)
  return v as T
}

function strArray(o: Record<string, unknown>, key: string, at: string): string[] {
  const v = o[key]
  if (!Array.isArray(v) || !v.every((x) => typeof x === 'string' && x.trim() !== '')) {
    fail(at, key, '空でない文字列の配列')
  }
  return v as string[]
}

function dateTime(o: Record<string, unknown>, key: string, at: string): string {
  const v = str(o, key, at)
  if (Number.isNaN(Date.parse(v))) fail(at, key, 'ISO 8601 形式の日時')
  return v
}
