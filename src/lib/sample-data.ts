// DB 연결 전 화면 확인용 샘플 데이터. 실제 데이터 연동 후 제거합니다.

export type SampleTopic = { slug: string; name: string; description: string; postCount: number };
export type SamplePost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  topicSlug: string;
  createdAt: string;
  empathyCount: number;
  commentCount: number;
  visibility: "PRIVATE" | "PUBLIC";
};

export const topics: SampleTopic[] = [
  { slug: "today", name: "오늘의 한 줄", description: "오늘 하루를 한 줄로 남겨요.", postCount: 128 },
  { slug: "commute", name: "출퇴근길", description: "오가는 길에 스친 생각들.", postCount: 64 },
  { slug: "food", name: "소소한 한 끼", description: "기억에 남는 밥 한 끼 이야기.", postCount: 87 },
  { slug: "season", name: "계절의 변화", description: "창밖으로 느낀 계절.", postCount: 42 },
];

export const posts: SamplePost[] = [
  {
    id: "1",
    title: "은행나무 아래에서",
    excerpt: "출근길 은행잎이 노랗게 물들기 시작했다. 매년 보는 풍경인데도 올해는 유난히 반갑다.",
    author: "하늘",
    topicSlug: "season",
    createdAt: "2026-10-15",
    empathyCount: 24,
    commentCount: 5,
    visibility: "PUBLIC",
  },
  {
    id: "2",
    title: "엄마의 된장찌개",
    excerpt: "퇴근하고 들어왔는데 집 안 가득 된장 냄새. 별것 아닌데 하루가 다 풀렸다.",
    author: "소금빵",
    topicSlug: "food",
    createdAt: "2026-10-14",
    empathyCount: 41,
    commentCount: 12,
    visibility: "PUBLIC",
  },
  {
    id: "3",
    title: "지하철 창밖",
    excerpt: "한강을 건너는 2분. 그 짧은 시간이 하루 중 가장 조용한 순간이다.",
    author: "느린걸음",
    topicSlug: "commute",
    createdAt: "2026-10-14",
    empathyCount: 18,
    commentCount: 3,
    visibility: "PUBLIC",
  },
  {
    id: "4",
    title: "오늘은 그냥 괜찮았다",
    excerpt: "특별한 일은 없었지만, 그래서 좋았던 하루.",
    author: "나",
    topicSlug: "today",
    createdAt: "2026-10-16",
    empathyCount: 0,
    commentCount: 0,
    visibility: "PRIVATE",
  },
];

export const findTopic = (slug: string) => topics.find((t) => t.slug === slug);

/** "2026-10-15" → "10월 15일" */
export function formatDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  return `${month}월 ${day}일`;
}
