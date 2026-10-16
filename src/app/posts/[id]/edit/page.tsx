import { notFound } from "next/navigation";
import { Suspense } from "react";
import { updatePost } from "@/app/actions";
import { PostForm } from "@/components/PostForm";
import { getPostForViewer, getTopics } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default function EditPostPage({ params }: PageProps<"/posts/[id]/edit">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-[65ch]" aria-busy="true" />}>
      <EditForm params={params} />
    </Suspense>
  );
}

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/posts/${id}/edit`);
  const [post, topics] = await Promise.all([getPostForViewer(id, user.id), getTopics()]);
  if (!post || post.authorId !== user.id) notFound();

  return (
    <PostForm
      action={updatePost.bind(null, post.id)}
      topics={topics}
      defaults={{ title: post.title, content: post.content, visibility: post.visibility, topicId: post.topicId }}
      submitLabel="수정하기"
    />
  );
}
