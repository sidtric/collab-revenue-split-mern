import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware.js";
import { sendSuccess } from "./lib/api-response.js";
import { createCollabRouter } from "./modules/collab/collab.routes.js";

export function createApp(mongoEnabled) {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
    }),
  );
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    return sendSuccess(response, {
      message: "API healthy",
      data: {
        ok: true,
        mongoEnabled,
      },
    });
  });

  app.use("/api/collab", createCollabRouter({ mongoEnabled }));

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
