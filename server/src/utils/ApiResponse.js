/**
 * Standard success envelope so the frontend can rely on a consistent shape:
 * { success, message, data }
 */
export const sendResponse = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
