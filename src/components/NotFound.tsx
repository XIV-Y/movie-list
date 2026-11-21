import { Link } from '@tanstack/react-router'

/** 存在しないページ。GitHub Pages の 404.html としてビルド時に出力する */
export function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold text-zinc-300 dark:text-zinc-700">404</p>
      <h1 className="mt-4 text-xl font-bold">ページが見つかりません</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">URL が間違っているか、ページが移動した可能性があります。</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        TOP に戻る
      </Link>
    </div>
  )
}
