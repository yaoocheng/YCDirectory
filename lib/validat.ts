import { z } from "zod";

export const formSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(20, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.string(),
  link: z.string()
    .url("Please enter a valid URL"),
  pitch: z.string()
    .min(10, "Pitch must be at least 10 characters"),
});
