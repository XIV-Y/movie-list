import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'

// GitHub Pages の 404.html を出力するためのページ (vite.config.ts の pages を参照)。
// 存在しないパスにアクセスしたときは、このページの HTML が返される
export const Route = createFileRoute('/404')({
  head: () => ({ meta: [{ title: 'ページが見つかりません | Movie List' }, { name: 'robots', content: 'noindex' }] }),
  component: NotFound,
})
