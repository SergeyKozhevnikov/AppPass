import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import {
  getUser,
  getUsers,
  getUserByLogin,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/usersController';

const router = express.Router();

type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Маршруты для пользователей
router.get('/', asyncHandler(getUsers)); // возвращает пользователей
router.get('/:id', asyncHandler(getUser)); // возвращает пользователя
router.post('/login/:login', asyncHandler(getUserByLogin)); // возвращает пользователя по логину
router.post('/', asyncHandler(createUser)); // создаёт пользователя
router.patch('/:id', asyncHandler(updateUser)); // обновляет информацию о пользователе
router.delete('/:id', asyncHandler(deleteUser)); // удаляет пользователя

export default router;
