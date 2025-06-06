// схемы для проверки полей zod
import { z } from 'zod';

// схема для страницы авторизации
export const authSchema = z.object({
  login: z
    .string()
    .min(3, { message: 'Логин не может быть менее 3 символов' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Логин может содержать только латинские буквы',
    }),
  password: z
    .string()
    .min(6, { message: 'Пароль не может быть менее 6 символов' }),
  checked: z.boolean(),
});
export type authFields = z.infer<typeof authSchema>; // infer - утилита zod, которая извлекает типы из схемы валидации

// схема для страницы авторизации
export const newUserSchema = z.object({
  surname: z
    .string()
    .min(2, { message: 'Поле не может быть менее 2 символов' })
    .regex(/^[а-яА-Яa-zA-Z]+$/, {
      message: 'Поле может содержать только буквы кириллицы и латиницы',
    }),
  name: z
    .string()
    .min(2, { message: 'Поле не может быть менее 2 символов' })
    .regex(/^[а-яА-Яa-zA-Z]+$/, {
      message: 'Поле может содержать только буквы кириллицы и латиницы',
    }),
  patronymic: z
    .string()
    .min(2, { message: 'Поле не может быть менее 2 символов' })
    .regex(/^[а-яА-Яa-zA-Z]+$/, {
      message: 'Поле может содержать только буквы кириллицы и латиницы',
    }),
  login: z
    .string()
    .min(3, { message: 'Логин не может быть менее 3 символов' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Логин может содержать только латинские буквы',
    }),
  email: z.string().email({ message: 'Некорректный email-адрес' }),
  password: z
    .string()
    .min(6, { message: 'Пароль не может быть менее 6 символов' }),
});
export type newUserFields = z.infer<typeof newUserSchema>;

// схема для страницы пользователя
export const profileUserSchema = z.object({
  id: z.number().optional(),
  tabNum: z.number().optional(), // заполняется из БД - наверное, пользователю проверка не нужна
  surname: z
    .string()
    .min(2, { message: 'Поле не может быть менее 2 символов' })
    .regex(/^[а-яА-Яa-zA-Z]+$/, {
      message: 'Поле может содержать только буквы кириллицы и латиницы',
    }),
  name: z
    .string()
    .min(2, { message: 'Поле не может быть менее 2 символов' })
    .regex(/^[а-яА-Яa-zA-Z]+$/, {
      message: 'Поле может содержать только буквы кириллицы и латиницы',
    }),
  patronymic: z
    .string()
    .min(2, { message: 'Поле не может быть менее 2 символов' })
    .regex(/^[а-яА-Яa-zA-Z]+$/, {
      message: 'Поле может содержать только буквы кириллицы и латиницы',
    }),
  pos: z.string().nullable(),
  department: z.string().nullable(),
  login: z
    .string()
    .min(3, { message: 'Логин не может быть менее 3 символов' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Логин может содержать только латинские буквы',
    }),
  email: z.string().email({ message: 'Некорректный email адрес' }),
  phoneNum: z.string().nullable(),
  role: z.enum(['Пользователь', 'Администратор'], {
    message: 'Роль может быть "Пользователь" или "Администратор"',
  }),
});
export type profileUserFields = z.infer<typeof profileUserSchema>;

// схема для обновления пароля
export const passwordUserSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Пароль не может быть менее 6 символов' }),
    passwordRepeat: z.string().nonempty('Пожалуйста повторите пароль'),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'Пароли не совпадают',
    path: ['passwordRepeat'],
  });
export type passwordUserFields = z.infer<typeof passwordUserSchema>;
