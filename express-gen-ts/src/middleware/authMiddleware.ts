import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ExtendedRequest } from '../types';

// Секретный ключ для проверки JWT токена (должен совпадать с NEXTAUTH_SECRET)
// eslint-disable-next-line n/no-process-env
const JWT_SECRET = process.env.JWT_SECRET ?? 'testjwt';

/**
 * Middleware для проверки аутентификации пользователя
 * Извлекает информацию о пользователе из JWT токена и добавляет в req.user
 */
export const authMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  // Получаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  // Если токен отсутствует, пропускаем запрос дальше (неаутентифицированный запрос)
  if (!token) {
    console.log('Токен отсутствует, пользователь не аутентифицирован');
    return next();
  }

  try {
    // Верифицируем JWT токен
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Добавляем информацию о пользователе в запрос
    req.user = {
      id: decoded.sub ? Number.parseInt(decoded.sub, 10) : 0,
      username: (decoded.name as string) || '',
      role: (decoded.role as string) || 'user',
      email: (decoded.email as string) || '',
    };

    console.log('Пользователь аутентифицирован:', req.user);
    next();
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    // Если токен недействителен, пропускаем запрос дальше (неаутентифицированный запрос)
    next();
  }
};
