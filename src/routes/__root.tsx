/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { AppFooter } from '../components/AppFooter'
import { AppHeader } from '../components/AppHeader'
import { NotFound } from '../components/NotFound'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Movie List' },
      { name: 'theme-color', content: '#18181b' },
      // 個人の記録なので検索エンジンの検索結果に出さない (全ページ共通)
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // public/ のファイルは GitHub Pages のベースパス (/watch-log/) 配下に置かれる
      { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.svg`, type: 'image/svg+xml' },
      { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon-32.png`, type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: `${import.meta.env.BASE_URL}apple-touch-icon.png` },
    ],
  }),
  // HTML 文書全体 (html / head / body) の枠。中身の画面は component で描画する
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <AppFooter />
    </>
  )
}
