import z from "zod";

export const placeSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  phone_number: z.string(),
  email: z.string(),
  website: z.string(),
  description: z.string(),
  opening_hours: z.string(),

  main_address: z.string({
    required_error: "Main address is required",
  }),
  other_addresses: z.string().array(),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  category: z.string(),
  tags: z.string().array(),
});

export const createImportSchema = z.object({
  name: z.string(),
  description: z.string(),
  main_address: z.string(),
  other_addresses: z.string(),
  phone_number: z.string(),
  email: z.string(),
  website: z.string(),
  category: z.string(),
  tags: z.string(),
  opening_hours: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

export const editPlaceSchema = z.object({
  id: z.number(),
  name: z.string({
    required_error: "Name is required",
  }),
  phone_number: z.string(),
  email: z.string(),
  website: z.string(),
  description: z.string(),
  opening_hours: z.string(),

  main_address: z.string({
    required_error: "Main address is required",
  }),
  other_addresses: z.string().array(),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  category: z.string(),
  tags: z.string().array(),
});

export const deletePlaceSchema = z.object({
  id: z.number(),
});

export type PlaceInput = z.TypeOf<typeof placeSchema>;

export type ImportPlaceInput = z.TypeOf<typeof createImportSchema>;
export type EditPlaceInput = z.TypeOf<typeof editPlaceSchema>;
export type DeletePlaceInput = z.TypeOf<typeof deletePlaceSchema>;
