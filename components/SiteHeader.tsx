import Link from "next/link";
import { PixelArt } from "@/components/ui/PixelArt";
import { SCALES } from "@/components/ui/pixel-icons";

// Header: hairline-separated cells, like a court docket.
const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#docket", label: "Cases" },
  { href: "/how-we-built-this", label: "How we built this" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav className="flex h-14 items-stretch" aria-label="Main">
        <Link href="/" className="group flex items-center gap-2.5 border-r border-line px-4 sm:px-5">
          <PixelArt bitmap={SCALES} colors={{ a: "#34D399", b: "#059669" }} className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" />
          <span className="text-[15px] font-semibold tracking-tight">Courtroom AI</span>
        </Link>
        <ul className="hidden items-stretch md:flex">
          {LINKS.map((l) => (
            <li key={l.href} className="flex border-r border-line">
              <Link href={l.href} className="flex items-center px-5 text-sm text-muted transition-colors hover:bg-white/[0.03] hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-stretch border-l border-line">
          <Link
            href="/file"
            className="group flex items-center gap-2 px-4 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-bg sm:px-6"
          >
            File a case
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
