"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { hashPassword } from "@/lib/password";
import { commentSchema, credentialsSchema, postSchema } from "@/lib/validations";

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

async function passwordSignIn(loginName: string, password: string, callbackUrl: FormDataEntryValue | null) {
  // 성공하면 signIn이 redirect를 던진다
  await signIn("password", { loginName, password, redirectTo: safeCallbackUrl(callbackUrl) });
}

export async function logIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse({ loginName: formData.get("loginName"), password: formData.get("password") });
  if (!parsed.success) return { error: "닉네임 또는 비밀번호가 맞지 않아요." };
  try {
    await passwordSignIn(parsed.data.loginName, parsed.data.password, formData.get("callbackUrl"));
  } catch (error) {
    if (error instanceof AuthError) return { error: "닉네임 또는 비밀번호가 맞지 않아요." };
    throw error;
  }
  return {};
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse({ loginName: formData.get("loginName"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { loginName, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { loginName } })) return { error: "이미 쓰고 있는 닉네임이에요." };
  await prisma.user.create({ data: { loginName, name: loginName, passwordHash: await hashPassword(password) } });

  try {
    await passwordSignIn(loginName, password, formData.get("callbackUrl"));
  } catch (error) {
    if (error instanceof AuthError) return { error: "가입은 됐지만 로그인하지 못했어요. 다시 로그인해 주세요." };
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
