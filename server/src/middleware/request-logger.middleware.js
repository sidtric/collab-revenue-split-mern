import { logger } from "../lib/logger.js";

export function requestLoggerMiddleware(request, response, next) {
  const startedAt = Date.now();

  response.on("finish", () => {
    logger.info("HTTP request completed", {
      requestId: request.requestId,
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}
