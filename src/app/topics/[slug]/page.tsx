import Link from "next/link";
import { notFound } from "next/navigation";
import { PenLine } from "lucide-react";
import { PostList } from "@/components/PostList";
import { findTopic, posts, topics } from "@/lib/sample-data";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export default async function TopicPage({ params }: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const topicPosts = posts.filter((p) => p.topicSlug === slug && p.visibility === "PUBLIC");
  return (
    <div>
      <Link href="/topics" className="text-sm text-muted transition-colors hover:text-ink">
        주제
      </Link>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink">{topic.name}</h1>
      <p className="mt-2 text-body">{topic.description}</p>
      <Link
        href="/write"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
      >
        <PenLine size={16} strokeWidth={1.75} aria-hidden />이 주제로 쓰기
      </Link>
      <div className="mt-12">
        {topicPosts.length > 0 ? (
          <PostList posts={topicPosts} showTopic={false} />
        ) : (
          <p className="border-y border-line py-16 text-center text-muted">
            아직 이야기가 없어요. 첫 이야기를 남겨주세요.
          </p>
        )}
      </div>
    </div>
  );
}
