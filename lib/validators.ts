import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2),
  password: z.string().min(6)
});

export const moduleSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  tags: z.string().optional(),
  coverImage: z.string().optional()
});

export const lessonPageSchema = z.object({
  title: z.string().min(2),
  markdownContent: z.string().min(10)
});

export const checkpointSchema = z.object({
  type: z.enum(["MULTIPLE_CHOICE", "TEXT"]),
  prompt: z.string().min(2),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional()
});
