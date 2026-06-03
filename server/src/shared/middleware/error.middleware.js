import { AppError } from '../errors/AppError.js';
import logger from '../../config/logger.js';
import { env } from '../../config/env.js';

const handlePrismaError = (error) => {
  switch (error.code) {
    case 'P2002':
      return new AppError(`Duplicate value for: ${error.meta?.target?.join(', ')}`, 409, 'CONFLICT');
    case 'P2025':
      return new AppError('Record not found', 404, 'NOT_FOUND');
    case 'P2003':
      return new AppError('Related record not found', 400, 'BAD_REQUEST');
    default:
      return new AppError('Database error', 500, 'DB_ERROR');
  }
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.code?.startsWith('P')) error = handlePrismaError(err);
  else if (['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
    error = new AppError(
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      401,
      err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
    );
    error.isOperational = true;
  }

  if (!error.isOperational) {
    logger.error('Unhandled error', { message: error.message, stack: error.stack });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: error.isOperational ? error.message : 'Internal server error',
      code: error.code || 'INTERNAL_ERROR',
      ...(error.details && { details: error.details }),
      ...(env.NODE_ENV === 'development' && !error.isOperational && { stack: error.stack }),
    },
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.method} ${req.url} not found`, code: 'NOT_FOUND' },
  });
};
