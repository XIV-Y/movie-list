import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages (https://<user>.github.io/watch-log/) で配信するためのベースパス
const base = process.env.BASE_PATH ?? '/watch-log/'

// 外部サービスの URL などはリポジトリに置かず、リポジトリ外の .env (ローカル) か
// GitHub Actions の Variables (CI) から読む
const envDir = join(homedir(), '.config', 'movie-list')
const REQUIRED_IN_CI = ['VITE_POSTER_BASE_URL', 'VITE_CREDIT_NAME', 'VITE_CREDIT_URL']

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, 'VITE_')
  const missing = REQUIRED_IN_CI.filter((key) => !env[key])
  if (missing.length > 0) {
    const message = `環境変数が未設定です: ${missing.join(', ')}`
    // 本番デプロイでは画像やクレジット表記が欠けないよう、ビルドを止める
    if (process.env.CI) throw new Error(`${message} (GitHub Actions の Variables に設定してください)`)
    console.warn(`[movie-list] ${message} (${envDir}/.env に設定するとポスターやクレジットが表示されます)`)
  }

  return {
    base,
    envDir,
    plugins: [
      tanstackStart({
        // SSG: ビルド時に各ページを描画して中身入りの静的 HTML を出力する (GitHub Pages で配信)
        prerender: {
          enabled: true,
          // 出力するページはルート定義から自動で見つける (リンクはたどらない)
          crawlLinks: false,
          failOnError: true,
        },
        pages: [
          // 存在しないパスで表示する GitHub Pages の 404 ページ
          { path: '/404', prerender: { enabled: true, outputPath: '/404.html' } },
        ],
      }),
      viteReact(),
      tailwindcss(),
    ],
  }
})
