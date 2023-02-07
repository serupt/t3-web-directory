import { TRPCError } from "@trpc/server";
import {
  imageSchema,
  uploadImageSchema,
} from "../../../utils/validation/image.schema";
import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc";
import { deleteImageSchema } from "../../../utils/validation/image.schema";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../../env/server.mjs";

cloudinary.config({
  cloud_name: "cccnydirectory",
  api_key: "855593859763221",
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const imageRouter = createTRPCRouter({
  getPlaceImages: publicProcedure
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
  deleteImage: protectedProcedure
    .input(deleteImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await cloudinary.uploader.destroy(input.image_public_id);
        const deleteEntry = await ctx.prisma.placeImages.delete({
          where: {
            id: input.imageId,
          },
        });
        return deleteEntry;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
