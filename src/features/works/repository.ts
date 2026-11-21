import worksJson from '../../data/works.json'
import { parseWorks } from './parse.ts'
import type { Work } from './types.ts'

/** リポジトリ内の視聴記録 JSON (src/data/works.json) を読み込む */
export function getWorks(): Work[] {
  return parseWorks(worksJson)
}
