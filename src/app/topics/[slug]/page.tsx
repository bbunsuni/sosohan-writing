import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PenLine } from "lucide-react";
import { EmptyState, PostList, PostListSkeleton } from "@/components/PostList";
import { getTopicBySlug, getTopicPosts } from "@/lib/data";

export default function TopicPage({ params }: PageProps<"/topics/[slug]">) {
  return (
    <div>
      <Link href="/topics" className="text-sm text-muted transition-colors hover:text-ink">
        주제
      </Link>
      <Suspense fallback={<PostListSkeleton />}>
        <TopicContent params={params} />
      </Suspense>
    </div>
  );
}

async function TopicContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(decodeURIComponent(slug));
  if (!topic) notFound();
  const posts = await getTopicPosts(topic.id);

  return (
    <>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink">{topic.name}</h1>
      {topic.description && <p className="mt-2 text-body">{topic.description}</p>}
      <Link
        href={`/write?topic=${topic.slug}`}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
      >
        <PenLine size={16} strokeWidth={1.75} aria-hidden />이 주제로 쓰기
      </Link>
      <div className="mt-12">
        {posts.length > 0 ? (
          <PostList posts={posts} showTopic={false} />
        ) : (
          <EmptyState>아직 이야기가 없어요. 첫 이야기를 남겨주세요.</EmptyState>
        )}
      </div>
    </>
  );
}
