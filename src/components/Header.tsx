import Link from "next/link";

const nav = [
  { href: "/topics", label: "주제" },
  { href: "/me", label: "내 글 서랍" },
];

export function Header() {
  return (
    <header className="border-b border-line bg-paper/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-lg font-bold text-ink">
          함께의 소소한 글쓰기
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/write"
            className="rounded-full bg-accent px-4 py-1.5 font-medium text-white hover:opacity-90"
          >
            글쓰기
          </Link>
        </nav>
      </div>
    </header>
  );
}
