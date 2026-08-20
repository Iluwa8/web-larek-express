import { ApiError } from './api-error';

export class ConflictError extends ApiError {
  constructor(message: string = 'Ошибка валидации данных при создании товара') {
    super(message, 409);
  }
}

export default ConflictError;
