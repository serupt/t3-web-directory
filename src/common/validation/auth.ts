import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(24),
});

export type ILogin = z.infer<typeof loginSchema>;
