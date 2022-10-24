import z from "zod";

export const createEntrySchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  description: z.string(),
  main_address: z.string({
    required_error: "Address is required",
  }),
  other_addresses: z.string().array(),
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
  main_address: z.string(),
  other_addresses: z.string().array(),
  phone_number: z.string(),
  website: z.string(),
  category: z.string(),
  tags: z.string().array(),
  opening_hours: z.string(),
  coords_lat: z.string(),
  coords_lng: z.string(),
});

export const deleteEntrySchema = z.object({
  id: z.string(),
});

export type CreateEntryInput = z.TypeOf<typeof createEntrySchema>;
export type EditEntryInput = z.TypeOf<typeof editEntrySchema>;
export type DeleteEntryInput = z.TypeOf<typeof deleteEntrySchema>;
