import type { Request } from 'express';

// Расширение типа Request для добавления пользовательских свойств
export interface ExtendedRequest extends Request {
  user?: {
    id: number,
    username: string,
    role: string,
    email: string,
  };
}
