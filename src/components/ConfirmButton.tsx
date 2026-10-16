"use client";

import type { ReactNode } from "react";

/** 서버 액션 form 안에서 쓰는 확인용 제출 버튼 */
export function ConfirmButton({ message, className, children }: { message: string; className?: string; children: ReactNode }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
