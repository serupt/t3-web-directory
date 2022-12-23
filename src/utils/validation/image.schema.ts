import z from "zod";

export const imageSchema = z.object({
  placeId: z.number(),
});

export const uploadImageSchema = z.object({
  placeId: z.number(),
  image_public_id: z.string(),
  image_url: z.string(),
});

export type ImageInput = z.infer<typeof imageSchema>;
export type ImageUploadInput = z.infer<typeof uploadImageSchema>;
