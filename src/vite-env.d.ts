/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ポスター画像 CDN のベース URL */
  readonly VITE_POSTER_BASE_URL?: string
  /** フッターに表示するデータ提供元の名前 */
  readonly VITE_CREDIT_NAME?: string
  /** フッターに表示するデータ提供元の URL */
  readonly VITE_CREDIT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
