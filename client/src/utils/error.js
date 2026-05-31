/**
 * Normalize any Axios/Network error into a human-readable message.
 * Falls back gracefully when the server returns no structured body.
 */
export const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  if (data?.details?.length) {
    // Validation errors: surface the first field message.
    return data.details[0].message || data.message || 'Validation failed';
  }
  if (data?.message) return data.message;
  if (error?.message === 'Network Error') {
    return 'Cannot reach the server. Please check your connection.';
  }
  return error?.message || 'Something went wrong. Please try again.';
};
