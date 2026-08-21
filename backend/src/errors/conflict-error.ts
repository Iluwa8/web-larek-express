import { ApiError } from './api-error';

export class ConflictError extends ApiError {
  constructor(message: string = 'Товар с таким заголовком уже существует') {
    super(message, 409);
  }
}

export default ConflictError;
