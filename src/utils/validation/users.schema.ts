import z from "zod";

export const createUserForm = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain letters and numbers",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(24, { message: "Password must be at most 24 characters long" }),
  confirmpassword: z.string(),
  role: z.enum(["ADMIN", "USER"]),
});

export const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.enum(["ADMIN", "USER"]),
});

export const editUsernameSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export const editUsernameForm = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain letters and numbers",
    }),
});

export const editPasswordSchema = z.object({
  id: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(24, { message: "Password must be at most 24 characters long" }),
});

export const editPasswordForm = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(24, { message: "Password must be at most 24 characters long" }),
  confirmpassword: z.string(),
});

export const deleteUserSchema = z.object({
  id: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type CreateUserForm = z.infer<typeof createUserForm>;

export type EditUsernameInput = z.TypeOf<typeof editUsernameSchema>;
export type EditUsernameForm = z.infer<typeof editUsernameForm>;

export type EditPasswordInput = z.TypeOf<typeof editPasswordSchema>;
export type EditPasswordForm = z.infer<typeof editPasswordForm>;

export type DeleteUserInput = z.TypeOf<typeof deleteUserSchema>;
