import Link from "next/link";
import { PixelStairs } from "@/components/ui/primitives";

export function SiteFooter() {
  return (
    <footer className="relative mt-28 overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-40 pt-14 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
        <div>
          <p className="display text-4xl">Courtroom AI</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Three AI agents argue your case so you can hear both sides. A Prompt Engineering final project by Aaritra Kumar,
            Tanushree and Rounak.
          </p>
        </div>
        <div>
          <p className="label">Courtroom</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/file" className="text-muted hover:text-ink">File a case</Link></li>
            <li><Link href="/#how" className="text-muted hover:text-ink">How it works</Link></li>
            <li><Link href="/#docket" className="text-muted hover:text-ink">Cases on the docket</Link></li>
          </ul>
        </div>
        <div>
          <p className="label">Project</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/how-we-built-this" className="text-muted hover:text-ink">How we built this</Link></li>
            <li><Link href="/setup" className="text-muted hover:text-ink">Setup status</Link></li>
          </ul>
        </div>
      </div>
      <PixelStairs className="pointer-events-none absolute bottom-0 left-0 w-56 sm:w-80" />
      <PixelStairs flip className="pointer-events-none absolute bottom-0 right-0 w-28 opacity-90 sm:w-44" />
    </footer>
  );
}
