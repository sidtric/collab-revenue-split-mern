import { HTTP_STATUS } from "../constants/http-status.js";
import { sendError } from "../lib/api-response.js";

export function notFoundMiddleware(request, response) {
  return sendError(response, {
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}
