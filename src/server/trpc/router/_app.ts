// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { placesRouter } from "./placesRouter";

export const appRouter = router({
  places: placesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
