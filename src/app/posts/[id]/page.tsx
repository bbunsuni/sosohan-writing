import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Sprout } from "lucide-react";
import { findTopic, formatDate, posts } from "@/lib/sample-data";

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();
  const topic = findTopic(post.topicSlug);

  return (
    <article className="mx-auto max-w-[65ch]">
      {topic && (
        <Link href={`/topics/${topic.slug}`} className="text-sm text-muted transition-colors hover:text-accent">
          {topic.name}
        </Link>
      )}
      <h1 className="mt-3 font-serif text-3xl font-bold leading-snug text-ink sm:text-4xl">{post.title}</h1>
      <p className="mt-4 text-sm text-muted">
        {post.author} · <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
      </p>
      <div className="mt-12 font-serif text-lg leading-loose text-body">
        <p>{post.excerpt}</p>
      </div>
      {post.visibility === "PUBLIC" && (
        <div className="mt-16 flex items-center gap-6 border-t border-line pt-6 text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <Sprout size={16} strokeWidth={1.75} aria-hidden />
            공감 {post.empathyCount}
          </button>
          <span className="inline-flex items-center gap-1.5 text-muted">
            <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
            댓글 {post.commentCount}
          </span>
        </div>
      )}
    </article>
  );
}
