import { Link } from '@tanstack/react-router'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span aria-hidden className="text-xl">🎬</span>
          <span>Movie List</span>
        </Link>
      </div>
    </header>
  )
}
