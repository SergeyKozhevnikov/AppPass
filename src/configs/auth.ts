import type { AuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials'; // ввод логина и пароля
import { AUTH_FIELDS } from '@/lib/constants';

// пользователи - тест
const users = [
  { id: '1', login: 'admin', password: 'admin' },
  { id: '2', login: 'user', password: 'user' },
];

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
        // должно проверять на соответствие данным в БД - это временное
        // если данных нет
        if (!credentials?.login || !credentials.password) return null;

        // если данные есть, но пользователя не существует
        const currentUser = users.find(
          (user) => user.login === credentials.login
        );

        // если логин и пароль совпадают -> возвращаем пользователя без пароля
        if (currentUser && currentUser.password === credentials.password) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPass } = currentUser;
          return userWithoutPass as User;
        }

        return null; // если не авторизован
      },
    }),
  ],
  pages: { signIn: '/' },
};
