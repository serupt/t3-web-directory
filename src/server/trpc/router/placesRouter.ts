import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
  createEntrySchema,
  deleteEntrySchema,
  editEntrySchema,
} from "../../../utils/validation/entries.schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const placesRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.places.findMany();
  }),
  addEntry: protectedProcedure
    .input(createEntrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newEntry = await ctx.prisma.places.create({
          data: { ...input },
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
  editEntry: protectedProcedure
    .input(editEntrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const editedEntry = await ctx.prisma.places.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            main_address: input.main_address,
            other_addresses: input.other_addresses,
            phone_number: input.phone_number,
            opening_hours: input.opening_hours,
            website: input.website,
            category: input.category,
            tags: input.tags,
            coords_lat: input.coords_lat,
            coords_lng: input.coords_lng,
          },
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
    .input(deleteEntrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedEntry = await ctx.prisma.places.delete({
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
