import { z } from "zod";

export const credentialsSchema = z.object({
  loginName: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상이어야 해요.")
    .max(20, "닉네임은 20자 이내로 써주세요.")
    .regex(/^[0-9A-Za-z가-힣_]+$/, "닉네임에는 한글·영문·숫자·밑줄(_)만 쓸 수 있어요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 해요.").max(100),
});

export const postSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해 주세요.").max(100, "제목은 100자 이내로 써주세요."),
  content: z.string().trim().min(1, "내용을 입력해 주세요.").max(10_000, "내용은 10,000자 이내로 써주세요."),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
  topicId: z
    .string()
    .optional()
    .transform((v) => v || null),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, "댓글을 입력해 주세요.").max(1_000, "댓글은 1,000자 이내로 써주세요."),
});

export type PostInput = z.infer<typeof postSchema>;
