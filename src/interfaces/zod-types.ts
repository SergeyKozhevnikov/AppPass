// схемы для проверки полей zod
import { z } from 'zod';

export const authSchema = z.object({
  login: z
    .string()
    .min(3, { message: 'Логин не может быть менее 3 символов' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Логин может содержать только латинские буквы',
    }),
  password: z
    .string()
    .min(4, { message: 'Пароль не может быть менее 4-х символов' }),
});

// infer - утилита zod, которая извлекает типы из схемы валидации
export type authFields = z.infer<typeof authSchema>;
