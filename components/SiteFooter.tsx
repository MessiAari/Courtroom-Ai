import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="font-serif text-2xl">Courtroom AI</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            A Prompt Engineering final project by Aaritra Kumar, Tanushree and Rounak.
          </p>
        </div>
        <div className="flex gap-8 text-sm text-muted sm:items-end">
          <Link href="/file" className="hover:text-ink">File a case</Link>
          <Link href="/how-we-built-this" className="hover:text-ink">How we built this</Link>
        </div>
      </div>
    </footer>
  );
}
