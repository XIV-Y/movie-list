import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'

// 存在しないパスをすべて受けるルート。
// ビルド時に /404 をこのルートで描画して GitHub Pages の 404.html として出力する (vite.config.ts の pages を参照)。
// 存在しないパスで返される 404.html と、ブラウザ側の描画が同じルートになるので、ハイドレーションで食い違わない
export const Route = createFileRoute('/$')({
  // robots (noindex) は __root.tsx で全ページに付けている
  head: () => ({ meta: [{ title: 'ページが見つかりません | Movie List' }] }),
  component: NotFound,
})
