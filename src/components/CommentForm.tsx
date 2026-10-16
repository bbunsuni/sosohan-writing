"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions";

type Props = { action: (prev: FormState, formData: FormData) => Promise<FormState> };

export function CommentForm({ action }: Props) {
  const [state, formAction] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <label htmlFor="comment" className="sr-only">
        댓글
      </label>
      <textarea
        id="comment"
        name="content"
        required
        rows={3}
        maxLength={1000}
        placeholder="따뜻한 한마디를 남겨주세요."
        className="w-full resize-none rounded-lg border border-line bg-surface px-4 py-3 leading-relaxed text-ink outline-none placeholder:text-muted/60 focus:border-accent"
      />
      <div className="flex items-center justify-end gap-4">
        {state.error && (
          <p role="alert" className="text-sm text-accent">
            {state.error}
          </p>
        )}
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {pending ? "남기는 중…" : "댓글 남기기"}
    </button>
  );
}
