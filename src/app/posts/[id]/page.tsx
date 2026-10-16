import Link from "next/link";
import { notFound } from "next/navigation";
import { findTopic, posts } from "@/lib/sample-data";

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();
  const topic = findTopic(post.topicSlug);

  return (
    <article className="rounded-2xl border border-line bg-card p-6 sm:p-10">
      {topic && (
        <Link href={`/topics/${topic.slug}`} className="text-sm text-muted hover:text-ink">
          # {topic.name}
        </Link>
      )}
      <h1 className="mt-2 font-serif text-2xl font-bold text-ink">{post.title}</h1>
      <p className="mt-1 text-sm text-muted">
        {post.author} · {post.createdAt}
      </p>
      <p className="mt-8 font-serif text-lg leading-loose text-body">{post.excerpt}</p>
      <div className="mt-10 flex gap-3 border-t border-line pt-6 text-sm">
        <button className="rounded-full border border-line px-4 py-1.5 hover:border-accent">
          🌱 공감 {post.empathyCount}
        </button>
        <span className="py-1.5 text-muted">💬 댓글 {post.commentCount}</span>
      </div>
    </article>
  );
}
