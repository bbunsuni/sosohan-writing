import Link from "next/link";
import { Lock, MessageCircle, Sprout } from "lucide-react";
import { findTopic, formatDate, type SamplePost } from "@/lib/sample-data";

type Props = { posts: SamplePost[]; showTopic?: boolean };

export function PostList({ posts, showTopic = true }: Props) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {posts.map((post) => (
        <li key={post.id}>
          <PostItem post={post} showTopic={showTopic} />
        </li>
      ))}
    </ul>
  );
}

function PostItem({ post, showTopic }: { post: SamplePost; showTopic: boolean }) {
  const topic = findTopic(post.topicSlug);
  return (
    <article className="py-6">
      {(showTopic && topic) || post.visibility === "PRIVATE" ? (
        <div className="mb-2 flex items-center gap-3 text-xs text-muted">
          {showTopic && topic && (
            <Link href={`/topics/${topic.slug}`} className="transition-colors hover:text-accent">
              {topic.name}
            </Link>
          )}
          {post.visibility === "PRIVATE" && (
            <span className="inline-flex items-center gap-1">
              <Lock size={12} strokeWidth={1.75} aria-hidden />
              나만 보기
            </span>
          )}
        </div>
      ) : null}
      <Link href={`/posts/${post.id}`} className="group block">
        <h3 className="font-serif text-xl font-bold text-ink transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 max-w-[65ch] leading-relaxed text-body">{post.excerpt}</p>
      </Link>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>{post.author}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        {post.visibility === "PUBLIC" && (
          <span className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1" aria-label={`공감 ${post.empathyCount}`}>
              <Sprout size={14} strokeWidth={1.75} aria-hidden />
              {post.empathyCount}
            </span>
            <span className="inline-flex items-center gap-1" aria-label={`댓글 ${post.commentCount}`}>
              <MessageCircle size={14} strokeWidth={1.75} aria-hidden />
              {post.commentCount}
            </span>
          </span>
        )}
      </div>
    </article>
  );
}
