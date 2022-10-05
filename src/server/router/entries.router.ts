import { createProtectedRouter } from "./context";
import { createEntrySchema } from "../../common/validation/entries.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";

export const entriesRouter = createProtectedRouter().mutation("add-entry", {
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
});
