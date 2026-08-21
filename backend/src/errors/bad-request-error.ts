import { ApiError } from './api-error';

export class BadRequestError extends ApiError {
  constructor(message: string = 'Ошибка валидации данных при создании товара') {
    super(message, 400);
  }
}

export default BadRequestError;
