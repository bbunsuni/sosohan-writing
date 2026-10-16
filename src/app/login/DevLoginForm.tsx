"use client";

import { useActionState } from "react";
import { devSignIn } from "@/app/actions";

export function DevLoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(devSignIn, {});

  return (
    <form action={formAction} className="space-y-3 border-t border-line pt-8">
      <p className="text-xs text-muted">개발용 로그인 — 닉네임만으로 들어가요. 운영 환경에서는 꺼주세요.</p>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label htmlFor="name" className="sr-only">
        닉네임
      </label>
      <input
        id="name"
        name="name"
        required
        maxLength={20}
        placeholder="닉네임"
        className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted/60 focus:border-accent"
      />
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "들어가는 중…" : "닉네임으로 시작하기"}
      </button>
    </form>
  );
}
