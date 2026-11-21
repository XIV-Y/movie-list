import { createRouter } from '@tanstack/react-router'
import { WorksPageSkeleton } from './features/works/components/WorksPageSkeleton'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    basepath: import.meta.env.BASE_URL,
    scrollRestoration: true,
    defaultPreload: 'intent',
    // 読み込み中の表示。ビルド時に出力する HTML (SPA のシェル) にも使う (__root.tsx 参照)
    defaultPendingComponent: WorksPageSkeleton,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
