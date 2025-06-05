import type { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { AUTH_FIELDS } from '@/lib/constants';
import { userApi } from '@/lib/userApi';
import { TRole } from '@/interfaces/user.interface';

// Интерфейс для пользователя
export interface ICustomUser {
  id: number;
  tabNum: number;
  role: TRole;
  surname: string;
  name: string;
  patronymic: string;
  login: string;
  email: string;
  // password: string;
  pos?: string;
  department?: string;
  phoneNum?: string;
  createdAt?: string;
  updatedAt?: string;
  maxAge?: number;
}

// Расширяем типы next-auth
declare module 'next-auth' {
  interface User extends ICustomUser {
    id: number;
    name: string;
  }
  interface Session {
    user: ICustomUser; // тут только user, не session: ICustomUser
    maxAge?: number; // Добавляем поле для хранения времени жизни сессии
  }
  interface JWT {
    id?: number;
    tabNum?: number;
    role?: TRole;
    surname?: string;
    name?: string;
    patronymic?: string;
    login?: string;
    email?: string;
    pos?: string;
    department?: string;
    phoneNum?: string;
    createdAt?: string;
    updatedAt?: string;
    maxAge?: number; // Добавляем поле для хранения времени жизни сессии
  }
}

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        login: {
          label: AUTH_FIELDS.login.label,
          type: AUTH_FIELDS.login.type,
          required: true,
        },
        password: {
          label: AUTH_FIELDS.password.label,
          type: AUTH_FIELDS.password.type,
          required: true,
        },
        rememberMe: {
          label: AUTH_FIELDS.rememberMe.label,
          type: AUTH_FIELDS.rememberMe.type,
          required: true,
        },
      },

      async authorize(credentials) {
        if (!credentials?.login || !credentials.password) return null;

        try {
          const currentUser = await userApi.getUserByLogin({
            login: credentials.login,
            password: credentials.password,
          });

          if (currentUser?.user) {
            const maxAge =
              credentials.rememberMe === 'true'
                ? 21 * 24 * 60 * 60 // сессия завершиться через 21 день если rememberMe = true
                : 12 * 60 * 60; // через 12 часов если rememberMe = false

            return {
              ...currentUser.user,
              maxAge,
            };
          }
          return null;
        } catch (error) {
          console.error(error);
          throw new Error('Неверный пароль или Пользователь не найден');
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    // maxAge: 24 * 60 * 60 * 60, // Базовое значение времени жизни сессии (1 день)
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Копируем все нужные поля из user в токен
        token.id = user.id;
        token.tabNum = user.tabNum;
        token.role = user.role;
        token.surname = user.surname;
        token.name = user.name;
        token.patronymic = user.patronymic;
        token.login = user.login;
        token.email = user.email;
        token.pos = user.pos;
        token.department = user.department;
        token.phoneNum = user.phoneNum;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;

        if (typeof user.maxAge === 'number') {
          token.maxAge = user.maxAge;
        }
      }

      if (trigger === 'update') {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      // Прокидываем поля из токена в сессию
      session.user.id = token.id as number;
      session.user.tabNum = token.tabNum as number;
      session.user.role = token.role as TRole;
      session.user.surname = token.surname as string;
      session.user.name = token.name as string;
      session.user.patronymic = token.patronymic as string;
      session.user.login = token.login as string;
      session.user.email = token.email as string;
      session.user.pos = token.pos as string;
      session.user.department = token.department as string;
      session.user.phoneNum = token.phoneNum as string;
      session.user.createdAt = token.createdAt as string;
      session.user.updatedAt = token.updatedAt as string;

      // Устанавливаем время жизни сессии
      if (token.maxAge) {
        session.maxAge = token.maxAge as number;
      }

      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
};
