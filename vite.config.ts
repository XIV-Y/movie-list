import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// GitHub Pages (https://<user>.github.io/movie-list/) で配信するためのベースパス
const base = process.env.BASE_PATH ?? '/movie-list/'

export default defineConfig({
  base,
  plugins: [
    tanstackStart({
      // CSR (SPA) モード: ビルド時にシェル HTML だけを生成し、描画はブラウザで行う
      spa: {
        enabled: true,
        prerender: {
          outputPath: '/index.html',
        },
      },
    }),
    viteReact(),
  ],
})
