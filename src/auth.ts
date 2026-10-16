import NextAuth, { CredentialsSignin } from "next-auth";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { credentialsSchema } from "@/lib/validations";

export const oauthProviders = [
  { id: "google", label: "Google", enabled: !!process.env.AUTH_GOOGLE_ID },
  { id: "kakao", label: "카카오", enabled: !!process.env.AUTH_KAKAO_ID },
].filter((p) => p.enabled);

const providers: Provider[] = [];
if (process.env.AUTH_GOOGLE_ID) providers.push(Google);
if (process.env.AUTH_KAKAO_ID) providers.push(Kakao);
// 닉네임+비밀번호 로그인. 외부 키 없이 바로 쓸 수 있다.
providers.push(
  Credentials({
    id: "password",
    name: "닉네임과 비밀번호",
    credentials: { loginName: { label: "닉네임" }, password: { label: "비밀번호", type: "password" } },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) throw new CredentialsSignin();
      const user = await prisma.user.findUnique({ where: { loginName: parsed.data.loginName } });
      if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
        throw new CredentialsSignin();
      }
      return user;
    },
  }),
);

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
