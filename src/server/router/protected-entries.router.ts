import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
  createEntrySchema,
  deleteEntrySchema,
  editEntrySchema,
} from "../../common/validation/entries.schema";
import { createProtectedRouter } from "./context";

export const protectedEntriesRouter = createProtectedRouter()
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
            places_id: input.places_id,
          },
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
            places_id: input.places_id,
          },
        });
        return deleteEntry;
      } catch {}
    },
  });
