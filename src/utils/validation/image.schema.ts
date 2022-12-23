import z from "zod";

export const imageSchema = z.object({
  placeId: z.number(),
  image_data: z.string(),
});

export type ImageInput = z.infer<typeof imageSchema>;
