import type { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { AUTH_FIELDS } from '@/lib/constants';
import { userApi } from '@/lib/userApi';
import { TRole } from '@/interfaces/user.interface';

// Интерфейс для пользователя
interface ICustomUser {
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
  createdAt: string;
  updatedAt?: string;
}

// Создаем модуль для расширения типов NextAuth
declare module 'next-auth' {
  interface User extends ICustomUser {
    id: number; // по умолчанию string
    name: string; // по умолчанию string | null | undefined
  }
  interface Session extends ICustomUser {
    session: ICustomUser;
    user: ICustomUser; // AdapterUser
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
      },

      async authorize(credentials) {
        // если данных нет
        if (!credentials?.login || !credentials.password) return null;

        // запрашиваем пользователя из БД
        const currentUser = await userApi
          .getUserByLogin({
            login: credentials.login,
            password: credentials.password,
          })
          .then((res) => res.user)
          .catch(() => {
            throw new Error('Неверный пароль или Пользователь не найден');
          });

        if (currentUser) {
          console.log(currentUser);
          return currentUser as ICustomUser;
        }

        return null; // если не авторизован
      },
    }),
  ],
  // NextAuth автоматически возвращает только поля name и email
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Добавляем все поля из профиля пользователя
        token.user = user as ICustomUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем все поля из JWT в сессию
      session.user = token.user as ICustomUser;

      return session;
    },
  },
  pages: { signIn: '/login' },
};
