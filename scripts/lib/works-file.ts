import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseWorks } from '../../src/features/works/parse.ts'
import type { Work } from '../../src/features/works/types.ts'

export const WORKS_FILE = fileURLToPath(new URL('../../src/data/works.json', import.meta.url))

export function readWorks(): Work[] {
  return parseWorks(JSON.parse(readFileSync(WORKS_FILE, 'utf8')))
}

export function writeWorks(works: Work[]): void {
  // 書き込む前にも検証し、壊れた JSON を保存しないようにする (キーの並び順もそろう)
  writeFileSync(WORKS_FILE, `${JSON.stringify(parseWorks(works), null, 2)}\n`)
}
