import { Suspense } from "react";
import { oauthSignIn } from "@/app/actions";
import { oauthProviders } from "@/auth";
import { PasswordForms } from "./PasswordForms";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-serif text-3xl font-bold text-ink">로그인</h1>
      <p className="mt-2 text-body">로그인하면 글을 쓰고, 공감과 댓글을 남길 수 있어요.</p>
      <Suspense>
        <LoginOptions searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginOptions({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { callbackUrl } = await searchParams;
  const returnTo = typeof callbackUrl === "string" ? callbackUrl : "/";

  return (
    <div className="mt-10 space-y-8">
      <PasswordForms callbackUrl={returnTo} />

      {oauthProviders.length > 0 && (
        <div className="space-y-3 border-t border-line pt-8">
          {oauthProviders.map((p) => (
            <form key={p.id} action={oauthSignIn.bind(null, p.id)}>
              <input type="hidden" name="callbackUrl" value={returnTo} />
              <button
                type="submit"
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink transition-colors hover:border-accent"
              >
                {p.label}로 계속하기
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
