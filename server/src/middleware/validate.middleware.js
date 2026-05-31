import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates req.body / req.params / req.query against a Zod schema.
 * On success it replaces the request parts with the parsed (coerced) values.
 */
export const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.params) req.params = parsed.params;
    if (parsed.query) req.query = parsed.query;

    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(ApiError.badRequest('Validation failed', details));
    }
    return next(error);
  }
};
