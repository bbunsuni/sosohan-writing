import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
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
      <h1 className="font-serif text-2xl font-bold text-ink"># {topic.name}</h1>
      <p className="mt-1 text-muted">{topic.description}</p>
      <div className="mt-8 space-y-4">
        {topicPosts.length > 0 ? (
          topicPosts.map((p) => <PostCard key={p.id} post={p} />)
        ) : (
          <p className="py-10 text-center text-muted">아직 이야기가 없어요. 첫 이야기를 남겨주세요.</p>
        )}
      </div>
    </div>
  );
}
