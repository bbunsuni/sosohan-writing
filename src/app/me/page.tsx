import Link from "next/link";
import { Suspense } from "react";
import { PenLine } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { EmptyState, PostList, PostListSkeleton } from "@/components/PostList";
import { getUserPosts } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default function MyDrawerPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">내 글 서랍</h1>
      <p className="mt-2 text-body">차곡차곡 모아둔 나의 이야기들</p>
      <div className="mt-12">
        <Suspense fallback={<PostListSkeleton />}>
          <MyPosts />
        </Suspense>
      </div>
      {/* 모바일 헤더에는 로그아웃이 없어서 여기에 둔다 */}
      <form action={signOutAction} className="mt-12 sm:hidden">
        <button type="submit" className="text-sm text-muted transition-colors hover:text-ink">
          로그아웃
        </button>
      </form>
    </div>
  );
}

async function MyPosts() {
  const user = await requireUser("/me");
  const posts = await getUserPosts(user.id);
  if (posts.length === 0) {
    return (
      <EmptyState>
        <p>아직 서랍이 비어 있어요.</p>
        <Link href="/write" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:opacity-80">
          <PenLine size={16} strokeWidth={1.75} aria-hidden />첫 글 쓰기
        </Link>
      </EmptyState>
    );
  }
  return <PostList posts={posts} />;
}
