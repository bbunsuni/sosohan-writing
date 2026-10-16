import Link from "next/link";
import { PenLine } from "lucide-react";
import { PostList } from "@/components/PostList";
import { posts } from "@/lib/sample-data";

export default function MyDrawerPage() {
  const mine = posts.filter((p) => p.author === "나");
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">내 글 서랍</h1>
      <p className="mt-2 text-body">차곡차곡 모아둔 나의 이야기들</p>
      <div className="mt-12">
        {mine.length > 0 ? (
          <PostList posts={mine} />
        ) : (
          <div className="border-y border-line py-16 text-center">
            <p className="text-muted">아직 서랍이 비어 있어요.</p>
            <Link
              href="/write"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:opacity-80"
            >
              <PenLine size={16} strokeWidth={1.75} aria-hidden />첫 글 쓰기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
