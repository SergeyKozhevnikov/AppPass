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
    .min(4, { message: 'Пароль не может быть менее 4-х символов' }),
});

export type authFields = z.infer<typeof authSchema>; // infer - утилита zod, которая извлекает типы из схемы валидации

// схема для страницы авторизации
export const newUserSchema = z.object({
  surname: z
    .string()
    .min(2, { message: 'Фамилия не может быть менее 2 символов' })
    .regex(/^[а-яА-Я]+$/, {
      message: 'Фамилия может содержать только буквы кириллицы',
    }),
  name: z
    .string()
    .min(2, { message: 'Имя не может быть менее 2 символов' })
    .regex(/^[а-яА-Я]+$/, {
      message: 'Имя может содержать только буквы кириллицы',
    }),
  patronymic: z
    .string()
    .min(2, { message: 'Отчество не может быть менее 2 символов' })
    .regex(/^[а-яА-Я]+$/, {
      message: 'Отчество может содержать только буквы кириллицы',
    }),
  login: z
    .string()
    .min(3, { message: 'Логин не может быть менее 3 символов' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Логин может содержать только латинские буквы',
    }),
  email: z.string().email({ message: 'Некорректный email адрес' }),
  password: z
    .string()
    .min(4, { message: 'Пароль не может быть менее 4-х символов' }),
});

export type newUserFields = z.infer<typeof newUserSchema>;

// схема для страницы пользователя
export const profileUserSchema = z.object({
  tabNum: z.number(), // заполняется из БД - наверное, пользователю проверка не нужна
  surname: z
    .string()
    .min(2, { message: 'Фамилия не может быть менее 2 символов' })
    .regex(/^[а-яА-Я]+$/, {
      message: 'Фамилия может содержать только буквы кириллицы',
    }),
  name: z
    .string()
    .min(2, { message: 'Имя не может быть менее 2 символов' })
    .regex(/^[а-яА-Я]+$/, {
      message: 'Имя может содержать только буквы кириллицы',
    }),
  patronymic: z
    .string()
    .min(2, { message: 'Отчество не может быть менее 2 символов' })
    .regex(/^[а-яА-Я]+$/, {
      message: 'Отчество может содержать только буквы кириллицы',
    }),
  pos: z.string().regex(/^[а-яА-Я]+$/, {
    message: 'Должность может содержать только буквы кириллицы',
  }),
  department: z.string().regex(/^[а-яА-Яa-zA-Z0-9\-]+$/, {
    message:
      'Название подразделения может состоять из латинских букв, кириллицы, цифр и дефиса',
  }),
  login: z
    .string()
    .min(3, { message: 'Логин не может быть менее 3 символов' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Логин может содержать только латинские буквы',
    }),
  email: z.string().email({ message: 'Некорректный email адрес' }),
  password: z
    .string()
    .min(4, { message: 'Пароль не может быть менее 4-х символов' }),
  phoneNum: z
    .string()
    .min(5, { message: 'Номер телефона должен быть из 5 символов' })
    .max(5, { message: 'Номер телефона должен быть из 5 символов' }),
  role: z.enum(['Пользователь', 'Администратор'], {
    message: 'Роль может быть "Пользователь" или "Администратор"',
  }),
});

export type profileUserFields = z.infer<typeof profileUserSchema>;
