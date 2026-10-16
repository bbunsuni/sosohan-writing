import Link from "next/link";
import { PenLine } from "lucide-react";

const nav = [
  { href: "/topics", label: "주제" },
  { href: "/me", label: "내 글 서랍" },
];

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-base font-bold text-ink sm:text-lg">
          함께의 소소한 글쓰기
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/write"
            aria-label="글쓰기"
            className="inline-flex items-center gap-1.5 font-medium text-accent transition-opacity hover:opacity-80"
          >
            <PenLine size={16} strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">글쓰기</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
