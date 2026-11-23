/**
 * 作品データベースで作品を検索して、視聴記録 (src/data/works.json) に追加する。
 *
 * 使い方:
 *   npm run add -- "作品名" [オプション]
 *   npm run add -- --id 129 --media movie [オプション]
 *
 * オプション:
 *   --status <watched|watching|want>  視聴ステータス (既定: watched)
 *   --type <movie|drama|anime|other>  種別 (既定: 作品データベースのジャンルから推定)
 *   --tag <name>                      シリーズなどのタグ (複数指定可。例: --tag X-MEN)
 *   --id <id> --media <movie|tv>      作品データベースの作品 ID を直接指定 (検索しない)
 *   --first                           検索結果の 1 件目を選ぶ (候補を選ばない)
 */
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import {
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
      type: { type: 'string' },
      tag: { type: 'string', multiple: true, default: [] },
      id: { type: 'string' },
      media: { type: 'string' },
      first: { type: 'boolean', default: false },
    },
  })

  const status = choice('status', values.status, WATCH_STATUSES)!
  const typeOverride = choice('type', values.type, WORK_TYPES)
  const query = positionals.join(' ').trim()


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
  const work: Work = {
    id,
    title: details.title || details.originalTitle,
    type: typeOverride ?? inferWorkType(details),
    status,
    releaseYear: details.releaseYear,
    // 前後の空白を除き、重複をまとめる。なければ項目ごと省略する
    tags: [...new Set(values.tag.map((t) => t.trim()).filter(Boolean))],
    catalog: { id: details.id, mediaType: details.mediaType, posterPath: details.posterPath },
  }

  if (work.tags?.length === 0) delete work.tags
  // undefined の項目は JSON に書かない
  const cleaned = JSON.parse(JSON.stringify(work)) as Work
  writeWorks([...works, cleaned]) // 書き込み時に形式チェックされる

  const parts = [
    WORK_TYPE_LABELS[cleaned.type],
    cleaned.releaseYear && `${cleaned.releaseYear}年`,
    WATCH_STATUS_LABELS[cleaned.status],
    cleaned.tags?.map((t) => `#${t}`).join(' '),
  ].filter(Boolean)
  console.log(`✔ 追加しました: ${cleaned.title} (${parts.join(' / ')})`)
}

main().catch((error: unknown) => {
  // 未知のオプション (廃止した --rating など) や値の不足はスタックトレースを出さずに伝える
  const code = (error as { code?: string })?.code
  if (code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION' || code === 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE') {
    console.error(`✖ ${(error as Error).message.split('.')[0]}。使えるオプションは README を参照してください`)
    process.exit(1)
  }
  if (error instanceof UsageError || error instanceof CatalogError || (error as Error)?.name === 'WorksParseError') {
    console.error(`✖ ${(error as Error).message}`)
    process.exit(1)
  }
  throw error
})
