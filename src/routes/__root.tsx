/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute, useRouter } from '@tanstack/react-router'
import { AppFooter } from '../components/AppFooter'
import { AppHeader } from '../components/AppHeader'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Movie List' },
      { name: 'theme-color', content: '#18181b' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // public/ のファイルは GitHub Pages のベースパス (/movie-list/) 配下に置かれる
      { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.svg`, type: 'image/svg+xml' },
      { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon-32.png`, type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: `${import.meta.env.BASE_URL}apple-touch-icon.png` },
    ],
  }),
  // SPA モードでは shellComponent だけがビルド時に HTML 化され、
  // ルートの中身はブラウザ側で描画される
  shellComponent: RootDocument,
  component: RootLayout,
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
  const router = useRouter()
  // SPA モードでビルド時に HTML を出力するとき (シェル) は、ルートの中身が描画されず空になる。
  // JavaScript の読み込みが終わるまでの間に表示するため、代わりに読み込み中の表示を入れておく
  const ShellPending = router.isShell() ? router.options.defaultPendingComponent : undefined

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        {ShellPending ? <ShellPending /> : <Outlet />}
      </main>
      <AppFooter />
    </>
  )
}
