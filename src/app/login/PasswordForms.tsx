"use client";

import { useActionState, useState } from "react";
import { logIn, signUp } from "@/app/actions";

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted/60 focus:border-accent";

export function PasswordForms({ callbackUrl }: { callbackUrl: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState(isSignup ? signUp : logIn, {});

  return (
    <div>
      <form key={mode} action={formAction} className="space-y-3">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <label htmlFor="loginName" className="sr-only">
          닉네임
        </label>
        <input
          id="loginName"
          name="loginName"
          required
          minLength={2}
          maxLength={20}
          autoComplete="username"
          placeholder="닉네임"
          className={inputClass}
        />
        <label htmlFor="password" className="sr-only">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder={isSignup ? "비밀번호 (8자 이상)" : "비밀번호"}
          className={inputClass}
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
          {pending ? "잠시만요…" : isSignup ? "가입하고 시작하기" : "로그인"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {isSignup ? "이미 가입했나요?" : "처음 오셨나요?"}{" "}
        <button
          type="button"
          onClick={() => setMode(isSignup ? "login" : "signup")}
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {isSignup ? "로그인" : "가입하기"}
        </button>
      </p>
    </div>
  );
}
