export function AppFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          作品情報・画像の提供:{' '}
          <a
            href="https://example.invalid"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            CATALOG
          </a>
        </p>
        <p className="mt-1">This product uses the CATALOG API but is not endorsed or certified by CATALOG.</p>
      </div>
    </footer>
  )
}
