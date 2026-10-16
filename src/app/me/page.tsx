import { PostCard } from "@/components/PostCard";
import { posts } from "@/lib/sample-data";

export default function MyDrawerPage() {
  const mine = posts.filter((p) => p.author === "나");
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">내 글 서랍</h1>
      <p className="mt-1 text-muted">차곡차곡 모아둔 나의 이야기들</p>
      <div className="mt-8 space-y-4">
        {mine.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
