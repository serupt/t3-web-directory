import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
  imageSchema,
  uploadImageSchema,
} from "../../../utils/validation/image.schema";
import { protectedProcedure, router } from "../trpc";

export const imageRouter = router({
  getPlaceImages: protectedProcedure
    .input(imageSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.placeImages.findMany({
        where: {
          placeId: input.placeId,
        },
      });
    }),
  addImage: protectedProcedure
    .input(uploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newEntry = await ctx.prisma.placeImages.create({
          data: {
            image_url: input.image_url,
            image_public_id: input.image_public_id,
            place: {
              connect: {
                id: input.placeId,
              },
            },
          },
        });
        return newEntry;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
