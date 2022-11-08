// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { placesRouter } from "./placesRouter";
import { usersRouter } from "./usersRoute";

export const appRouter = router({
  places: placesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
