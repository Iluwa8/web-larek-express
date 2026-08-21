import { ApiError } from './api-error';

export class NotFoundError extends ApiError {
  constructor(message: string = 'Ресурс не найден') {
    super(message, 404);
  }
}

export default NotFoundError;
