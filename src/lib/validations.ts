import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해 주세요.").max(100),
  content: z.string().trim().min(1, "내용을 입력해 주세요.").max(10_000),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
  topicId: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(1_000),
});

export type PostInput = z.infer<typeof postSchema>;
