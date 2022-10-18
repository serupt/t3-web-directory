import { createRouter } from "./context";

export const entriesRouter = createRouter().query("get-all-entries", {
  async resolve({ ctx }) {
    return await ctx.prisma.places.findMany();
  },
});
