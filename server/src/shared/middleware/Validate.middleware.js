import { ZodError } from 'zod';
import { ValidationError } from '../errors/AppError.js';

export const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
        return next(new ValidationError('Validation failed', details));
      }
      next(err);
    }
  };
};
