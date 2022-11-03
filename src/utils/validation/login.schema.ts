import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});

export type LoginInput = z.TypeOf<typeof loginSchema>;
