import crypto from "node:crypto";

export function requestIdMiddleware(request, response, next) {
  const requestId = crypto.randomUUID();
  request.requestId = requestId;
  response.setHeader("x-request-id", requestId);
  next();
}
