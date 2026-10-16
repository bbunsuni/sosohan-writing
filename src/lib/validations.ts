import { z } from "zod";

export const nicknameSchema = z.string().trim().min(1).max(20);

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
