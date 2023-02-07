import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";
import {
  createUserSchema,
  deleteUserSchema,
  editPasswordSchema,
  editUsernameSchema,
} from "../../../utils/validation/users.schema";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const usersRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  create: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newUser = await ctx.prisma.user.create({
          data: { ...input, password: await argon2.hash(input.password) },
        });
        return newUser;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username already in database",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  editUsername: adminProcedure
    .input(editUsernameSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.prisma.user.update({
          where: { id: input.id },
          data: { username: input.username },
        });
        return updatedUser;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username already in database",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  editPassword: adminProcedure
    .input(editPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.prisma.user.update({
          where: { id: input.id },
          data: { password: await argon2.hash(input.password) },
        });
        return updatedUser;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  delete: adminProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedUser = await ctx.prisma.user.delete({
          where: { id: input.id },
        });
        return deletedUser;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
