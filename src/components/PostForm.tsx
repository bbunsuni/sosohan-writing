"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, Users } from "lucide-react";
import type { FormState } from "@/app/actions";

type Topic = { id: string; name: string };
type Defaults = { title?: string; content?: string; visibility?: "PRIVATE" | "PUBLIC"; topicId?: string | null };

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  topics: Topic[];
  defaults?: Defaults;
  submitLabel?: string;
};

const visibilityOptions = [
  { value: "PRIVATE", label: "나만 보기", Icon: Lock },
  { value: "PUBLIC", label: "함께 나누기", Icon: Users },
] as const;

export function PostForm({ action, topics, defaults = {}, submitLabel = "저장하기" }: Props) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="mx-auto max-w-[65ch]">
      <label htmlFor="title" className="sr-only">
        제목
      </label>
      <input
        id="title"
        name="title"
        required
        maxLength={100}
        defaultValue={defaults.title}
        placeholder="제목"
        className="w-full bg-transparent font-serif text-3xl font-bold text-ink outline-none placeholder:text-muted/60 focus-visible:outline-none"
      />
      <label htmlFor="content" className="sr-only">
        내용
      </label>
      <textarea
        id="content"
        name="content"
        required
        rows={14}
        defaultValue={defaults.content}
        placeholder="오늘의 소소한 이야기를 들려주세요."
        className="mt-6 w-full resize-none border-t border-line bg-transparent pt-6 font-serif text-lg leading-loose text-body outline-none placeholder:text-muted/60 focus-visible:outline-none"
      />

      <div className="mt-8 space-y-6 border-t border-line pt-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label htmlFor="topicId" className="text-sm text-muted">
            주제
          </label>
          <select
            id="topicId"
            name="topicId"
            defaultValue={defaults.topicId ?? ""}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="">주제 없음</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <legend className="sr-only">공개 범위</legend>
          <span aria-hidden className="text-sm text-muted">
            공개
          </span>
          <div className="inline-flex rounded-lg border border-line p-1">
            {visibilityOptions.map(({ value, label, Icon }) => (
              <label
                key={value}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted transition-colors has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
              >
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  defaultChecked={value === (defaults.visibility ?? "PRIVATE")}
                  className="sr-only"
                />
                <Icon size={14} strokeWidth={1.75} aria-hidden />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-end gap-4">
          {state.error && (
            <p role="alert" className="text-sm text-accent">
              {state.error}
            </p>
          )}
          <SubmitButton label={submitLabel} />
        </div>
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "저장하는 중…" : label}
    </button>
  );
}
