import type { Work } from '../types.ts'
import { WorkList } from './WorkList'

type Props = {
  /** 見出しの id (aria-labelledby 用) */
  id: string
  /** 見出しに表示する名前 (タグ名など) */
  label: string
  /** 見出しを控えめな色にする (「タグなし」など) */
  muted?: boolean
  works: readonly Work[]
}

/**
 * 見出し (名前と件数) と作品一覧のまとまり。
 * 「すべて」表示とタグ別表示で同じ見出し行を使い、切り替えても一覧の位置が変わらないようにする
 */
export function WorkSection({ id, label, muted, works }: Props) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h3 id={id} className="flex items-baseline gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <span className={`text-base font-bold ${muted ? 'text-zinc-500 dark:text-zinc-400' : ''}`}>{label}</span>
        <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{works.length} 件</span>
      </h3>
      <WorkList works={works} titleAs="h4" />
    </section>
  )
}
