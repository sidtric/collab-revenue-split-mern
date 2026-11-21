import { ZodError } from "zod";
import { HTTP_STATUS } from "../constants/http-status.js";
import { sendError } from "../lib/api-response.js";
import { logger } from "../lib/logger.js";

export function errorMiddleware(error, _request, response, _next) {
  logger.error("Request failed", {
    requestId: _request.requestId,
    message: error.message,
  });

  if (error instanceof ZodError) {
    return sendError(response, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: "Invalid request payload",
      issues: error.issues,
    });
  }

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  return sendError(response, {
    statusCode,
    message: error.message || "Internal server error",
  });
}
