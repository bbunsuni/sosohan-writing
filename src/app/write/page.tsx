import { topics } from "@/lib/sample-data";

export default function WritePage() {
  return (
    <form className="space-y-5">
      <h1 className="font-serif text-2xl font-bold text-ink">글쓰기</h1>
      <input
        name="title"
        placeholder="제목"
        className="w-full rounded-xl border border-line bg-card px-4 py-3 font-serif text-lg text-ink outline-none focus:border-accent"
      />
      <textarea
        name="content"
        rows={12}
        placeholder="오늘의 소소한 이야기를 들려주세요."
        className="w-full resize-none rounded-xl border border-line bg-card px-4 py-3 font-serif leading-loose text-ink outline-none focus:border-accent"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          name="topicId"
          className="rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink"
          defaultValue=""
        >
          <option value="">주제 없음</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              # {t.name}
            </option>
          ))}
        </select>
        <select
          name="visibility"
          className="rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink"
          defaultValue="PRIVATE"
        >
          <option value="PRIVATE">🔒 나만 보기</option>
          <option value="PUBLIC">🌿 함께 나누기</option>
        </select>
        <button
          type="submit"
          className="ml-auto rounded-full bg-accent px-6 py-2 font-medium text-white hover:opacity-90"
        >
          저장
        </button>
      </div>
    </form>
  );
}
