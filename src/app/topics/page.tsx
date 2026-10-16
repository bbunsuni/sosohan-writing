import Link from "next/link";
import { topics } from "@/lib/sample-data";

export default function TopicsPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">주제</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/topics/${t.slug}`}
            className="rounded-2xl border border-line bg-card p-5 hover:border-accent"
          >
            <h2 className="font-serif text-lg font-bold text-ink"># {t.name}</h2>
            <p className="mt-1 text-sm text-muted">{t.description}</p>
            <p className="mt-3 text-xs text-muted">이야기 {t.postCount}개</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
