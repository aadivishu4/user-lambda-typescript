import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;