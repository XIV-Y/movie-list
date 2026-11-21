const PULSE = 'animate-pulse bg-zinc-200 motion-reduce:animate-none dark:bg-zinc-800'

/** WorkCard と同じ寸法の読み込み中カード */
export function WorkCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`aspect-[2/3] ${PULSE}`} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* 種別バッジ・公開年と同じ行の高さ。透明な文字で高さを合わせる */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`rounded px-1.5 py-0.5 text-transparent ${PULSE}`}>アニメ</span>
          <span className={`rounded text-transparent ${PULSE}`}>2000年</span>
        </div>
        {/* タイトル 2 行分 */}
        <div className="min-h-[2lh] text-sm leading-snug">
          <span className={`block w-4/5 rounded text-transparent ${PULSE}`}>&nbsp;</span>
        </div>
      </div>
    </div>
  )
}
