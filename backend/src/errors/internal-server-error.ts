import { ApiError } from './api-error';

export class InternalServerError extends ApiError {
  constructor(message: string = 'Внутренняя ошибка сервера') {
    super(message, 500);
  }
}

export default InternalServerError;
