/**
 * 作品データベースで作品を検索して、視聴記録 (src/data/works.json) に追加する。
 *
 * 使い方:
 *   npm run add -- "作品名" [オプション]
 *   npm run add -- --id 129 --media movie [オプション]
 *
 * オプション:
 *   --status <watched|watching|want>  視聴ステータス (既定: watched)
 *   --rating <1-5>                    評価
 *   --watched-on <YYYY-MM-DD>         視聴日 (既定: watched / watching なら今日)
 *   --note <text>                     感想メモ
 *   --tag <name>                      タグ (複数指定可)
 *   --type <movie|drama|anime|other>  種別 (既定: 作品データベースのジャンルから推定)
 *   --id <id> --media <movie|tv>      作品データベースの作品 ID を直接指定 (検索しない)
 *   --first                           検索結果の 1 件目を選ぶ (候補を選ばない)
 */
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import { isDateString } from '../src/features/works/parse.ts'
import {
  RATING_MAX,
  RATING_MIN,
  CATALOG_MEDIA_TYPES,
  WATCH_STATUSES,
  WATCH_STATUS_LABELS,
  WORK_TYPES,
  WORK_TYPE_LABELS,
  type CatalogMediaType,
  type Work,
} from '../src/features/works/types.ts'
import { CatalogError, getWorkDetails, inferWorkType, searchWorks, type CatalogSearchResult } from './lib/catalog.ts'
import { readWorks, writeWorks } from './lib/works-file.ts'

const MAX_CANDIDATES = 10

class UsageError extends Error {}

function choice<T extends string>(name: string, value: string | undefined, values: readonly T[]): T | undefined {
  if (value === undefined) return undefined
  if (!values.includes(value as T)) throw new UsageError(`--${name} は ${values.join(' / ')} のいずれかを指定してください`)
  return value as T
}

function today(): string {
  // ローカル時刻の YYYY-MM-DD
  return new Date().toLocaleDateString('sv-SE')
}

async function pickCandidate(candidates: CatalogSearchResult[], pickFirst: boolean): Promise<CatalogSearchResult> {
  if (candidates.length === 1 || pickFirst) return candidates[0]
  if (!process.stdin.isTTY) {
    throw new UsageError('候補が複数あります。--first か --id で作品を指定してください')
  }

  const shown = candidates.slice(0, MAX_CANDIDATES)
  shown.forEach((c, i) => {
    const year = c.releaseYear ? ` (${c.releaseYear})` : ''
    const original = c.originalTitle && c.originalTitle !== c.title ? ` / ${c.originalTitle}` : ''
    const media = c.mediaType === 'movie' ? '映画' : 'TV'
    console.log(`${String(i + 1).padStart(2)}) [${media}] ${c.title}${year}${original}`)
  })

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    for (;;) {
      const answer = (await rl.question(`番号を選んでください (1-${shown.length}, 中止は q): `)).trim()
      if (answer === 'q') throw new UsageError('中止しました')
      const n = Number(answer)
      if (Number.isInteger(n) && n >= 1 && n <= shown.length) return shown[n - 1]
    }
  } finally {
    rl.close()
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      status: { type: 'string', default: 'watched' },
      rating: { type: 'string' },
      'watched-on': { type: 'string' },
      note: { type: 'string' },
      tag: { type: 'string', multiple: true, default: [] },
      type: { type: 'string' },
      id: { type: 'string' },
      media: { type: 'string' },
      first: { type: 'boolean', default: false },
    },
  })

  const status = choice('status', values.status, WATCH_STATUSES)!
  const typeOverride = choice('type', values.type, WORK_TYPES)
  const query = positionals.join(' ').trim()

  const rating = values.rating === undefined ? undefined : Number(values.rating)
  if (rating !== undefined && (!Number.isInteger(rating) || rating < RATING_MIN || rating > RATING_MAX)) {
    throw new UsageError(`--rating は ${RATING_MIN}〜${RATING_MAX} の整数で指定してください`)
  }
  const watchedOn = values['watched-on']
  if (watchedOn !== undefined && !isDateString(watchedOn)) {
    throw new UsageError('--watched-on は YYYY-MM-DD 形式で指定してください')
  }

  // 作品を決める
  let target: { mediaType: CatalogMediaType; id: number }
  if (values.id !== undefined) {
    const id = Number(values.id)
    const mediaType = choice('media', values.media, CATALOG_MEDIA_TYPES)
    if (!Number.isInteger(id) || id <= 0) throw new UsageError('--id は正の整数で指定してください')
    if (!mediaType) throw new UsageError('--id を使うときは --media movie|tv も指定してください')
    target = { mediaType, id }
  } else {
    if (!query) throw new UsageError('作品名を指定してください。例: npm run add -- "千と千尋の神隠し"')
    const candidates = await searchWorks(query)
    if (candidates.length === 0) throw new UsageError(`「${query}」に一致する作品が見つかりませんでした`)
    target = await pickCandidate(candidates, values.first)
  }

  const works = readWorks()
  const id = `${target.mediaType}-${target.id}`
  const duplicate = works.find((w) => w.catalog?.mediaType === target.mediaType && w.catalog.id === target.id)
  if (duplicate) throw new UsageError(`「${duplicate.title}」はすでに登録されています (id: ${duplicate.id})`)

  const details = await getWorkDetails(target.mediaType, target.id)
  const now = new Date().toISOString()
  const work: Work = {
    id,
    title: details.title || details.originalTitle,
    type: typeOverride ?? inferWorkType(details),
    status,
    releaseYear: details.releaseYear,
    watchedOn: watchedOn ?? (status === 'want' ? undefined : today()),
    rating,
    note: values.note,
    tags: values.tag,
    catalog: { id: details.id, mediaType: details.mediaType, posterPath: details.posterPath },
    createdAt: now,
    updatedAt: now,
  }

  // undefined の項目は JSON に書かない
  const cleaned = JSON.parse(JSON.stringify(work)) as Work
  writeWorks([...works, cleaned]) // 書き込み時に形式チェックされる

  const parts = [
    WORK_TYPE_LABELS[cleaned.type],
    cleaned.releaseYear && `${cleaned.releaseYear}年`,
    WATCH_STATUS_LABELS[cleaned.status],
    cleaned.rating && `★${cleaned.rating}`,
    cleaned.watchedOn,
  ].filter(Boolean)
  console.log(`✔ 追加しました: ${cleaned.title} (${parts.join(' / ')})`)
}

main().catch((error: unknown) => {
  if (error instanceof UsageError || error instanceof CatalogError || (error as Error)?.name === 'WorksParseError') {
    console.error(`✖ ${(error as Error).message}`)
    process.exit(1)
  }
  throw error
})
