import NextAuth, { CredentialsSignin } from "next-auth";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { prisma } from "@/lib/prisma";
import { nicknameSchema } from "@/lib/validations";

/**
 * 닉네임만으로 로그인하는 개발용 로그인. OAuth 키 없이 기능을 확인할 때만 쓴다.
 * 비밀번호가 없으므로 운영 환경에서는 절대 켜지 않는다.
 */
export const devLoginEnabled = process.env.AUTH_DEV_LOGIN === "true";

export const oauthProviders = [
  { id: "google", label: "Google", enabled: !!process.env.AUTH_GOOGLE_ID },
  { id: "kakao", label: "카카오", enabled: !!process.env.AUTH_KAKAO_ID },
].filter((p) => p.enabled);

const providers: Provider[] = [];
if (process.env.AUTH_GOOGLE_ID) providers.push(Google);
if (process.env.AUTH_KAKAO_ID) providers.push(Kakao);
if (devLoginEnabled) {
  providers.push(
    Credentials({
      id: "dev-login",
      name: "개발용 로그인",
      credentials: { name: { label: "닉네임" } },
      async authorize(credentials) {
        const parsed = nicknameSchema.safeParse(credentials?.name);
        if (!parsed.success) throw new CredentialsSignin();
        const name = parsed.data;
        const email = `dev+${Buffer.from(name).toString("hex")}@dev.local`;
        return prisma.user.upsert({ where: { email }, update: {}, create: { email, name } });
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  // Credentials 로그인은 JWT 세션만 지원한다. 사용자·계정 정보는 여전히 DB에 저장된다.
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
