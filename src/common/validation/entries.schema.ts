import z from "zod";

export const createEntrySchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  description: z.string(),
  address: z.string({
    required_error: "Address is required",
  }),
  phone_number: z.string(),
  website: z.string(),
  category: z.string(),
  tags: z.string().array(),
  opening_hours: z.string(),
  coords_lat: z.string(),
  coords_lng: z.string(),
});

export const editEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone_number: z.string(),
  website: z.string(),
  category: z.string(),
  tags: z.string().array(),
  opening_hours: z.string(),
  coords_lat: z.string(),
  coords_lng: z.string(),
});

export type CreateEntryInput = z.TypeOf<typeof createEntrySchema>;
export type EditEntrySchema = z.TypeOf<typeof editEntrySchema>;
