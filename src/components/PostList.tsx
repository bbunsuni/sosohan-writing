import Link from "next/link";
import { Lock, MessageCircle, Sprout } from "lucide-react";
import type { PostListItem } from "@/lib/data";
import { excerpt, formatDate } from "@/lib/format";

type Props = { posts: PostListItem[]; showTopic?: boolean };

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

function PostItem({ post, showTopic }: { post: PostListItem; showTopic: boolean }) {
  const topic = showTopic ? post.topic : null;
  const isPrivate = post.visibility === "PRIVATE";
  return (
    <article className="py-6">
      {(topic || isPrivate) && (
        <div className="mb-2 flex items-center gap-3 text-xs text-muted">
          {topic && (
            <Link href={`/topics/${topic.slug}`} className="transition-colors hover:text-accent">
              {topic.name}
            </Link>
          )}
          {isPrivate && (
            <span className="inline-flex items-center gap-1">
              <Lock size={12} strokeWidth={1.75} aria-hidden />
              나만 보기
            </span>
          )}
        </div>
      )}
      <Link href={`/posts/${post.id}`} className="group block">
        <h3 className="font-serif text-xl font-bold text-ink transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 max-w-[65ch] leading-relaxed text-body">{excerpt(post.content)}</p>
      </Link>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>{post.author.name}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
        {!isPrivate && (
          <span className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1" aria-label={`공감 ${post._count.empathies}`}>
              <Sprout size={14} strokeWidth={1.75} aria-hidden />
              {post._count.empathies}
            </span>
            <span className="inline-flex items-center gap-1" aria-label={`댓글 ${post._count.comments}`}>
              <MessageCircle size={14} strokeWidth={1.75} aria-hidden />
              {post._count.comments}
            </span>
          </span>
        )}
      </div>
    </article>
  );
}

export function PostListSkeleton() {
  return (
    <ul className="divide-y divide-line border-y border-line" aria-busy="true" aria-label="불러오는 중">
      {[0, 1, 2].map((i) => (
        <li key={i} className="space-y-3 py-6">
          <div className="h-5 w-40 rounded bg-line" />
          <div className="h-4 w-full max-w-[52ch] rounded bg-line/60" />
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="border-y border-line py-16 text-center text-muted">{children}</div>;
}
