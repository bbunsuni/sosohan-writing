import Link from "next/link";
import { Suspense } from "react";
import { PostListSkeleton } from "@/components/PostList";
import { getTopics } from "@/lib/data";

export default function TopicsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">주제</h1>
      <p className="mt-2 text-body">같은 주제로 쓴 이야기를 모아 읽어요.</p>
      <div className="mt-12">
        <Suspense fallback={<PostListSkeleton />}>
          <TopicList />
        </Suspense>
      </div>
    </div>
  );
}

async function TopicList() {
  const topics = await getTopics();
  return (
    <ul className="divide-y divide-line border-y border-line">
      {topics.map((t) => (
        <li key={t.id}>
          <Link href={`/topics/${t.slug}`} className="group flex items-baseline gap-4 py-6">
            <span className="flex-1">
              <span className="block font-serif text-xl font-bold text-ink transition-colors group-hover:text-accent">
                {t.name}
              </span>
              {t.description && <span className="mt-1 block text-sm text-body">{t.description}</span>}
            </span>
            <span className="text-xs text-muted">이야기 {t._count.posts}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
