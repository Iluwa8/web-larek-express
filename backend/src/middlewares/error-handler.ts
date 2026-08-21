import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { isCelebrateError } from 'celebrate';
import { ApiError } from '../errors/api-error';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (isCelebrateError(err)) {
    const message = err.details.get('body')?.message
            || err.details.get('params')?.message
            || err.details.get('query')?.message
            || 'Ошибка валидации данных';
    return res.status(400).json({ message });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Error && err.message.includes('E11000')) {
    return res.status(409).json({ message: 'Дубликат уникального поля' });
  }

  return res.status(500).json({ message: 'Ошибка по умолчанию' });
};

export default errorHandler;
