import Link from "next/link";
import { Suspense } from "react";
import { PenLine } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/session";

const linkClass = "text-muted transition-colors hover:text-ink";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-base font-bold text-ink sm:text-lg">
          함께의 소소한 글쓰기
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/topics" className={linkClass}>
            주제
          </Link>
          <Suspense fallback={<span className="w-12" aria-hidden />}>
            <UserNav />
          </Suspense>
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

async function UserNav() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/login" className={linkClass}>
        로그인
      </Link>
    );
  }
  return (
    <>
      <Link href="/me" className={linkClass}>
        내 글 서랍
      </Link>
      <form action={signOutAction} className="hidden sm:block">
        <button type="submit" className={linkClass}>
          로그아웃
        </button>
      </form>
    </>
  );
}
