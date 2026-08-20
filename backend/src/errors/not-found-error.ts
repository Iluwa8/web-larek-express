import { ApiError } from './api-error';

export class NotFoundError extends ApiError {
  constructor(message: string = 'Ошибка валидации данных при создании товара') {
    super(message, 404);
  }
}

export default NotFoundError;
