import Link from "next/link";
import { findTopic, type SamplePost } from "@/lib/sample-data";

export function PostCard({ post }: { post: SamplePost }) {
  const topic = findTopic(post.topicSlug);
  return (
    <article className="rounded-2xl border border-line bg-card p-5 transition hover:shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted">
        {topic && (
          <Link href={`/topics/${topic.slug}`} className="rounded-full bg-tag px-2.5 py-0.5 hover:text-ink">
            # {topic.name}
          </Link>
        )}
        {post.visibility === "PRIVATE" && <span>🔒 나만 보기</span>}
        <span className="ml-auto">{post.createdAt}</span>
      </div>
      <Link href={`/posts/${post.id}`}>
        <h3 className="font-serif text-lg font-bold text-ink">{post.title}</h3>
        <p className="mt-1.5 leading-relaxed text-body">{post.excerpt}</p>
      </Link>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted">
        <span>{post.author}</span>
        <span className="ml-auto">🌱 공감 {post.empathyCount}</span>
        <span>💬 {post.commentCount}</span>
      </div>
    </article>
  );
}
