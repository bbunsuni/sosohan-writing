const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

/** 2026-10-15 → "10월 15일" */
export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

/** 목록에 보여줄 앞부분 요약 */
export function excerpt(content: string, length = 140) {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length)}…` : flat;
}

/** 빈 줄 기준으로 문단 나누기 */
export function paragraphs(content: string) {
  return content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
