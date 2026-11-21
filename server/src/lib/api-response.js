export function sendSuccess(response, { statusCode = 200, message = "Success", data = null }) {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(response, { statusCode = 500, message = "Internal server error", issues }) {
  return response.status(statusCode).json({
    success: false,
    message,
    issues,
  });
}
