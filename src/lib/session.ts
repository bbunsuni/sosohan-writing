import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";

export type CurrentUser = { id: string; name: string };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  // 세션은 요청마다 다르므로 미리 렌더링하지 않는다
  await connection();
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return { id, name: session.user?.name ?? "이름 없음" };
}

/** 로그인하지 않았으면 로그인 페이지로 보내고, 로그인 후 `returnTo`로 돌아온다 */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  return user;
}
