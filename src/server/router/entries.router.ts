import { createProtectedRouter } from "./context";
import {
  createEntrySchema,
  editEntrySchema,
} from "../../common/validation/entries.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { deleteEntrySchema } from "../../common/validation/entries.schema";

export const entriesRouter = createProtectedRouter()
  .query("get-all-entries", {
    async resolve({ ctx }) {
      return await ctx.prisma.places.findMany();
    },
  })
  .mutation("add-entry", {
    input: createEntrySchema,
    async resolve({ ctx, input }) {
      try {
        const entry = await ctx.prisma.places.create({
          data: { ...input },
        });
        return entry;
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
    },
  })
  .mutation("edit-entry", {
    input: editEntrySchema,
    async resolve({ ctx, input }) {
      try {
        const entry = await ctx.prisma.places.update({
          where: {
            places_id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            address: input.address,
            phone_number: input.phone_number,
            opening_hours: input.opening_hours,
            website: input.website,
            category: input.category,
            tags: input.tags,
            coords_lat: input.coords_lat,
            coords_lng: input.coords_lng,
          },
        });
        return entry;
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
    },
  })
  .mutation("delete-entry", {
    input: deleteEntrySchema,
    async resolve({ ctx, input }) {
      try {
        const deleteEntry = await ctx.prisma.places.delete({
          where: {
            places_id: input.id,
          },
        });
        return deleteEntry;
      } catch {}
    },
  });
