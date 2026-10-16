import { Suspense } from "react";
import { createPost } from "@/app/actions";
import { PostForm } from "@/components/PostForm";
import { getTopics } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default function WritePage({ searchParams }: PageProps<"/write">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-[65ch]" aria-busy="true" />}>
      <WriteForm searchParams={searchParams} />
    </Suspense>
  );
}

async function WriteForm({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { topic } = await searchParams;
  await requireUser(topic ? `/write?topic=${topic}` : "/write");
  const topics = await getTopics();
  const preset = topics.find((t) => t.slug === topic);

  return <PostForm action={createPost} topics={topics} defaults={{ topicId: preset?.id }} />;
}
