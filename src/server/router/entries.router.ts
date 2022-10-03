import { createProtectedRouter } from "./context";
import { createEntrySchema } from "../../common/validation/entries.schema";

export const entriesRouter = createProtectedRouter().mutation("add-entry", {
  input: createEntrySchema,
  async resolve({ ctx, input }) {
    const entry = await ctx.prisma.places.create({
      data: { ...input },
    });
    return entry;
  },
});
