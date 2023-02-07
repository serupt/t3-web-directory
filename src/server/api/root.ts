import { createTRPCRouter } from "./trpc";
import { imageRouter } from "./routers/imageRouter";
import { placesRouter } from "./routers/placesRouter";
import { usersRouter } from "./routers/usersRoute";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  places: placesRouter,
  users: usersRouter,
  images: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
