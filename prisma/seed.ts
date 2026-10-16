import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const topics = [
  { slug: "today", name: "오늘의 한 줄", description: "오늘 하루를 한 줄로 남겨요." },
  { slug: "commute", name: "출퇴근길", description: "오가는 길에 스친 생각들." },
  { slug: "food", name: "소소한 한 끼", description: "기억에 남는 밥 한 끼 이야기." },
  { slug: "season", name: "계절의 변화", description: "창밖으로 느낀 계절." },
];

async function main() {
  for (const topic of topics) {
    await prisma.topic.upsert({ where: { slug: topic.slug }, update: topic, create: topic });
  }
  console.log(`Seeded ${topics.length} topics`);
}

main().finally(() => prisma.$disconnect());
