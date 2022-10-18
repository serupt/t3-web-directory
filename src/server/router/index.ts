// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedEntriesRouter } from "./protected-entries.router";
import { entriesRouter } from "./entries.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("entries.", entriesRouter)
  .merge("protectedEntries.", protectedEntriesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
