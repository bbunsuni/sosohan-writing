import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { posts, topics } from "@/lib/sample-data";

export default function Home() {
  const shared = posts.filter((p) => p.visibility === "PUBLIC");
  return (
    <div className="space-y-12">
      <section className="py-6 text-center">
        <h1 className="font-serif text-3xl font-bold leading-snug text-ink sm:text-4xl">
          오늘의 소소한 이야기를
          <br />
          적어볼까요?
        </h1>
        <p className="mt-4 text-muted">혼자 간직해도, 같은 주제로 함께 나눠도 좋아요.</p>
        <Link
          href="/write"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 font-medium text-white hover:opacity-90"
        >
          글 쓰러 가기
        </Link>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">이번 주 함께 나누는 주제</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="rounded-full border border-line bg-card px-4 py-2 text-sm hover:border-accent"
            >
              # {t.name} <span className="text-muted">{t.postCount}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">최근 나눠진 이야기</h2>
        <div className="space-y-4">
          {shared.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
