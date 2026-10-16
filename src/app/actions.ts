"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { commentSchema, nicknameSchema, postSchema } from "@/lib/validations";

export type FormState = { error?: string; ok?: boolean };

function parsePost(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    visibility: formData.get("visibility"),
    topicId: formData.get("topicId") ?? undefined,
  });
}

/** 본인 글만 고칠 수 있다 */
async function requireOwnPost(postId: string) {
  const user = await requireUser(`/posts/${postId}`);
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post || post.authorId !== user.id) throw new Error("이 글을 수정할 권한이 없어요.");
  return user;
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/write");
  const parsed = parsePost(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const post = await prisma.post.create({ data: { ...parsed.data, authorId: user.id } });
  revalidatePath("/", "layout");
  redirect(`/posts/${post.id}`);
}

export async function updatePost(postId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireOwnPost(postId);
  const parsed = parsePost(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.post.update({ where: { id: postId }, data: parsed.data });
  revalidatePath("/", "layout");
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  await requireOwnPost(postId);
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/", "layout");
  redirect("/me");
}

export async function toggleEmpathy(postId: string) {
  const user = await requireUser(`/posts/${postId}`);
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { visibility: true } });
  if (post?.visibility !== "PUBLIC") return;

  const key = { postId_userId: { postId, userId: user.id } };
  const existing = await prisma.empathy.findUnique({ where: key });
  if (existing) await prisma.empathy.delete({ where: key });
  else await prisma.empathy.create({ data: { postId, userId: user.id } });
  revalidatePath(`/posts/${postId}`);
}

export async function addComment(postId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser(`/posts/${postId}`);
  const parsed = commentSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { visibility: true } });
  if (post?.visibility !== "PUBLIC") return { error: "댓글을 남길 수 없는 글이에요." };

  await prisma.comment.create({ data: { postId, authorId: user.id, content: parsed.data.content } });
  revalidatePath(`/posts/${postId}`);
  return { ok: true };
}

export async function deleteComment(commentId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return;
  const user = await requireUser(`/posts/${comment.postId}`);
  if (comment.authorId !== user.id) return;

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/posts/${comment.postId}`);
}

/** 로그인 후 돌아갈 주소는 사이트 안쪽 경로만 허용한다 */
function safeCallbackUrl(value: FormDataEntryValue | null) {
  const url = typeof value === "string" ? value : "/";
  return url.startsWith("/") && !url.startsWith("//") ? url : "/";
}

export async function devSignIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = nicknameSchema.safeParse(formData.get("name"));
  if (!name.success) return { error: "닉네임은 1–20자로 입력해 주세요." };
  try {
    await signIn("dev-login", { name: name.data, redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
  } catch (error) {
    if (error instanceof AuthError) return { error: "로그인하지 못했어요. 다시 시도해 주세요." };
    throw error;
  }
  return {};
}

export async function oauthSignIn(provider: string, formData: FormData) {
  await signIn(provider, { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
