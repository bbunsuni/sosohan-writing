import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Lock, MessageCircle, Sprout } from "lucide-react";
import { addComment, deleteComment, deletePost, toggleEmpathy } from "@/app/actions";
import { CommentForm } from "@/components/CommentForm";
import { ConfirmButton } from "@/components/ConfirmButton";
import { getPostForViewer } from "@/lib/data";
import { formatDate, paragraphs } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export default function PostPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-64 max-w-[65ch]" aria-busy="true" />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const post = await getPostForViewer(id, user?.id ?? null);
  if (!post) notFound();

  const isAuthor = user?.id === post.authorId;
  const isPublic = post.visibility === "PUBLIC";

  return (
    <article className="mx-auto max-w-[65ch]">
      <div className="flex items-center gap-3 text-sm text-muted">
        {post.topic && (
          <Link href={`/topics/${post.topic.slug}`} className="transition-colors hover:text-accent">
            {post.topic.name}
          </Link>
        )}
        {!isPublic && (
          <span className="inline-flex items-center gap-1">
            <Lock size={14} strokeWidth={1.75} aria-hidden />
            나만 보기
          </span>
        )}
      </div>
      <h1 className="mt-3 font-serif text-3xl font-bold leading-snug text-ink sm:text-4xl">{post.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted">
        <span>
          {post.author.name} · <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
        </span>
        {isAuthor && (
          <span className="ml-auto flex items-center gap-4">
            <Link href={`/posts/${post.id}/edit`} className="transition-colors hover:text-ink">
              수정
            </Link>
            <form action={deletePost.bind(null, post.id)}>
              <ConfirmButton message="이 글을 삭제할까요? 되돌릴 수 없어요." className="transition-colors hover:text-ink">
                삭제
              </ConfirmButton>
            </form>
          </span>
        )}
      </div>

      <div className="mt-12 space-y-6 font-serif text-lg leading-loose whitespace-pre-line text-body">
        {paragraphs(post.content).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {isPublic && (
        <>
          <div className="mt-16 flex items-center gap-6 border-t border-line pt-6 text-sm">
            <form action={toggleEmpathy.bind(null, post.id)}>
              <button
                type="submit"
                aria-pressed={post.empathized}
                className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-ink transition-colors hover:border-accent hover:text-accent aria-pressed:border-accent aria-pressed:text-accent"
              >
                <Sprout size={16} strokeWidth={1.75} aria-hidden />
                공감 {post._count.empathies}
              </button>
            </form>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
              댓글 {post.comments.length}
            </span>
          </div>

          <section aria-label="댓글" className="mt-8">
            {post.comments.length > 0 && (
              <ul className="divide-y divide-line">
                {post.comments.map((c) => (
                  <li key={c.id} className="py-4">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="font-medium text-body">{c.author.name}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={c.createdAt.toISOString()}>{formatDate(c.createdAt)}</time>
                      {user?.id === c.authorId && (
                        <form action={deleteComment.bind(null, c.id)} className="ml-auto">
                          <ConfirmButton message="댓글을 삭제할까요?" className="transition-colors hover:text-ink">
                            삭제
                          </ConfirmButton>
                        </form>
                      )}
                    </div>
                    <p className="mt-1.5 leading-relaxed whitespace-pre-line text-body">{c.content}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              {user ? (
                <CommentForm action={addComment.bind(null, post.id)} />
              ) : (
                <p className="text-sm text-muted">
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/posts/${post.id}`)}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    로그인
                  </Link>
                  하면 공감과 댓글을 남길 수 있어요.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </article>
  );
}
