import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, PenLine } from "lucide-react";
import { EmptyState, PostList, PostListSkeleton } from "@/components/PostList";
import { getFeaturedTopic, getRecentPublicPosts, getTopics } from "@/lib/data";

export default function Home() {
  return (
    <div className="space-y-24">
      <section>
        <p className="text-sm text-muted">오늘의 글쓰기</p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
          오늘의 소소한 이야기를
          <br />
          적어볼까요?
        </h1>
        <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-body">
          혼자 간직해도 좋고, 같은 주제로 쓴 사람들과 나눠도 좋아요.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href="/write"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-accent-ink transition-opacity hover:opacity-90"
          >
            <PenLine size={18} strokeWidth={1.75} aria-hidden />
            글 쓰러 가기
          </Link>
          <Link href="/topics" className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
            다른 사람들의 이야기 읽기
          </Link>
        </div>
      </section>

      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-sm font-medium text-muted">
          이번 주의 주제
        </h2>
        <Suspense fallback={<div className="mt-4 h-28" />}>
          <TopicsOverview />
        </Suspense>
      </section>

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="mb-2 font-serif text-2xl font-bold text-ink">
          최근 나눠진 이야기
        </h2>
        <Suspense fallback={<PostListSkeleton />}>
          <RecentPosts />
        </Suspense>
      </section>
    </div>
  );
}

async function TopicsOverview() {
  const [featured, topics] = await Promise.all([getFeaturedTopic(), getTopics()]);
  if (!featured) return <p className="mt-4 text-muted">아직 주제가 없어요.</p>;
  const others = topics.filter((t) => t.id !== featured.id);

  return (
    <>
      <Link href={`/topics/${featured.slug}`} className="group mt-4 block">
        <p className="font-serif text-3xl font-bold text-ink transition-colors group-hover:text-accent">
          {featured.name}
        </p>
        {featured.description && <p className="mt-2 text-body">{featured.description}</p>}
      </Link>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
        {others.map((t) => (
          <li key={t.id}>
            <Link href={`/topics/${t.slug}`} className="font-serif text-lg text-body transition-colors hover:text-accent">
              {t.name}
            </Link>
          </li>
        ))}
        <li className="ml-auto">
          <Link href="/topics" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink">
            모든 주제
            <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        </li>
      </ul>
    </>
  );
}

async function RecentPosts() {
  const posts = await getRecentPublicPosts();
  if (posts.length === 0) return <EmptyState>아직 나눠진 이야기가 없어요. 첫 이야기를 남겨주세요.</EmptyState>;
  return <PostList posts={posts} />;
}
