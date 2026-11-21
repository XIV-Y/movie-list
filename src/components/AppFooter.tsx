const CREDIT_NAME = import.meta.env.VITE_CREDIT_NAME
const CREDIT_URL = import.meta.env.VITE_CREDIT_URL

/** データ提供元のクレジット表記。提供元の名前と URL はビルド時の環境変数から読む */
export function AppFooter() {
  if (!CREDIT_NAME) return null

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          作品情報・画像の提供:{' '}
          {CREDIT_URL ? (
            <a
              href={CREDIT_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {CREDIT_NAME}
            </a>
          ) : (
            CREDIT_NAME
          )}
        </p>
        <p className="mt-1">
          This product uses the {CREDIT_NAME} API but is not endorsed or certified by {CREDIT_NAME}.
        </p>
      </div>
    </footer>
  )
}
