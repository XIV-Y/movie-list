import type { ReactNode } from 'react'
import type { Work } from '../types.ts'
import { WorkCard } from './WorkCard'

/** 作品カードを並べるグリッド */
const WORK_GRID_CLASS = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

type Props = {
  works: readonly Work[]
  /** 0 件のときの表示 (既定: まだ記録がありません) */
  empty?: ReactNode
  /** 作品タイトルの見出しレベル */
  titleAs?: 'h3' | 'h4'
}

export function WorkList({ works, empty, titleAs }: Props) {
  if (works.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-12 text-center dark:border-zinc-700">
        {empty ?? (
          <>
            <p className="font-medium">まだ記録がありません</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">見た作品を記録していきましょう。</p>
          </>
        )}
      </div>
    )
  }

  return (
    <ul className={WORK_GRID_CLASS}>
      {works.map((work) => (
        <li key={work.id}>
          <WorkCard work={work} titleAs={titleAs} />
        </li>
      ))}
    </ul>
  )
}
