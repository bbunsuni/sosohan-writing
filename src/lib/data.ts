import "server-only";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// 데이터는 요청마다 새로 읽는다. connection()으로 빌드 시 미리 렌더링되지 않게 한다.

const postListSelect = {
  id: true,
  title: true,
  content: true,
  visibility: true,
  createdAt: true,
  author: { select: { name: true } },
  topic: { select: { slug: true, name: true } },
  _count: { select: { empathies: true, comments: true } },
} satisfies Prisma.PostSelect;

export type PostListItem = Prisma.PostGetPayload<{ select: typeof postListSelect }>;

export async function getTopics() {
  await connection();
  return prisma.topic.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { posts: { where: { visibility: "PUBLIC" } } } } },
  });
}

/** 최근 7일간 함께 나눈 글이 가장 많은 주제 */
export async function getFeaturedTopic() {
  await connection();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [top] = await prisma.post.groupBy({
    by: ["topicId"],
    where: { visibility: "PUBLIC", topicId: { not: null }, createdAt: { gte: weekAgo } },
    _count: { _all: true },
    orderBy: { _count: { topicId: "desc" } },
    take: 1,
  });
  if (top?.topicId) return prisma.topic.findUnique({ where: { id: top.topicId } });
  return prisma.topic.findFirst({ orderBy: { createdAt: "asc" } });
}

export async function getTopicBySlug(slug: string) {
  await connection();
  return prisma.topic.findUnique({ where: { slug } });
}

export async function getRecentPublicPosts(take = 10) {
  await connection();
  return prisma.post.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    take,
    select: postListSelect,
  });
}

export async function getTopicPosts(topicId: string) {
  await connection();
  return prisma.post.findMany({
    where: { topicId, visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    select: postListSelect,
  });
}

export async function getUserPosts(authorId: string) {
  await connection();
  return prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    select: postListSelect,
  });
}

/** 공개 글이거나 본인 글일 때만 반환한다 */
export async function getPostForViewer(id: string, viewerId: string | null) {
  await connection();
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      topic: { select: { id: true, slug: true, name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true } } },
      },
      _count: { select: { empathies: true } },
    },
  });
  if (!post) return null;
  if (post.visibility === "PRIVATE" && post.authorId !== viewerId) return null;

  const empathized = viewerId
    ? !!(await prisma.empathy.findUnique({ where: { postId_userId: { postId: id, userId: viewerId } } }))
    : false;
  return { ...post, empathized };
}
