import { z } from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().min(2),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.iso.datetime(),
});

export const createUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true 
});

export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
