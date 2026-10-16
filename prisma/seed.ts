import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const topics = [
  { slug: "today", name: "오늘의 한 줄", description: "오늘 하루를 한 줄로 남겨요." },
  { slug: "commute", name: "출퇴근길", description: "오가는 길에 스친 생각들." },
  { slug: "food", name: "소소한 한 끼", description: "기억에 남는 밥 한 끼 이야기." },
  { slug: "season", name: "계절의 변화", description: "창밖으로 느낀 계절." },
];

// 처음 화면이 비어 보이지 않도록 넣는 예시 글. `--demo` 옵션을 줄 때만 넣는다.
const demoPosts = [
  {
    author: "하늘",
    topic: "season",
    title: "은행나무 아래에서",
    content: "출근길 은행잎이 노랗게 물들기 시작했다. 매년 보는 풍경인데도 올해는 유난히 반갑다.\n\n떨어진 잎 하나를 주워 수첩 사이에 끼워 두었다.",
  },
  {
    author: "소금빵",
    topic: "food",
    title: "엄마의 된장찌개",
    content: "퇴근하고 들어왔는데 집 안 가득 된장 냄새. 별것 아닌데 하루가 다 풀렸다.",
  },
  {
    author: "느린걸음",
    topic: "commute",
    title: "지하철 창밖",
    content: "한강을 건너는 2분. 그 짧은 시간이 하루 중 가장 조용한 순간이다.",
  },
];

async function main() {
  for (const topic of topics) {
    await prisma.topic.upsert({ where: { slug: topic.slug }, update: topic, create: topic });
  }
  console.log(`Seeded ${topics.length} topics`);

  if (!process.argv.includes("--demo")) return;
  for (const p of demoPosts) {
    const email = `demo+${Buffer.from(p.author).toString("hex")}@demo.local`;
    const author = await prisma.user.upsert({ where: { email }, update: {}, create: { email, name: p.author } });
    const topic = await prisma.topic.findUniqueOrThrow({ where: { slug: p.topic } });
    const exists = await prisma.post.findFirst({ where: { authorId: author.id, title: p.title } });
    if (!exists) {
      await prisma.post.create({
        data: { title: p.title, content: p.content, visibility: "PUBLIC", authorId: author.id, topicId: topic.id },
      });
    }
  }
  console.log(`Seeded ${demoPosts.length} demo posts`);
}

main().finally(() => prisma.$disconnect());
