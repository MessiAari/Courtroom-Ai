import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl leading-none text-ink">Courtroom</span>
          <span className="font-mono text-[11px] text-brass">AI</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/how-we-built-this" className="hidden text-muted transition-colors hover:text-ink sm:block">
            How we built this
          </Link>
          <Link href="/file" className="border border-line-strong px-3.5 py-1.5 text-ink transition-colors hover:border-ink">
            File a case
          </Link>
        </div>
      </nav>
    </header>
  );
}
