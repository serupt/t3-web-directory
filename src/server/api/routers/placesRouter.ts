import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
  deletePlaceSchema,
  editPlaceSchema,
  placeSchema,
} from "../../../utils/validation/entries.schema";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";

export const placesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.place.findMany();
  }),
  getUserPlaces: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.place.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  addEntry: protectedProcedure
    .input(placeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newEntry = await ctx.prisma.place.create({
          data: {
            ...input,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        return newEntry;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Name or address already in database",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  addManyEntries: protectedProcedure
    .input(placeSchema.array())
    .mutation(async ({ ctx, input }) => {
      try {
        const newEntries = await ctx.prisma.place.createMany({
          data: [
            ...input.map((entry) => ({
              ...entry,
              userId: ctx.session.user.id,
            })),
          ],
          skipDuplicates: true,
        });
        return newEntries;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Name or address already in database",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  editEntry: protectedProcedure
    .input(editPlaceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const editedEntry = await ctx.prisma.place.update({
          where: { id: input.id },
          data: { ...input },
        });
        return editedEntry;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Name or address already in database",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  deleteEntry: protectedProcedure
    .input(deletePlaceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedEntry = await ctx.prisma.place.delete({
          where: {
            id: input.id,
          },
        });
        return deletedEntry;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
