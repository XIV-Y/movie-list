/**
 * 視聴記録 JSON (src/data/works.json) の形式をチェックする。
 * 使い方: npm run validate
 */
import { relative } from 'node:path'
import { WorksParseError } from '../src/features/works/parse.ts'
import { WORKS_FILE, readWorks } from './lib/works-file.ts'

const file = relative(process.cwd(), WORKS_FILE)

try {
  const works = readWorks()
  console.log(`✔ ${file}: ${works.length} 件の記録は正しい形式です`)
} catch (error) {
  if (error instanceof WorksParseError || error instanceof SyntaxError) {
    console.error(`✖ ${file}: ${error.message}`)
    process.exit(1)
  }
  throw error
}
